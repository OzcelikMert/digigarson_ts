import { Request, Response } from "express";
import { get } from "lodash";
import { AnyKeys } from "mongoose";
import { findOneBranch } from "../../service/branch.service";
import { findCase } from "../../service/case.service";
import { countChecks, findChecks } from "../../service/check.service";
import { applyTableCover, applyTableDiscount, createNewHomeDeliveryOrder, findOrder, isPrintUpdate, updateAddOrder, deleteOrder } from "../../service/order.service";
import { closeTable, findTable, findTables, tableInsertLog, updateOne, findAndUpdate } from "../../service/table.service";
import { logdb } from "../../logger";

const Order = {
    // @desc    get Order by Id
    // @route   GET /v1/pos/tables
    // @access  Private
    get: async function (req: Request, res: Response) {
        const branchId = get(req, "user.branchId");
        let tables = await findTables({ branch: branchId }, { orders: 1, title: 1, section: 1 })
        return res.send(tables);
    },
    // @desc    get Order by Id
    // @route   GET /v1/pos/tables/:orderId
    // @access  Private
    //pos olarak görev yaptığı branch e siparişlerin listesini gösterir.
    getOne: async function (req: Request, res: Response) {
        const tableId = get(req.params, "tableId");
        let table: any = await findTable({ _id: tableId })
        let order = await findOrder(table._id)
        return res.send(order);
    },
    Apply: {
        // @desc    apply discount
        // @route   GET /v1/pos/orders/:tableId/discount
        // @access  Private
        Discount: async function (req: Request, res: Response) {

            const tableId = get(req.params, "tableId");
            const table: any = await findTable({ _id: tableId });
            if (!table) {
                return res.sendStatus(400).json({ success: false, message: "Table is not found" })
            }
            let discount = req.body
            await applyTableDiscount(discount, tableId)

            res.send("Ok")
        },
        // @desc    apply cover
        // @route   GET /v1/pos/orders/:tableId/discount
        // @access  Private
        Cover: async function (req: Request, res: Response) {

            const tableId = get(req.params, "tableId");
            const table: any = await findTable({ _id: tableId });
            if (!table) {
                return res.sendStatus(400).json({ success: false, message: "Table is not found" })
            }
            let cover = req.body
            await applyTableCover(cover, tableId)

            res.send("Ok")
        },
    },
    Update: {
        // @desc  update isPrint status
        // @route   PUT /v1/pos/isprint/:tableId
        // @access  Private
        Isprint: async function (req: Request, res: Response) {
            const tableId = get(req.params, "tableId");
            const table: any = await findTable({ _id: tableId });
            if (!table) {
                return res.sendStatus(400).json({ success: false, message: "Table is not found" })
            }
            await  isPrintUpdate(tableId)
            res.send("ok")
        } ,
        // @desc    apply discount
        // @route   POST v1/pos/order/move/:Tableıd/:MtableId
        // @access  Private
        moveProducts: async function (req: Request, res: Response) {
            const tableId = get(req.params, "tableId");
            const transferredTableId = get(req.params, "MtableId");
            const body: any= req.body;
            let table: any = await findTable({ _id: tableId });
            const transferredTable: any = await findTable({ _id: transferredTableId });
            if (!table || !transferredTableId){
                return res.sendStatus(400).json({ success: false, message: "Table or OrderId is not found" })
            }
            const Promises = body.orderIds.map(async (Id: any) => {
                let order: any[] = await table.orders.filter((e: any)=> e._id == Id);
                if(order.length){
                    await updateAddOrder(order[0], transferredTableId, transferredTable.busy);
                    await deleteOrder(tableId, order[0]._id)
                }
            })
            Promise.all(Promises).then(async () => {
                var table: any = await findTable({ _id: tableId });
                if (table.orders.length==0) await closeTable(tableId)
            })
            res.send("ok");
        },
        // @desc    apply discount
        // @route   PUT /order_status/:tableId/:order_status
        // @access  Private
        Status: async function (req: Request, res: Response) {
            const tableId = get(req.params, "tableId")
            await findAndUpdate({_id: tableId},{"$set":{
                    order_status: get(req.params, "order_status")
                }})
            res.send("ok")
        },
        // @desc    UpdateConfirmation
// @route   PUT v1/pos/order_confirmation_status/:tableId/:order_confirmation_status
// @access  Private
        Confirmation: async function (req: Request, res: Response) {
            const tableId = get(req.params, "tableId");
            await updateOne({_id: tableId}, {"$set":{
                    order_confirmation_status: get(req.params, "order_confirmation_status")
                }})
            res.send("ok")
        },
        // @desc    UpdateConfirmation
        // @route   PUT v1/pos/homedelivery/courier/courierId
        // @access  Private
        courier: async function (req: Request, res: Response) {
            const tableId = get(req.params, "tableId");
            await updateOne({_id: tableId}, {"$set":{
                    order_confirmation_status: get(req.params, "order_confirmation_status")
                }})
            res.send("ok")
        }
    },
    HomeDelivery: {
        //Create Home Delivery Order
        create: async function (req: Request, res: Response) {
            const userId = get(req, "user._id")
            let _case: any = await findCase({ user: userId, is_open: true })
            if (!_case) {
                return res.status(404).json({ success: false, message: "Case not found. Please open case." });
            }
            const branchId = get(req, "user.branchId");
            const orders = get(req.body, "products");
            const customer = get(req.body, "customer");
            const courier = get(req.body, "courier");
            let check = await createNewHomeDeliveryOrder(orders, branchId, _case._id, userId, customer, courier)
            return res.send(check);
        },
        //Get Home Delivery Order
        get: async function (req: Request, res: Response) {
            const userId = get(req, "user._id")
            let _case: any = await findCase({ user: userId, is_open: true })
            if (!_case) {
                return res.status(404).json({ success: false, message: "Case not found. Please open case ." });
            }
            const branchId = get(req, "user.branchId");
            const range = req.query;
            let _mongoQuery = JSON.parse(get(req, "params._mongoQuery"))
            let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"))
            if (req.query.is_it_paid) {

                _mongoQuery = Object.assign(_mongoQuery, { is_it_paid: (req.query.is_it_paid == "1") })
            }

            let checks = await findChecks({ ..._mongoQuery, branch: branchId, order_type: 3, caseId: _case._id }, _mongoOptions)
            const count = await countChecks({ ..._mongoQuery, branch: branchId, order_type: 3, caseId: _case._id })
            res.setHeader("Content-Range", `checks ${range._start}-${range._end}/${count}`);
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
            res.setHeader('X-Total-Count', count)
            res.send(checks)
        }
    },
}
export  default Order;