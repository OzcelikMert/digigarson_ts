import { Request, Response } from "express";
import { get } from "lodash";
import { createCaller, deleteCaller, findCaller, findAndUpdate, findOneCaller } from "../../service/callerId.service";

const CallerId = {
    create:async function (req: Request, res: Response) {
        const branchId = get(req, "user.branchId");
        const phone = get(req.body, "phone");
        try{
            const caller = await createCaller({branch: branchId, phone: phone});
            res.send(caller);
        }catch(e: any){
            res.status(409).send(e.message);
        }
    },
    get: async function (req: Request, res: Response) {
        const branch = get(req, "user.branchId");
        try{
            const callers = await findCaller({branch: branch});
            res.send(callers);
        }catch(e: any){
            res.status(409).send(e.message);
        }
    },
    getOne: async function (req: Request, res: Response) {
        const branch = get(req, "user.branchId");
        const callerId = get(req.params, "callerId")
        try{
            const caller = await findOneCaller({branch: branch, _id: callerId});
            res.send(caller);
        }catch(e: any){
            res.status(409).send(e.message);
        }
    },
    update: async function (req: Request, res: Response) {
        const branch = get(req, "user.branchId");
        const callerId = get(req.params, "callerId")
        try{
            const caller = await findAndUpdate({_id: callerId}, req.body);
            res.send(caller);
        }catch(e: any){
            res.status(409).send(e.message);
        }
    },
    delete: async function (req: Request, res: Response) {
        const branch = get(req, "user.branchId");
        const callerId = get(req.params, "callerId")
        try{
            await deleteCaller({branch: branch, _id: callerId});
            res.send("Successfully deleted the record");
        }catch(e: any){
            res.status(409).send(e.message);
        }
    }
}
export default CallerId;