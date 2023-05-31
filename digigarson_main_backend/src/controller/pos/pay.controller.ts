import { ok } from "assert";
import { Request, Response } from "express";
import { get } from "lodash";
import { findOneBranch } from "../../service/branch.service";
import { createCheck, findCheck, getCheckTotalPayments, getTotalCheck, updateCheckPayments } from "../../service/check.service";
import { closeTable, findTable } from "../../service/table.service";
import { createPayment, getTablePayment, updatePayment, getTableTotalCheck, getTableTotalPayments, createPaidOrder, updatePaidOrder, getTablePaidOrder, updateTotalPrice } from "../../service/table.service";
import { insertCheckIdToCase, findCase, createBalance, updateBalance, getCaseBalance, findCases } from "../../service/case.service";
import { request } from "http";
import { addTicks } from "../../service/branchticks.sevice";


// @desc    get Order by Id
// @route   GET /v1/tables/:orderId
// @access  Private
//pos olarak görev yaptığı branch de ödeme işlemlerini yapar.
export async function payHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const userId = get(req, "user._id")

    let _case: any = await findCase({ user: userId, is_open: true })
    if (!_case) {
        return res.status(404).json({ success: false, message: "Case not found. Please open case." });
    }
    
    const tableId = get(req.params, "tableId");
    let table: any = await findTable({_id: tableId});

    // const payments: any[] = get(req.body, "payments");
    const { payments, orders } = req.body
    
    for (let payment of payments) {
        let tablePayment = await getTablePayment(tableId, payment.type, payment.currency)
        if (tablePayment) {
            // Update
            await updatePayment(tableId, payment.type, payment.amount, payment.currency)
        } else {
            // Create
            await createPayment(tableId, payment.type, payment.amount, payment.currency, payment?.tickId)
        }
        table.totalPrice = Number(table.totalPrice) - Number(payment.amount);
        await updateTotalPrice(tableId, table.totalPrice);
    }
    
    if(orders) {
        //  Paid Orders
        for (let order of orders) {
            let paidOrder = await getTablePaidOrder(tableId, order.id)
            if (paidOrder) {
                // Update
                await updatePaidOrder(tableId, order.id, order.quantity)
            } else {
                // Create
                await createPaidOrder(tableId, order.id, order.quantity)
            }
        }
    }

    /// Ödenmesi gereken miktar ile ödenen miktar eşit mi eğer eşit ise hesap kapanır,
    if (table.totalPrice <= 0) {
        /// Close Table, Instert Case
        table = await findTable({_id: tableId});
        // get Case
        const Case: any = await findCases({branch: branchId, is_open: true})
        /// Adisyon oluşturulcak
        let check = await createCheck({
            branch: branchId,
            order_type: table.order_type,
            cover: table.cover,
            discount: table.discount,
            payments: table.payments,
            products: table.orders,
            table: tableId,
            user: userId,
            logs: table.logs,
            is_it_paid: true,
            caseId: Case._id
        })

        //Veresiye Ödemesi eklenir
        for (let payment of table.payments) {
            if (payment.type == 6) {
                await addTicks({_id: payment.tickId}, {checkId: check._id, debt: payment.amount})
            }
        }


        /// Posun açık olduğu kasaya oluşturulan adisyon verileri işlenicek

        ////Açık olan kasaya yeni oluşturulan adisyonu ekler
        await insertCheckIdToCase(_case._id, check._id)

        /// Oluşturulan adisyon ödemelerini açık olan kasaya işleme.

        for (let payment of table.payments) {
            let tablePayment = await getCaseBalance(_case._id, payment.type, payment.currency)
            if (tablePayment) {
                // Update
                await updateBalance(_case._id, payment.type, payment.amount, payment.currency)
            } else {
                // Create
                await createBalance(_case._id, payment.type, payment.amount, payment.currency)
            }
        }

        //Masayı ilk hale döndürrrrmek (busy:false,payments:[],orders:[],..........)
        if (!table.isSafeSales) {
            await closeTable(tableId)
        }

    }
    
    return res.sendStatus(200)
}



// @desc    pay Home Delivery Checks by Id
// @route   GET /v1/home-delivery/:/checkId/pay
// @access  Private
//pos olarak görev yaptığı branch de ödeme işlemlerini yapar.
export async function payHomeDeliveryChecksHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const userId = get(req, "user._id")

    let _case: any = await findCase({ user: userId, is_open: true })
    if (!_case) {
        return res.status(404).json({ success: false, message: "Case not found. Please open case." });
    }

    const checkId = get(req.params, "checkId");
    let check: any = await findCheck({ _id: checkId, order_type: 3, is_it_paid: false })
    if (!check) {
        return res.status(404).json({ success: false, message: "Check not found." });
    }
    const { payments } = req.body

    //  Paid Orders

    const total = await getTotalCheck(check)
    const newPaymentTotal = payments.reduce((prev: any, all: any) => ({ ...prev, amount: all.amount + prev.amount }), { amount: 0 });


    /// Ödenmesi gereken miktar ile ödenen miktar eşit mi eğer eşit ise hesap kapanır, 
    if (total.amount <= newPaymentTotal.amount) {
        /// Close Table, Instert Case
        let logs: any[] = []

        check = await updateCheckPayments({ _id: checkId }, { ...check, is_it_paid: true, payments })
        /// Posun açık olduğu kasaya oluşturulan adisyon verileri işlenicek

        ////Açık olan kasaya yeni oluşturulan adisyonu ekler
        await insertCheckIdToCase(_case._id, check._id)

        /// Oluşturulan adisyon ödemelerini açık olan kasaya işleme.
        for (let payment of payments) {
            let tablePayment = await getCaseBalance(_case._id, payment.type, payment.currency)
            if (tablePayment) {
                // Update
                await updateBalance(_case._id, payment.type, payment.amount, payment.currency)
            } else {
                // Create
                await createBalance(_case._id, payment.type, payment.amount, payment.currency)
            }
        }
        return res.sendStatus(200)
    }else{
        return res.status(400).json({success:false,message:"Payment amount not enought."})
    }

}