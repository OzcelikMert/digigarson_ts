import { Request, Response } from "express";
import { findCase,findCases} from "../../service/case.service";
import { get } from "lodash";
import { findCheck} from "../../service/check.service";


export async function getallCases(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    let _case: any = await findCases({ branch: branchId})
    res.send(_case)
}
export async function findCaseById(req: Request, res: Response){
    const branchId = get(req, "user.branchId");
    const caseId:string = get(req.params, "caseId");
    let _case: any = await findCase({ branch: branchId, _id: caseId})
    res.send(_case)
}

export async function findallCheck(req: Request, res: Response){
    const branchId = get(req, "user.branchId");
    const caseId:string = get(req.params, "caseId");
    let _case: any = await findCase({_id: caseId, branch: branchId})
    const checks: any = [];
    let Promises = _case.checks.map(async (_: any) => {
        checks.push(await findCheck({_id: _}))
    })
    Promise.all(Promises).then(() => {
        return res.send(checks)
    })
}

export async function findCheckById(req: Request, res: Response){
    const branchId = get(req, "user.branchId");
    const checkId = get(req.params, "checkId");
    const check = await findCheck({ _id: checkId, branch: branchId })
    if (!check) return res.status(404).json({ error: false, message: "Check not found." })
    return res.send(check)
}
