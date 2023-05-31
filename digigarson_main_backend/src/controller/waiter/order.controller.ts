import { Request, Response } from "express";
import { createNewOrder, addNewOrder, deleteOrder } from "../../service/order.service";
import { get } from "lodash";
import { findTable, findAndUpdate, tableInsertLog, updateOne, closeTable, tableIsPrint, updateTotalPrice } from "../../service/table.service";
import { logdb } from "../../logger";

//waiter olarak görev yapan kullanıcı parametreden gelen tableId adına sipariş oluşturur.
export async function createOrderHandler(req: Request, res: Response) {
    const tableId = get(req.params, "tableId");
    let orders: any = get(req.body, "products");
    let totalPrice: number = get(req.body, "totalPrice");
    await tableInsertLog(tableId, orders.map((order: any) => logdb(`w:${req.baseUrl.split('/')[2]}${get(req, "user._id")};p0:${order.productName};p1:${order.priceName};q:${order.quantity};h:createOrderRequest`)))
    const adding: any = await createNewOrder(orders, tableId, 1)
    if (adding.n && adding.ok && adding.nModified){
        await updateTotalPrice(tableId, totalPrice);
        await tableInsertLog(tableId, orders.map((order: any) => logdb(`w:${req.baseUrl.split('/')[2]}${get(req, "user._id")};p0:${order.productName};p1:${order.priceName};q:${order.quantity};h:orderCreated`)))
        let table: any = await findTable({ _id: tableId });
        orders = table.orders;
    }
    return res.send({
        orders: orders,
        totalPrice: totalPrice
    });
}
//waiter olarak görev yapan kullanıcı parametreden gelen tableId adına siparişe ürün ekler.
export async function addProductOrderHandler(req: Request, res: Response) {
    const tableId = get(req.params, "tableId");
    let orders: any = get(req.body, "products");
    let totalPrice: number = get(req.body, "totalPrice");
    
    let table: any = await findTable({ _id: tableId })
    if (!table) {
        return res.status(404).json({ success: false, message: "Table not found." })
    }
    await tableInsertLog(tableId, orders.map((order: any) => logdb(`w:${req.baseUrl.split('/')[2]}${get(req, "user._id")};p0:${order.productName};p1:${order.priceName};q:${order.quantity};h:addOrderRequest`)))
    const adding: any = await addNewOrder(orders, tableId)
    if (adding.n && adding.ok && adding.nModified){
        await tableInsertLog(tableId, orders.map((order: any) => logdb(`w:${req.baseUrl.split('/')[2]}${get(req, "user._id")};p0:${order.productName};p1:${order.priceName};q:${order.quantity};h:orderAdded`)))
        await tableIsPrint(tableId, false, false)
        let table: any = await findTable({ _id: tableId });
        totalPrice += Number(table.totalPrice);
        await updateTotalPrice(tableId, totalPrice);
        orders = table.orders;
    }
    
    return res.status(200).send({
        orders: orders,
        totalPrice: totalPrice
    });
}

//waiter olarak görev yapan kullanıcı parametreden gelen tableId adına siparişte değişiklik yapar.
export async function updateOrderHandler(req: Request, res: Response) {
    const tableId = get(req.params, "tableId");
    const orderId = get(req.params, "orderId");
    let oldTable: any = await findTable({ _id: tableId });
    await tableInsertLog(tableId, [logdb(`w:${req.baseUrl.split('/')[2]}${get(req, "user._id")};o:${orderId};p:${req.body.price};q:${req.body.quantity};h:orderUpdateRequest`)])
    let updated: any = await updateOne({ "_id": tableId, "orders._id": orderId }, {
        "$set": {
            "orders.$.price": req.body.price,
            "orders.$.quantity": req.body.quantity
        }
    })
    if (updated.n && updated.ok && updated.nModified){
        let table: any = await findTable({ _id: tableId });
        table.totalPrice = Number(table.totalPrice) - Number(oldTable.orders.findSingle("_id", orderId)?.price);
        await updateTotalPrice(tableId, (Number(req.body.price) + Number(table.totalPrice)));
        await tableInsertLog(tableId, [logdb(`w:${req.baseUrl.split('/')[2]}${get(req, "user._id")};o:${orderId};p:${req.body.price};q:${req.body.quantity};h:orderUpdated`)])
    }

    return res.sendStatus(200);
}

//waiter olarak görev yapan kullanıcı parametreden gelen tableId adına siparişi siler.
export async function deleteOrderHandler(req: Request, res: Response) {
    const tableId = get(req.params, "tableId");
    const orderId = get(req.params, "orderId");
    let table: any = await findTable({ _id: tableId });
    table.totalPrice -= Number(table.orders.findSingle("_id", orderId)?.price ?? 0);
    await tableInsertLog(tableId, [logdb(`w:${req.baseUrl.split('/')[2]}${get(req, "user._id")};o:${orderId};h:orderDeleteRequest`)])
    await deleteOrder(tableId, orderId)
    await updateTotalPrice(tableId, Number(table.totalPrice));
    table = await findTable({ _id: tableId }, { orders: 1 })
    if (table?.orders?.findMulti("isDeleted", false).length == 0) await closeTable(tableId)
    return res.sendStatus(200);
}