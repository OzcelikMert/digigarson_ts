import { get, omit } from "lodash";
import { Request, Response } from "express";
import {findservices, updateServiceConfrim } from "../../service/services.services";

export async function findAllservices(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const service: any = await findservices(branchId);
    res.send(service);
}

export async function updateService(req: Request, res: Response) {
    const ServiceId = get(req.params, "serviceId");
    const user = get(req, "user._id");
    await updateServiceConfrim(ServiceId, user);
    return res.send("ok") 
}