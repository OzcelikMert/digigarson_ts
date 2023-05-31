import { ok } from "assert";
import { Request, Response } from "express";
import { get } from "lodash";
import { findCase } from "../../service/case.service";
import { createCheck } from "../../service/check.service";
import { closeTable, findTable } from "../../service/table.service";
import { createPayment, getTablePayment, updatePayment, getTableTotalCheck, getTableTotalPayments } from "../../service/table.service";


// @desc    get App Order by Id
// @route   GET /v1/app/tables/:orderId
// @access  Private

// app için ödeme yapılan fonsiyon.
//parametreden gelen orderId yi getirip, body den gelen bilgilere göre ödemelerin yapılmasını sağlıyor.

export async function payAppHandler(req: Request, res: Response) {
    // const _id = get(req, "user._id");

    // const orderId = get(req.params, "orderId");

    // const payments: any[] = get(req.body, "payments");
    
    // for (let payment of payments) {
    //     let tablePayment = await getTablePayment(orderId, payment.type, payment.currency)
    //     if (tablePayment) {
    //         // Update
    //         await updatePayment(orderId, payment.type, payment.amount, payment.currency)
    //     } else {
    //         // Create
    //         await createPayment(orderId, payment.type, payment.amount, payment.currency)
    //     }
    // }

    // //masaya ait toplam ödenmesi gereken miktarı ile ödenen miktarı getiriyor.
    // const total = await getTableTotalCheck(orderId)
    // const paymentReceived = await getTableTotalPayments(orderId);

    // /// Ödenmesi gereken miktar ile ödenen miktar eşit mi eğer eşit ise hesap kapanır, 
    // if (total.amount === paymentReceived.amount) {

    //     /// Get Table
    //     // masayı bulmamızı sağlıyor.
    //     const table: any = await findTable({ _id: orderId });
        
    //     /// Adisyon oluşturulcak
    //     let check = await createCheck({
    //         branch: table.branch,
    //         order_type: table.order_type,
    //         payments: table.payments,
    //         products: table.orders,
    //         table: orderId,
    //         user: _id
    //     })


    //     //Masayı ilk hale döndürmek (busy:false,payments:[],orders:[],..........)
    //     await closeTable(orderId)


    // }
    res.send("ok")
}

