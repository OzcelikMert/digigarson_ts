import { Request, Response } from "express";
import { get } from "lodash";
import { createAnalysisCheckInflow, findAnalysisCheckInflows } from "../../service/analysis.checkinflow.service";
import { findOneBranch } from "../../service/branch.service";


// @desc    get My AnalysisCheckİnflow
// @route   GET /v1/analysischeckinflows
// @access  Private
//analiz olarak görev yaptığı branch e yeni çek girişi getirir.
export async function getAnalysisCheckInflowHandler(req: Request, res: Response) {
    const userId = get(req, "user._id");
    let _analysischeckinflow = await findAnalysisCheckInflows({ user: userId})
    return res.send(_analysischeckinflow)
}

// @desc    Create a new Analysis Check Inflow
// @route   POST /v1/analysischeckinflows
// @access  Private
//yeni çek girişi oluşturur.
export async function createAnalysisCheckInflowHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const userId = get(req, "user._id");
    let newAnalysisCheckInflow = await createAnalysisCheckInflow({ ...req.body, branch: branchId, user: userId})
    return res.send(newAnalysisCheckInflow)
}


