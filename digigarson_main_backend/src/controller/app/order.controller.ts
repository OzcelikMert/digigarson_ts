import { Request, Response } from "express";
import { createNewOrder, updateOrder } from "../../service/order.service";
import { get } from "lodash";
import { findTable, tableInsertLog } from "../../service/table.service";
import { instertUserId } from "../../service/app.service";
import { addNewOrder, findOrder, applyTableDiscount } from "../../service/order.service";
import { logdb } from "../../logger";
import { findBranch, findOneBranch } from "../../service/branch.service";
import { findDiscount, findOneDiscount } from "../../service/userdiscount.service";
import { Discount } from "../../model/table.model";


// @desc    get Order by Id
// @route   GET /v1/pos/tables/:orderId
// @access  Private 
//pos olarak görev yaptığı branch e siparişlerin listesini gösterir.
export async function getOrderHandler(req: Request, res: Response) {
    const tableId = get(req.params, "tableId");
    let table: any = await findTable({ _id: tableId })
    let order = await findOrder(table._id)
    return res.send(order);
}


//waiter olarak görev yapan kullanıcı parametreden gelen tableId adına sipariş oluşturur.
export async function createOrderHandler(req: Request, res: Response) {
    const tableId = get(req.params, "tableId");
    const orders = get(req.body, "products");
    const discountKey = get(req.body, "discountKey");
    const userId = get(req, "user._id");
    console.log({ tableId, orders, userId });
    await instertUserId(userId, tableId);
    await tableInsertLog(tableId, req.body.products.map((order: any) => logdb(`w:${req.baseUrl.split('/')[2]}${get(req, "user._id")};p0:${order.productName};p1:${order.priceName};q:${order.quantity};h:createOrderRequest`)))
    const adding: any = await createNewOrder(req.body.products, tableId, 1)
    if (adding.n && adding.ok && adding.nModified)
        await tableInsertLog(tableId, req.body.products.map((order: any) => logdb(`w:${req.baseUrl.split('/')[2]}${get(req, "user._id")};p0:${order.productName};p1:${order.priceName};q:${order.quantity};h:orderCreated`)))
    if(discountKey!=""){
        const discountDoc: any = await findOneDiscount({ key: discountKey }, {});
        console.log(discountDoc, discountKey)
    const discount: Discount = { amount: discountDoc?.discountAmount , type: discountDoc?.type, note: discountDoc.note };
       await applyTableDiscount(discount, tableId); 
    };
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
    return res.sendStatus(200);
}


// @desc    get branch services
// @route   GET /v1/app/services/:branchId'
// @access  Public
export async function getAllServices(req: Request, res: Response) {
    try {
        let branchId = get(req.params, "branchId");
        let branch: any = await findOneBranch({ _id: branchId }, { user_services: 1 });
        res.send(branch.user_services)
    } catch (e: any) {
        return res.status(400).send(e.message);
    }
}