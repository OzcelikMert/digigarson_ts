import { Request, Response } from "express";
import { get, set } from "lodash";
import { logdb } from "../../logger";
import { findOneBranch } from "../../service/branch.service";
import { insertCheckIdToCase, findCase, createBalance, updateBalance, getCaseBalance } from "../../service/case.service";
import { findCheck, updateCheckPayments } from "../../service/check.service";
import { findProduct } from "../../service/product.service";
import { findTable, getTableProductsWithInfo, getTableTotalCheck, getTableTotalPayments } from "../../service/table.service";
// @desc    get Check by Id
// @route   GET /v1/checks/:tableId
// @access  Private
//pos olarak görev yaptığı branch e ödemelerini gösterir.
export async function getCheckHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const branch: any = await findOneBranch({ _id: branchId })
    const tableId = get(req.params, "tableId");
    let table: any = await findTable({ _id: tableId }, {}, {})
    let total = await getTableTotalCheck(tableId)
    let orders = await getTableProductsWithInfo(tableId);
    let paymentReceived = await getTableTotalPayments(tableId);
    let check = {
        branch: branch.title,
        table: table.title,
        discount: table.discount? table.discount: [] ,
        cover: table.cover,
        payments: table.payments,
        orders,
        paid_orders: table.paid_orders,
        total,
        paymentReceived,
        order_status: table.order_status,
        order_confirmation_status: table.order_confirmation_status,
    }
    res.send(check)
}

// @desc    get old Check by Id
// @route   GET /v1/checks/old/:checkId
// @access  Private
//pos olarak görev yaptığı branch e ödemelerini gösterir.
export async function getOldCheckHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const checkId = get(req.params, "checkId");
    let check: any = await findCheck({ _id: checkId, branch: branchId});        
    
    if (!check) res.status(404).json({ error: false, message: "Check not found." })

    let tableId = check.table;
    let table: any = await findTable({id: tableId }, {}, {})
    const branch: any = await findOneBranch({ _id: branchId })
    table ? set(check, "table", table.title): null; 
    branch ? set(check, "branch", branch.title): null; 
    res.send(check);
}

// @desc    Put old Check by Id
// @route   PUT /v1/checks/old/:checkId
// @access  Private
//pos olarak görev yaptığı branch e adisyon günceller.
export async function updateOldCheckHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const checkId = get(req.params, "checkId");
    const userId = get(req, "user._id")

    let _case: any = await findCase({ user: userId, is_open: true })
    if (!_case) {
        return res.status(404).json({ success: false, message: "Case not found. Please open case." });
    }

    const { payments } = req.body
    payments.map((payment: any) => {
        payment.amount = Number(payment.amount);
        return payment;
    })

    let check:any = await findCheck({ _id: checkId, branch: branchId })
    if (!check) return res.status(404).json({ error: false, message: "Check not found." })

    let changedPayments = [...check.payments.map((currentPayment: any) => {
        let newPayment = payments.find((y: any) => y.type == currentPayment.type && y.currency == currentPayment.currency)
        if (!newPayment) return { ...currentPayment, amount: Number(currentPayment.amount) * -1 }

        return { ...currentPayment, amount: Number(newPayment.amount) - Number(currentPayment.amount) }

    }), ...payments.filter((newPayment: any) => {
        let exists = check!.payments!.find((y: any) => y.type == newPayment.type && y.currency == newPayment.currency)
        if (!exists) return true
        return false
    })].filter((x: any) => x.amount != 0)

    let logs: any[] = []
 
    for (let payment of changedPayments) {
        let tablePayment = await getCaseBalance(_case._id, payment.type, payment.currency)
        logs.push(logdb(`w:${req.baseUrl.split('/')[2]}${get(req, "user._id")};t:${payment.type};a:${payment.amount};c:${payment.currency};h:checkPaymentEdit`))
        if (tablePayment) {
            // Update
            await updateBalance(_case._id, payment.type, Number(payment.amount), payment.currency)
        } else {
            // Create
            await createBalance(_case._id, payment.type, Number(payment.amount), payment.currency)
        }
    }

    check = await updateCheckPayments({ _id: checkId }, { ...check, payments, logs: [...check.logs, ...logs] })
    return res.send(check)
}
