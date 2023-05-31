import { get } from "lodash";
import { Request, Response } from "express";
import { findTable } from "../../service/table.service";


// @desc    get Table by Id
// @route   GET /v1/tables/:tableId
// @access  Private
//waiter olarak görev yapan kullanıcı tableIdlerin listesini gönderir.
export async function getTablesByIdHandler(req: Request, res: Response) {

    const tableId = get(req.params, "tableId");
    let table = await findTable({ _id: tableId })
    res.send(table)
}
