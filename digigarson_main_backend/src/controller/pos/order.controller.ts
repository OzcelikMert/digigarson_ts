import {Request, Response} from "express";
import {get} from "lodash";
import {
    AnyKeys,
    isValidObjectId,
    Types
} from "mongoose";
import {findOneBranch} from "../../service/branch.service";
import {findCase} from "../../service/case.service";
import {countChecks, findChecks, isPrintUpdateCheckOrder} from "../../service/check.service";
import {
    applyTableCover,
    applyTableDiscount,
    applyTablePayments,
    createNewHomeDeliveryOrder,
    findOrder,
    isPrintUpdateOrder,
    updateAddOrder,
    deleteOrder
} from "../../service/order.service";
import {closeTable, findTable, findTables, tableInsertLog, updateOne, findAndUpdate, getTableTotalCheck, updateTotalPrice} from "../../service/table.service";
import {logdb} from "../../logger";
import Table from '../../model/table.model';


// @desc    get Order by Id
// @route   GET /v1/pos/tables/:orderId
// @access  Private 
//pos olarak görev yaptığı branch e siparişlerin listesini gösterir.
export async function getOrderHandler(req: Request, res: Response) {
    try {
        const tableId = get(req.params, "tableId");
        let orders = await Table.findById(tableId).select('orders -_id');
        return res.send(orders);
    }catch(e: any){
        return res.status(500).json({success:false, message: e.message});
    }

}


// @desc    get Order by Id
// @route   GET /v1/pos/tables
// @access  Private 
export async function getTableOrdersByWaiterId(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    let tables = await findTables({branch: branchId}, {orders: 1, title: 1, section: 1})
    return res.send(tables);
}


// @desc    apply discount
// @route   GET /v1/pos/orders/:tableId/discount
// @access  Private
export async function applyDiscount(req: Request, res: Response) {
    const tableId = get(req.params, "tableId");
    const table: any = await findTable({_id: tableId});
    if (!table) {
        return res.sendStatus(400).json({success: false, message: "Table is not found"})
    }
    let discount = req.body
    if(discount.type == 0){
        discount.amount = (table.totalPrice * discount.amount) / 100;
        discount.type = 1;
    }
    await applyTableDiscount(discount, tableId)
    table.totalPrice -= discount.amount;
    await updateTotalPrice(tableId, Number(table.totalPrice));
    res.send("Ok")
}


// @desc    apply cover
// @route   GET /v1/pos/orders/:tableId/discount
// @access  Private
export async function applyCover(req: Request, res: Response) {

    const tableId = get(req.params, "tableId");
    const table: any = await findTable({_id: tableId});
    if (!table) {
        return res.sendStatus(400).json({success: false, message: "Table is not found"})
    }
    let cover = req.body
    await applyTableCover(cover, tableId)
    table.totalPrice = Number(table.totalPrice) + Number(cover.price);
    await updateTotalPrice(tableId, table.totalPrice);
    res.send("Ok")
}


//Create Home Delivery Order
export async function createHomeDeliveryOrderHandler(req: Request, res: Response) {

    const userId = get(req, "user._id")
    let _case: any = await findCase({user: userId, is_open: true})
    if (!_case) {
        return res.status(404).json({success: false, message: "Case not found. Please open case."});
    }
    const branchId = get(req, "user.branchId");
    const orders = get(req.body, "products");
    const defaultPaymentType = get(req.body, "defaultPaymentType");
    const customer = get(req.body, "customer");
    const courier = get(req.body, "courier");
    let check = await createNewHomeDeliveryOrder(orders, branchId, defaultPaymentType, _case._id, userId, customer, courier)
    return res.send(check);
}

//Get Home Delivery Order
export async function getHomeDeliveryOrdersHandler(req: Request, res: Response) {
    const userId = get(req, "user._id")
    let _case: any = await findCase({user: userId, is_open: true})
    if (!_case) {
        return res.status(404).json({success: false, message: "Case not found. Please open case ."});
    }
    const branchId = get(req, "user.branchId");
    const range = req.query;
    let _mongoQuery = JSON.parse(get(req, "params._mongoQuery"))
    let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"))
    
    if (req.query.is_it_paid) {
        _mongoQuery = Object.assign(_mongoQuery, {is_it_paid: (req.query.is_it_paid == "1")})
    }

    let checks = await findChecks({..._mongoQuery, branch: branchId, order_type: 3, caseId: _case._id}, _mongoOptions)
    const count = await countChecks({..._mongoQuery, branch: branchId, order_type: 3, caseId: _case._id})
    res.setHeader("Content-Range", `checks ${range._start}-${range._end}/${count}`);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
    res.setHeader('X-Total-Count', count)
    res.send(checks)
}

