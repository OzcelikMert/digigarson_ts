import { get, omit } from "lodash";
import { Request, Response } from "express";
import {createservice} from "../../service/services.services";

export async function createNewServices(req: Request, res: Response) {
    const branchId: any = get(req.params, "branchId");
    const body = req.body;
    await createservice(body);
    res.send("ok");
}