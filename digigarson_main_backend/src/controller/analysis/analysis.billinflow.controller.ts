import { Request, Response } from "express";
import { get } from "lodash";
import { createAnalysisBillInflow, findAnalysisBillInflows } from "../../service/analysis.billinflow.service";
import { findOneBranch } from "../../service/branch.service";


// @desc    get My AnalysisBillİnflow
// @route   GET /v1/analysisbillinflows
// @access  Private
//analiz olarak görev yaptığı branch e yeni senet girişi getirir.
export async function getAnalysisBillInflowHandler(req: Request, res: Response) {
    const userId = get(req, "user._id");
    let _analysisbillinflow = await findAnalysisBillInflows({ user: userId})
    return res.send(_analysisbillinflow)
}

// @desc    Create a new Analysis Bill Inflow
// @route   POST /v1/analysisbillinflows
// @access  Private
//yeni senet girişi oluşturur.
export async function createAnalysisBillInflowHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const userId = get(req, "user._id");
    let newAnalysisBillInflow = await createAnalysisBillInflow({ ...req.body, branch: branchId, user: userId})
    return res.send(newAnalysisBillInflow)
}



