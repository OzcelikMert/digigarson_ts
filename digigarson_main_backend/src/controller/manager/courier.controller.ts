import { get, omit } from "lodash";
import { Request, Response } from "express";
import log from "../../logger";
import { countCourier, createCourier, deleteCourier, findAndUpdate, findCourier, findCouriers } from "../../service/courier.service";



// @desc    Create a new Courier
// @route   GET /v1/manager/courier
// @access  Private
//manager olarak görev yapan branch in içerisine yeni kurye oluşturur.
export async function createCourierHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const userId = get(req, "user._id");
    try {
        let courier: any = await createCourier({ ...req.body, branch: branchId})
        return res.send({ ...courier._doc, id: courier._id })
    } catch (e: any) {
        log.error(e)
        res.status(409).send(e.message)
    }
}


// @desc    get Couriers
// @route   GET /v1/manager/courier
// @access  Public
//manager olarak görev yapan branch e  oluşturduğumuz kuryelerin  listesini gönderir.
export async function getCourierHandler(req: Request, res: Response) {


    const branchId = get(req, "user.branchId");
    const range = req.query
    let _mongoQuery = JSON.parse(get(req, "params._mongoQuery"))
    let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"))
  

    let couriers = await findCouriers({ ..._mongoQuery, branch: branchId }, {}, _mongoOptions)
    const count = await countCourier({ ..._mongoQuery, branch: branchId })

    res.setHeader("Content-Range", `couriers ${range._start}-${range._end}/${count}`);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
    res.setHeader('X-Total-Count', count)
    return res.send(couriers.map((item:any) => (omit(Object.assign(item, { id: item._id }), "_id"))))
}


// @desc    get Courier By Id
// @route   GET /v1/manager/courier/:courierId
// @access  Public
// manager olarak görev yapan branch e kurye Idlerini bulup listeler.
export async function getCourierByIdHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const courierId = get(req.params, "courierId");
    let courier: any = await findCourier({ branch: branchId, _id: courierId })
    return res.send(Object.assign(courier, { id: courier._id }))
}
// @desc    put Courier by Id
// @route   PUT /v1/manager/courier/:courierId
// @access  Private
//manager olarak görev yapan branch içerisindeki kuryeleri değiştirir.
export async function updateCourierHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    
    const courierId = get(req.params, "courierId");

    let courier: any = await findCourier({ _id: courierId })
    if (!courier) {
        return res.sendStatus(404);
    }

    if (String(courier.branch) != String(branchId)) {
        return res.sendStatus(403);
    }
    courier = await findAndUpdate({ _id: courierId }, req.body)
    return res.send(courier)

}

  



// @desc    Delete Courier by Id
// @route   DEL /v1/manager/courier/:courierId
// @access  Private
//manager olarak görev yapan branch içerisindeki kuryeleri siler.
export async function deleteCourierHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    

    const courierId = get(req.params, "courierId");

    let courier: any = await findCourier({ _id: courierId })

    if (!courier) {
        return res.sendStatus(404);
    }

    if (String(courier.branch) != String(branchId)) {
        return res.sendStatus(403);
    }

    await deleteCourier({ _id: courierId })
    return res.sendStatus(200)

}