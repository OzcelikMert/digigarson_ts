import { get, omit } from "lodash";
import { Request, Response } from "express";
import {createTick, findOneTick, findTicks, ticksPay,setIsActive} from "../../service/branchticks.sevice";
import { findCheck } from "../../service/check.service";
const BranchTicks = {
    get: async function (req: Request, res:Response){
        const branchId = get(req, "user.branchId");
        const Ticks = await findTicks({branch: branchId})
        res.send(Ticks);
    },
    getOne: async function getOneTick(req: Request, res:Response){
        const tickId = get(req.params, "tickId")
        const branchId = get(req, "user.branchId");
        const Ticks: any = await findOneTick({branch: branchId, _id: tickId});
        var mongoose = require('mongoose');
    
        if(!Ticks){
            res.status(505).send("Tick'nt found")
        }
        else{
            let newTick: any = [];
                for(let tick of Ticks.ticks){
                  newTick.push(  await findCheck({'products._id': mongoose.Types.ObjectId(tick.orderId)},{})) 
            }
        res.send(newTick)
    }
    },
    create: async function (req:Request, res:Response){
        const branchId = get(req, "user.branchId");
        let newTicks = await createTick({ branch: branchId, ...req.body });
        res.send(newTicks);
    },
    PayHandler: async function (req: Request, res: Response){
        const branchId = get(req, "user.branchId");
        const branchTickId = get(req.params, "branchTickId");
        const tickId = get(req.body, "tickId");
        const payment: Number = get(req.body, "payment");
        try{
            const Ticks:any = await findOneTick({branch: branchId, _id: branchTickId});
            let findTick:any = await Ticks.ticks.find((tick: any) => tick._id == tickId);
            const tick = await ticksPay(branchId, branchTickId, tickId, payment);
            if(payment == findTick.debt){
               await setIsActive(branchId, branchTickId, tickId, false)
            }
            res.send([findTick, Ticks])
        }catch(e:any){
            res.status(406).send(e)
        }
    }
}

export default BranchTicks;