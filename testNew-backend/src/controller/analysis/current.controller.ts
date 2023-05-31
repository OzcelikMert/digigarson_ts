import { get, omit } from "lodash";
import { Request, Response } from "express";
import { findOneBranch } from "../../service/branch.service";
import log from "../../logger";
import { countCurrent, createCurrent, deleteCurrent, findAndUpdate, findCurrent, findCurrents } from "../../service/current.service";



// @desc    Create a new Current
// @route   GET /v1/accounting/currents
// @access  Private
//manager olarak görev yapan branch in içerisine yeni cari oluşturur.
export async function createCurrentHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const userId = get(req, "user._id");
    try {
        let current: any = await createCurrent({ ...req.body, branch: branchId, user: userId })
        return res.send({ ...current._doc, id: current._id })
    } catch (e: any) {
        log.error(e)
        res.status(409).send(e.message)
    }
}

// @desc    get Currents
// @route   GET /v1/accounting/currents
// @access  Public
//manager olarak görev yapan branch e  oluşturduğumuz carilerin  listesini gönderir.
export async function getCurrentHandler(req: Request, res: Response) {


    const branchId = get(req, "user.branchId");
    const range = req.query
    let _mongoQuery = JSON.parse(get(req, "params._mongoQuery"))
    let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"))

    let currents = await findCurrents({ ..._mongoQuery, branch: branchId }, {}, _mongoOptions)
    const count = await countCurrent({ ..._mongoQuery, branch: branchId })

    res.setHeader("Content-Range", `currents ${range._start}-${range._end}/${count}`);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
    res.setHeader('X-Total-Count', count)
    res.send(currents.map(item => (omit(Object.assign(item, { id: item._id }), "_id"))))
}


// @desc    get Current By Id
// @route   GET /v1/accounting/current/:currentId
// @access  Public
// manager olarak görev yapan branch e cari Idlerini bulup listeler.
export async function getCurrentByIdHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const currentId = get(req.params, "currentId");
    let current: any = await findCurrent({ branch: branchId, _id: currentId })
    return res.send(Object.assign(current, { id: current._id }))
}
// @desc    put Current by Id
// @route   PUT /v1/accounting/currents/:currentId
// @access  Private
//manager olarak görev yapan branch içerisindeki carileri değiştirir.
export async function updateCurrentHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const branch: any = await findOneBranch({ _id: branchId })
    const currentId = get(req.params, "currentId");

    let current: any = await findCurrent({ _id: currentId })
    if (!current) {
        return res.sendStatus(404);
    }

    if (String(current.branch) != String(branchId)) {
        return res.sendStatus(403);
    }
    current = await findAndUpdate({ _id: currentId }, req.body)
    res.send(current)

}


// @desc    Delete Current by Id
// @route   DEL /v1/accounting/currents/:currentId
// @access  Private
//manager olarak görev yapan branch içerisindeki carileri siler.
export async function deleteCurrentHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const branch: any = await findOneBranch({ _id: branchId })
    const currentId = get(req.params, "currentId");

    let current : any = await findCurrent({ _id: currentId })

    if (!current) {
        return res.sendStatus(404);
    }

    if (String(current.branch) != String(branchId)) {
        return res.sendStatus(403);
    }

    await deleteCurrent({ _id: currentId })
    res.sendStatus(200)

}