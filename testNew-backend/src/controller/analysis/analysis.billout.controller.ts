import { Request, Response } from "express";
import { get } from "lodash";
import { createAnalysisBillOut, findAnalysisBillOuts } from "../../service/analysis.billout.service";
import { findOneBranch } from "../../service/branch.service";


// @desc    get My AnalysisBillOut
// @route   GET /v1/analysisbillouts
// @access  Private
//analiz olarak görev yaptığı branch e senet çıkışı getirir.
export async function getAnalysisBillOutHandler(req: Request, res: Response) {
    const userId = get(req, "user._id");
    let _analysisbillout = await findAnalysisBillOuts({ user: userId})
    return res.send(_analysisbillout)
}

// @desc    Create a new Analysis Bill Out
// @route   POST /v1/analysisbillouts
// @access  Private
//yeni senet çıkışı oluşturur.
export async function createAnalysisBillOutHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const userId = get(req, "user._id");
    let newAnalysisBillOut = await createAnalysisBillOut({ ...req.body, branch: branchId, user: userId})
    return res.send(newAnalysisBillOut)
}