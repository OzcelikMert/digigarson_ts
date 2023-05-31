import { get } from "lodash";
import { Request, Response } from "express";
import { findOneBranch } from "../../service/branch.service";
import { findTable, findTables,setTableAllData,tableInsertLog,closeTable,tableIsPrint } from "../../service/table.service";

const Table = {
        // @desc    get all Tables
        // @route   GET /v1/tables/:tableId
        // @access  Private
    get: async function (req: Request, res: Response) {
        const branchId = get(req, "user.branchId");
        const branch: any = await findOneBranch({ _id: branchId })
        const range = req.query
        const headerName = "X-Total-Count";
        let tables = await findTables({ branch: branchId })
        const header = `tables ${range._start}-${range._end}/${tables.length}`;
        res.setHeader(headerName, header);
        res.send(tables.map(item => Object.assign(item, { id: item._id })))
    },
        // @desc    get Table by Id
        // @route   GET /v1/tables/:tableId
        // @access  Private
        //pos olarak görev yaptığı branch de masaların kontrolünü yapar.
    getOne: async function (req: Request, res: Response) {
        const tableId = get(req.params, "tableId");
        let table = await findTable({ _id: tableId})
        res.send(table)
    },
    Update: {
        // @desc    Masa yazdırma durumunu güncelleme
        // @route   PUT /v1/tables/:tableId
        // @access  Private
        IsPrint: async function (req: Request, res: Response){
            const tableId = get(req.params, "tableId");
            let status: boolean = true;
            let print: boolean = false;
            await tableIsPrint(tableId, status, print)
            res.send("ok");
        }
    }
}
export default  Table;








