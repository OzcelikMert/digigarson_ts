import { get } from "lodash";
import { Request, Response } from "express";
import { findOneBranch } from "../../service/branch.service";
import { findTable, findTables,setTableAllData,tableInsertLog,closeTable,tableIsPrint } from "../../service/table.service";
import { logdb } from "../../logger";


// @desc    get Table by Id
// @route   GET /v1/tables/:tableId
// @access  Private
//pos olarak görev yaptığı branch de masaların kontrolünü yapar.
export async function getTablesByIdHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const branch: any = await findOneBranch({ _id:branchId })
    const tableId = get(req.params, "tableId");
    let table = await findTable({ _id: tableId })

    res.send(table)
}


// @desc    get all Tables
// @route   GET /v1/tables/:tableId
// @access  Private
export async function getBranchTablesHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const branch: any = await findOneBranch({ _id: branchId })
    const range = req.query
    const headerName = "X-Total-Count";
    let tables = await findTables({ branch: branchId })
    const header = `tables ${range._start}-${range._end}/${tables.length}`;
    res.setHeader(headerName, header);
    res.send(tables.map(item => Object.assign(item, { id: item._id })))
}


// @desc    Masa yazdırma durumunu güncelleme
// @route   PUT /v1/tables/:tableId
// @access  Private
export async function updateTableIsPrint(req: Request, res: Response){
    const tableId = get(req.params, "tableId");
    let status: boolean = true;
    let print: boolean = false;
    await tableIsPrint(tableId, status, print)
    res.send("ok");
}
