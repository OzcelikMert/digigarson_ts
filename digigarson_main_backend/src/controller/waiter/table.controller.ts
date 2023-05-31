import { get, omit } from "lodash";
import { Request, Response } from "express";
import { findOneBranch } from "../../service/branch.service";
import { findTables, findTable, setTableAllData, tableInsertLog, closeTable, tableIsPrint } from "../../service/table.service";
import { logdb } from "../../logger";

// @desc    get Table by Id
// @route   GET /v1/tables/:tableId
// @access  Private
//waiter olarak görev yapan kullanıcı tableIdlerin listesini gönderir.
export async function getTablesByIdHandler(req: Request, res: Response) {

    const tableId = get(req.params, "tableId");
    let table = await findTable({ _id: tableId })
    res.send(table)
}

// @desc    transfer Table
// @route   POST /v1/pos/tables/transfer
// @access  Private
export async function transferTableHandler(req: Request, res: Response) {
    
    const branchId = get(req, "user.branchId");
    const { from, target } = req.body
    await tableInsertLog(from, [logdb(`w:${req.baseUrl.split('/')[2]}${get(req, "user._id")};f:${from};t:${target};h:tableTransferRequest`)])
    const fromTable: any = await findTable({ _id: from, branch: branchId }, {})
    if (!fromTable || fromTable.busy == false) {
        return res.sendStatus(400)
    }
    const targetTable: any = await findTable({ _id: target, branch: branchId }, {})
    if (!targetTable || targetTable.busy == true) {
        return res.sendStatus(400)
    }
    await setTableAllData(target, fromTable)
    await tableInsertLog(target, [logdb(`w:${req.baseUrl.split('/')[2]}${get(req, "user._id")};f:${from};t:${target};h:tableTransfer`)])
    await closeTable(from)
    return res.sendStatus(200)
}

export async function updateTableIsPrint(req: Request, res: Response){
    const tableId = get(req.params, "tableId");
    let table:any = await findTable({ _id: tableId })
    let status: boolean = (table?.isPrint?.status == false)? true : true;
    let print: boolean = true;
    await tableIsPrint(tableId, status, print)
    res.send("ok");
}