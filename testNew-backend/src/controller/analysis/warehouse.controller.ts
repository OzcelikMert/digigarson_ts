import { get, omit } from "lodash";
import { Request, Response } from "express";
import { findOneBranch } from "../../service/branch.service";
import log from "../../logger";
import { countWarehouse, createWarehouse, deleteWarehouse, findAndUpdate, findWarehouse, findWarehouses } from "../../service/warehouse.service";





// @desc    Create a new Warehouse
// @route   GET /v1/accounting/warehouse
// @access  Private
//manager olarak görev yapan branch in içerisine yeni depoları oluşturur.
export async function createWarehouseHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const userId = get(req, "user._id");
    try {
        let warehouse: any = await createWarehouse({ ...req.body, branch: branchId, user: userId })
        return res.send({ ...warehouse._doc, id: warehouse._id })
    } catch (e: any) {
        log.error(e)
        res.status(409).send(e.message)
    }
}


// @desc    get Warehouses
// @route   GET /v1/accounting/analysiscustomer
// @access  Public
//manager olarak görev yapan branch e  oluşturduğumuz depoların  listesini gönderir.
export async function getWarehouseHandler(req: Request, res: Response) {


    const branchId = get(req, "user.branchId");
    const range = req.query
    let _mongoQuery = JSON.parse(get(req, "params._mongoQuery"))
    let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"))

    let warehouses = await findWarehouses({ ..._mongoQuery, branch: branchId }, {}, _mongoOptions)
    const count = await countWarehouse({ ..._mongoQuery, branch: branchId })

    res.setHeader("Content-Range", `warehouses ${range._start}-${range._end}/${count}`);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
    res.setHeader('X-Total-Count', count)
    res.send(warehouses.map(item => (omit(Object.assign(item, { id: item._id }), "_id"))))
}


// @desc    get Warehouse By Id
// @route   GET /v1/accounting/warehouse/:warehouseId
// @access  Public
// manager olarak görev yapan branch e depoların Idlerini bulup listeler.
export async function getWarehouseByIdHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const warehouseId = get(req.params, "warehouseId");
    let warehouse: any = await findWarehouse({ branch: branchId, _id: warehouseId })
    return res.send(Object.assign(warehouse, { id: warehouse._id }))
}
// @desc    put Warehouse by Id
// @route   PUT /v1/accounting/warehouses/:warehouseId
// @access  Private
//manager olarak görev yapan branch içerisindeki analizdeki müşterileri değiştirir.
export async function updateWarehouseHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const branch: any = await findOneBranch({ _id: branchId })
    const warehouseId = get(req.params, "warehouseId");

    let warehouse: any = await findWarehouse({ _id: warehouseId })
    if (!warehouse) {
        return res.sendStatus(404);
    }

    if (String(warehouse.branch) != String(branchId)) {
        return res.sendStatus(403);
    }
    warehouse = await findAndUpdate({ _id: warehouseId }, req.body)
    res.send(warehouse)

}


// @desc    Delete Warehouse by Id
// @route   DEL /v1/accounting/warehouses/:warehouseId
// @access  Private
//manager olarak görev yapan branch içerisindeki analizdeki müşterileri siler.
export async function deleteWarehouseHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const branch: any = await findOneBranch({ _id: branchId })
    const warehouseId = get(req.params, "warehouseId");

    let warehouse : any = await findWarehouse({ _id: warehouseId })

    if (!warehouse) {
        return res.sendStatus(404);
    }

    if (String(warehouse.branch) != String(branchId)) {
        return res.sendStatus(403);
    }

    await deleteWarehouse({ _id: warehouseId })
    res.sendStatus(200)

}