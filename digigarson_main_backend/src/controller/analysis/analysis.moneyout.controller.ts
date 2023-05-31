import { Request, Response } from "express";
import { get } from "lodash";
import { createAnalysisMoneyOut, findAnalysisMoneyOuts } from "../../service/analysis.moneyout.service";
import { findOneBranch } from "../../service/branch.service";


// @desc    get My AnalysisMoneyOut
// @route   GET /v1/analysismoneyouts
// @access  Private
//analiz olarak görev yaptığı branch e para çıkışı getirir.
export async function getAnalysisMoneyOutHandler(req: Request, res: Response) {
    const userId = get(req, "user._id");
    let _analysismoneyout = await findAnalysisMoneyOuts({ user: userId})
    return res.send(_analysismoneyout)
}

// @desc    Create a new Analysis Money Out
// @route   POST /v1/analysismoneyouts
// @access  Private
//yeni para çıkışı oluşturur.
export async function createAnalysisMoneyOutHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const userId = get(req, "user._id");
    let newAnalysisMoneyOut = await createAnalysisMoneyOut({ ...req.body, branch: branchId, user: userId})
    return res.send(newAnalysisMoneyOut)
}