// @desc    update isPrint status
export async function UpdateIsPrintHomeDeliveryOrder(req: Request, res: Response) {
    const checkId = get(req.params, "checkId");
    const orderId: string[] = get(req.body, "orderId");
    const status = get(req.body, "status");
    let isWrong = false;

    const check: any = await findChecks({_id: checkId});
    if (!check) {
        return res.sendStatus(404).json({success: false, message: "Check is not found"})
    }

    if(orderId.every(id => Types.ObjectId.isValid(id))){
        await isPrintUpdateCheckOrder(checkId, orderId, status)
        return res.send("ok")
    }

    return res.sendStatus(400).json({success: false, message: "Check is not found"})
}

// @desc    update isPrint status
// @route   PUT /v1/pos/isprint/table/:tableId/orders
// @access  Private
export async function UpdateIsPrintOrder(req: Request, res: Response) {
    const tableId = get(req.params, "tableId");
    const orderId: string[] = get(req.body, "orderId");
    const status = get(req.body, "status");
    let isWrong = false;

    const table: any = await findTable({_id: tableId});
    if (!table) {
        return res.sendStatus(404).json({success: false, message: "Table is not found"})
    }

    if(orderId.every(id => Types.ObjectId.isValid(id))){
        await isPrintUpdateOrder(tableId, orderId, status)
        if(table.isSafeSales) {
            let isNoPrintCount = 0;
            table.orders.forEach((order: any) => {
                if(!order.isPrint) isNoPrintCount++;
            })
            if(orderId.length == isNoPrintCount) {
                await closeTable(tableId)
            }
        }
        return res.send("ok")
    }

    return res.sendStatus(400).json({success: false, message: "Table is not found"})
}

// @desc    apply discount
// @route   POST v1/pos/order/move/:Tableıd/:MtableId
// @access  Private
export async function moveProducts(req: Request, res: Response) {
    const tableId = get(req.params, "tableId");
    const transferredTableId = get(req.params, "MtableId");
    const body: any = req.body;
    let table: any = await findTable({_id: tableId});
    const transferredTable: any = await findTable({_id: transferredTableId});
    if (!table || !transferredTableId) {
        return res.sendStatus(400).json({success: false, message: "Table or OrderId is not found"})
    }
    const Promises = body.orderIds.map(async (Id: any) => {
        let order: any[] = await table.orders.filter((e: any) => e._id == Id);
        if (order.length) {
            await updateAddOrder(order[0], transferredTableId, transferredTable.busy);
            await deleteOrder(tableId, order[0]._id)
        }
    })
    Promise.all(Promises).then(async () => {
        var table: any = await findTable({_id: tableId});
        if (table.orders.findMulti("isDeleted", false).length == 0){
            if(table.discount?.length > 0) {
                table.discount.forEach(async (discount: any) => {
                    await applyTableDiscount(discount, transferredTableId);
                });
            }

            if(table.cover?.length > 0) {
                table.cover.forEach(async (cover: any) => {
                    await applyTableCover(cover, transferredTableId);
                });
            }

            if(table.payments?.length > 0) {
                table.payments.forEach(async (payment: any) => {
                    await applyTablePayments(payment, transferredTableId);
                });
            }
            
            await closeTable(tableId)
        }
    })
    res.send({
        message: "ok"
    });
}

// @desc    apply discount
// @route   PUT /order_status/:tableId/:order_status
// @access  Private
export async function updateStatus(req: Request, res: Response) {
    const tableId = get(req.params, "tableId")
    await findAndUpdate({_id: tableId}, {
        "$set": {
            order_status: get(req.params, "order_status")
        }
    })
    res.send("ok")
}

// @desc    UpdateConfirmation
// @route   PUT v1/pos/order_confirmation_status/:tableId/:order_confirmation_status
// @access  Private
export async function updateConfirmation(req: Request, res: Response) {
    const tableId = get(req.params, "tableId");
    await updateOne({_id: tableId}, {
        "$set": {
            order_confirmation_status: get(req.params, "order_confirmation_status")
        }
    })
    res.send("ok")
}

// @desc    UpdateConfirmation
// @route   PUT v1/pos/homedelivery/courier/courierId
// @access  Private
export async function courierUpdate(req: Request, res: Response) {
    const tableId = get(req.params, "tableId");
    await updateOne({_id: tableId}, {
        "$set": {
            order_confirmation_status: get(req.params, "order_confirmation_status")
        }
    })
    res.send("ok")
}