import { get } from "lodash";
import { Request, Response } from "express";
import log from "../../logger";
import { findLang} from "../../service/lang.service";

export async function getLangHandler(req: Request, res: Response) {
    const branchId = get(req.params, "branchId");
    try {
        let lang = await findLang({ branch: branchId })
        return res.send(lang)
    } catch (e: any) {
        log.error(e)
        res.status(409).send(e.message)
    }

};