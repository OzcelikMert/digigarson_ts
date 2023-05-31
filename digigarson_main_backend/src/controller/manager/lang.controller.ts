import { get, omit } from "lodash";
import { Request, Response } from "express";
import log from "../../logger";
import { createLang, findLang, findOneInLang, addToLang, deleteById, updateLang } from "../../service/lang.service";
import { ObjectId } from "mongoose";

export async function CreateLangHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const lang: any = await findLang({ branchId: branchId })
    if (!lang) {
        try {
            let lang: any = await createLang({
                branch: branchId,
            })
            return res.send(lang)
        } catch (e: any) {
            log.error(e)
            res.status(409).send(e.message)
        }
    }else {
        res.status(409).send("Lang with given branchId already exists!")
    }
};

export async function getLangHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    try {
        let lang = await findLang({ branch: branchId })
        return res.send(lang)
    } catch (e: any) {
        log.error(e)
        res.status(409).send(e.message)
    }
};

export async function deleteLangHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId")
    await deleteById({ branchId: branchId })
    res.send("ok");
};





