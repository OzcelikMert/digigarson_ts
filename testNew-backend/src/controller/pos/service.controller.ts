import { get, omit } from "lodash";
import { Request, Response } from "express";
import {findservices, updateServiceConfrim } from "../../service/services.services";
const Service = {
     get: async function (req: Request, res: Response) {
        const branchId = get(req, "user.branchId");
        const service: any = await findservices(branchId);
        res.send(service);
    },
    update: async function (req: Request, res: Response) {
        const ServiceId = get(req.params, "serviceId");
        const user = get(req, "user._id");
        await updateServiceConfrim(ServiceId, user);
        return res.send("ok")
    }
}

export  default Service;