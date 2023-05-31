import { Request, Response } from "express";
import { get } from "lodash";
import { createAnalysisMoneyInflow, findAnalysisMoneyInflow, findAnalysisMoneyInflows } from "../../service/analysis.moneyinflow.service";
import { findOneBranch } from "../../service/branch.service";


// @desc    get My AnalysisMoneyİnflow
// @route   GET /v1/analysismoneyinflows
// @access  Private
//analiz olarak görev yaptığı branch e yeni para girişi getirir.
export async function getAnalysisMoneyInflowHandler(req: Request, res: Response) {
    const userId = get(req, "user._id");
    let _analysismoneyinflow = await findAnalysisMoneyInflows({ user: userId})
    return res.send(_analysismoneyinflow)
}

// @desc    Create a new Analysis Money Inflow
// @route   POST /v1/analysismoneyinflows
// @access  Private
//yeni para girişi oluşturur.
export async function createAnalysisMoneyInflowHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const userId = get(req, "user._id");
    let newAnalysisMoneyInflow = await createAnalysisMoneyInflow({ ...req.body, branch: branchId, user: userId})
    return res.send(newAnalysisMoneyInflow)
}