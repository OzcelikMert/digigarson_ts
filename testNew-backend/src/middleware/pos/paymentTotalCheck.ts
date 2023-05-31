import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { findTable, getTableTotalCheck, getTableTotalPayments } from "../../service/table.service";

//ödenen toplam hesabı gösterir.
const paymentTotalCheck = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const tableId = get(req.params, "tableId");
    const orders: any[] = get(req.body, "orders");
    const table: any = await findTable({ _id: tableId }, {}, {});
    /// KUR FARKLARI YAZILICAK, TL OLARAK HESAPLANIYOR ŞUAN.
    /// Check table products and requesy body products
    const checkOrders = orders.every(reqOrder => {
        /// current orders
        let tableOrders: any = table.orders.find((tableOrder: { _id: any; }) => reqOrder.id == tableOrder._id);
        if (!tableOrders) {
            /// This product not in orders.
            return false
        }
        // // already paid orders
        let tablePaidProduct = table.paid_orders.find((order: { id: any; }) => order.id == reqOrder.id);
        // check 
        if (tableOrders.quantity >= reqOrder.quantity + (tablePaidProduct ? tablePaidProduct.quantity : 0)) {
            return true
        } else {
            return false
        }
    })
    if (!checkOrders)
        return res.status(400).json({ success: false, message: "Paid orders error" })


    const payments: any[] = get(req.body, "payments");
    const total = await getTableTotalCheck(tableId)
    const paymentReceived = await getTableTotalPayments(tableId);
    let newPayments = payments.reduce((prev, next) => ({ ...prev, amount: Number((prev.amount + next.amount).toFixed(2)) }), ({ amount: 0.00, currency: "TL" }));
    /// Check newPayment + payments <= total !!! ödemeler, sipariş toplamını geçemez
    if (paymentReceived.amount + newPayments.amount > total.amount) {
        //req.body.payments.push({ type: 14, amount: paymentReceived.amount + newPayments.amount - total.amount, currency: "TL" })
    }

    return next();
};
export default paymentTotalCheck;
