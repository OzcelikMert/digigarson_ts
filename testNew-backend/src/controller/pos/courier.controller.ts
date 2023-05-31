import { get} from "lodash";
import { Request, Response } from "express";
import log from "../../logger";
import { createCourier, deleteCourier, findAndUpdate, findCourier, findCouriers } from "../../service/courier.service";
const Courier = {
    // @desc    Create a new Courier
    // @route   GET /v1/pos/courier
    // @access  Private
    //pos olarak görev yapan branch in içerisine yeni kurye oluşturur.
    create: async function (req: Request, res: Response) {
        const branchId = get(req, "user.branchId");
        try {
            let courier: any = await createCourier({ ...req.body, branch: branchId})
            return res.send({ ...courier._doc, id: courier._id })
        } catch (e: any) {
            log.error(e)
            res.status(409).send(e.message)
        }
    },
    // @desc    get Couriers
    // @route   GET /v1/pos/courier
    // @access  Public
    //pos olarak görev yapan branch e  oluşturduğumuz kuryelerin  listesini gönderir.
    get: async function (req: Request, res: Response) {
        const branchId = get(req, "user.branchId");
        const couriers: any = await findCouriers({ branch:branchId })
        res.send(couriers)
    },
    // @desc    get Courier By Id
    // @route   GET /v1/pos/courier/:courierId
    // @access  Public
    // pos olarak görev yapan branch e kurye Idlerini bulup listeler.
    getOne: async function (req: Request, res: Response) {
        const branchId = get(req, "user.branchId");
        const courierId = get(req.params, "courierId");
        let courier: any = await findCourier({ branch: branchId, _id: courierId })
        return res.send(Object.assign(courier, { id: courier._id }))
    },
    // @desc    put Courier by Id
    // @route   PUT /v1/pos/courier/:courierId
    // @access  Private
    //pos olarak görev yapan branch içerisindeki kuryeleri değiştirir.
    update: async function (req: Request, res: Response) {
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

    },
    delete: async function (req: Request, res: Response) {
        const courierId = get(req.params, "courierId")
        try{
            const couriers = await deleteCourier({_id: courierId});
            res.send(couriers)
        }catch(e: any){
            res.status(409).send(e.message)
        }
    }
}
export default Courier;
  