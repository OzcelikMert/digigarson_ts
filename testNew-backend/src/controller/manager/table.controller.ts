import { get, set, omit } from "lodash";
import { Request, Response } from "express";
import { findOneBranch } from "../../service/branch.service";
import log from "../../logger";
import { createTable, createMultiTables, findTables, findTable, findAndUpdate, deleteTable, countTable, setSafeSales } from "../../service/table.service";
import { findSection } from "../../service/section.service";
import { findOneInLang, addToLang, updateLang } from "../../service/lang.service";



// @desc    create a new Table
// @route   POST /v1/manager/table
// @access  Private
//yeni masa oluşturur.
export async function createTableHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const safeSalesStatus = get(req.body, "safeSales");
    try {
        let salesTable: any = await findTables({ branch: branchId, safeSales: true })
        if(safeSalesStatus == true && salesTable.length > 0)return res.status(409).send("bir den fazla masaya bu özellik atanamaz")
        let table: any = await createTable({ ...req.body, branch: branchId })
        return res.send({ ...table._doc, id: table._id })
    } catch (e: any) {
        log.error(e)
        res.status(409).send(e.message)
    }
}
// @desc    get All Table
// @route   GET /v1/manager/table
// @access  Private
//oluşturulan masayı branch e gönderir.
export async function getTableHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");

    const range = req.query;
    let _mongoQuery = JSON.parse(get(req, "params._mongoQuery"))
    let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"))

    let tables = await findTables({ ..._mongoQuery, branch: branchId }, { orders: 0, cancelled_orders: 0, paid_orders: 0, payments: 0, order_type: 0, logs: 0 }, _mongoOptions)
    const count = await countTable({ ..._mongoQuery, branch: branchId })


    res.setHeader("Content-Range", `tables ${range._start}-${range._end}/${count}`);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
    res.setHeader('X-Total-Count', count)

    res.send(tables.map(item => (omit(Object.assign(item, { id: item._id }), "_id"))))
}

// @desc    get Table by Id
// @route   GET /v1/manager/table/:tableId
// @access  Private
//oluşturulan masa Id lerinin listesini gönderir.
export async function getTableByIdHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const tableId = get(req.params, "tableId");
    let table = await findTable({ _id: tableId })

    res.send(table)
}


// @desc    Update Table by Id
// @route   PUT /v1/manager/table/:tableId
// @access  Private
//masa bilgilerini değiştirir.
export async function updateTableHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const tableId = get(req.params, "tableId");

    let table: any = await findTable({ _id: tableId })

    if (!table) {
        return res.sendStatus(404);
    }

    if (String(table.branch) != String(branchId)) {
        return res.sendStatus(403);
    }

    // Check Section
    const sectionId = get(req.body, "section");
    let section: any = await findSection({ _id: sectionId })

    if (!section) {
        return res.sendStatus(404);
    }

    if (String(section.branch) != String(branchId)) {
        return res.sendStatus(403);
    }

    table = await findAndUpdate({ _id: tableId }, req.body)
    res.send(table)
}

// @desc    Delete Table by Id
// @route   DEL /v1/manager/table/:tableId
// @access  Private
//masa bilgilerini siler.
export async function deleteTableHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");

    const tableId = get(req.params, "tableId");

    let table: any = await findTable({ _id: tableId })

    if (!table) {
        return res.sendStatus(404);
    }

    if (String(table.branch) != String(branchId)) {
        return res.sendStatus(403);
    }

    await deleteTable({ _id: tableId })
    res.sendStatus(200)
}

export async function setTableSafeSales(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const tableId = get(req.params, "tableId");
    const safeSalesStatus = get(req.body, "safeSales");

    let table: any = await findTables({ branch: branchId, safeSales: true })
    if(safeSalesStatus == true && table.length > 0)return res.status(409).send("bir den fazla masaya bu özellik atanamaz")
    const editedTable = await setSafeSales({ _id: tableId }, {safeSales: safeSalesStatus});
    res.send(editedTable)
 }

export async function createMultiTable(req: Request, res: Response) {
    let floor: number = get(req.body, "floor")
    let ceiling: number = get(req.body, "ceiling")
    const sectionId = get(req.body, "section")
    const branchId = get(req, "user.branchId")
    let table: any = { title: "", section: "" };

    for (var i = floor; i <= ceiling; i++) {
        try {
            let existsTable = await findTable({section: sectionId, title: i.toString()})
            if(!existsTable)
            {
                await set(table, "title", i)
                await set(table, "section", sectionId)
                await createMultiTables({ ...table, branch: branchId })
            }
        } catch (e: any) {
            log.error(e)
            res.status(409).send(e.message)
        }
    }
    res.send("ok")
}