import { Request, Response } from "express";
import { findCase, createCase, closeCase } from "../../service/case.service";
import { get } from "lodash";
import {findOneBranchCrewUser} from "../../service/user.service";
import { findOneBranch } from "../../service/branch.service";
import {findChecks} from "../../service/check.service";

const Case = {
// @desc    get My Case
// @route   GET /v1/cases
// @access  Private
//pos olarak görev yaptığı branch e kasayı getirir.
get: async function getCaseHandler(req: Request, res: Response) {
    const userId = get(req, "user._id");
    let _case: any= await findCase({ user: userId, is_open: true })
    if (!_case) return res.status(404).json({ success: false, message: "Case not found, please open new case." });
    let checks: any[] = await findChecks({ _id: { '$in': _case.checks } })
    let newChecks: any = Array();
    const Promises = checks.map(async (_) => {
    const userName: any = await findOneBranchCrewUser({ _id: _.user })
    Promise.resolve(userName).then(() => {
        newChecks.push({
            "id": _._id,
            "createdAt": _.createdAt,
            "user": `${userName.name} `+`${userName.lastname}`,
            "table": _.table
           });
         })
     });
    Promise.all(Promises).then(()=> {
    return res.send([{
            "_id": _case._id,
            "start_balance": _case.start_balance,
            "balance": _case.balance,
            "checks":  newChecks,
            "expenses": [],
            "is_open": true,
            "branch": _case.branch,
            "createdAt": _case.createdAt
        }])
    })
},
// @desc    Create a new Case
// @route   POST /v1/cases
// @access  Private
//yeni kasa oluşturur.
create: async function createCaseHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const userId = get(req, "user._id");
    let _case = await findCase({ user: userId, is_open: true })
    if (_case) return res.status(409).json({ success: false, message: "The case is already open. Unable to create new case." })
    const start_balance = get(req.body, "start_balance");
    let newCase = await createCase({ user: userId, branch: branchId, start_balance, balance: [], expenses: [], is_open: true, checks: [] })
    return res.send(newCase)
},
// @desc    Close case
// @route   POST /v1/cases/close
// @access  Private
//yeni kasa oluşturur.
close: async function (req: Request, res: Response) {
    const userId = get(req, "user._id");
    let _case: any = await findCase({ user: userId, is_open: true })
    if (!_case) return res.status(404).json({ success: false, message: "Case not found, please open new case." });

    await closeCase({ _id: _case._id })
    return res.status(200).json({ success: true, message: "", caseId: _case._id });
}
}
export default Case;