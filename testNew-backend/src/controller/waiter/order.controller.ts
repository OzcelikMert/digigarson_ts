import { Request, Response } from "express";
import { createNewOrder, addNewOrder, deleteOrder } from "../../service/order.service";
import { get } from "lodash";
import { findTable, findAndUpdate, tableInsertLog, updateOne, closeTable, tableIsPrint } from "../../service/table.service";
import { logdb } from "../../logger";

//waiter olarak görev yapan kullanıcı parametreden gelen tableId adına sipariş oluşturur.
export async function createOrderHandler(req: Request, res: Response) {
    const tableId = get(req.params, "tableId");
    const orders = get(req.body, "products");
    await tableInsertLog(tableId, req.body.products.map((order: any) => logdb(`w:${req.baseUrl.split('/')[2]}${get(req, "user._id")};p0:${order.productName};p1:${order.priceName};q:${order.quantity};h:createOrderRequest`)))
    const adding: any = await createNewOrder(req.body.products, tableId, 1)
    if (adding.n && adding.ok && adding.nModified)
        await tableInsertLog(tableId, req.body.products.map((order: any) => logdb(`w:${req.baseUrl.split('/')[2]}${get(req, "user._id")};p0:${order.productName};p1:${order.priceName};q:${order.quantity};h:orderCreated`)))
    return res.send(orders);
}
//waiter olarak görev yapan kullanıcı parametreden gelen tableId adına siparişe ürün ekler.
export async function addProductOrderHandler(req: Request, res: Response) {
    const tableId = get(req.params, "tableId");

    let table: any = await findTable({ _id: tableId })
    if (!table) {
        return res.status(404).json({ success: false, message: "Table not found." })
    }
    await tableInsertLog(tableId, req.body.products.map((order: any) => logdb(`w:${req.baseUrl.split('/')[2]}${get(req, "user._id")};p0:${order.productName};p1:${order.priceName};q:${order.quantity};h:addOrderRequest`)))
    const adding: any = await addNewOrder(req.body.products, tableId)
    if (adding.n && adding.ok && adding.nModified)
        await tableInsertLog(tableId, req.body.products.map((order: any) => logdb(`w:${req.baseUrl.split('/')[2]}${get(req, "user._id")};p0:${order.productName};p1:${order.priceName};q:${order.quantity};h:orderAdded`)))
        await tableIsPrint(tableId, false, false)
        return res.sendStatus(200);
}

//waiter olarak görev yapan kullanıcı parametreden gelen tableId adına siparişte değişiklik yapar.
export async function updateOrderHandler(req: Request, res: Response) {
    const tableId = get(req.params, "tableId");
    const orderId = get(req.params, "orderId");
    await tableInsertLog(tableId, [logdb(`w:${req.baseUrl.split('/')[2]}${get(req, "user._id")};o:${orderId};p:${req.body.price};q:${req.body.quantity};h:orderUpdateRequest`)])

    let updated: any = await updateOne({ "_id": tableId, "orders._id": orderId }, {
        "$set": {
            "orders.$.price": req.body.price,
            "orders.$.quantity": req.body.quantity
        }
    })
    if (updated.n && updated.ok && updated.nModified)
        await tableInsertLog(tableId, [logdb(`w:${req.baseUrl.split('/')[2]}${get(req, "user._id")};o:${orderId};p:${req.body.price};q:${req.body.quantity};h:orderUpdated`)])
    return res.sendStatus(200);
}

//waiter olarak görev yapan kullanıcı parametreden gelen tableId adına siparişi siler.
export async function deleteOrderHandler(req: Request, res: Response) {
    const tableId = get(req.params, "tableId");
    const orderId = get(req.params, "orderId");
    await tableInsertLog(tableId, [logdb(`w:${req.baseUrl.split('/')[2]}${get(req, "user._id")};o:${orderId};h:orderDeleteRequest`)])
    let table: any = await deleteOrder(tableId, orderId)
    let order: any = table.orders.find((x: any) => `${x._id}` == orderId)
    if (!order) return res.status(400).json({ success: false, error: "Order not found!" })
    await tableInsertLog(tableId, [logdb(`w:${req.baseUrl.split('/')[2]}${get(req, "user._id")};o:${orderId};p0:${order.productName};p1:${order.priceName};q:${order.quantity};h:orderDeleted`)])
    table = await findTable({ _id: tableId }, { orders: 1 })
    if (table.orders?.length==0|| table.orders?.length == table.paid_orders?.length) await closeTable(tableId)
    return res.sendStatus(200);
}