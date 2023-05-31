import { Request, Response } from "express";
import { get } from "lodash";
import { createAnalysisCheckOut, findAnalysisCheckOuts } from "../../service/analysis.checkout.service";
import { findOneBranch } from "../../service/branch.service";


// @desc    get My AnalysisCheckOut
// @route   GET /v1/analysischeckouts
// @access  Private
//analiz olarak görev yaptığı branch e çek çıkışı getirir.
export async function getAnalysisCheckOutHandler(req: Request, res: Response) {
    const userId = get(req, "user._id");
    let _analysischeckout = await findAnalysisCheckOuts({ user: userId})
    return res.send(_analysischeckout)
}

// @desc    Create a new Analysis Check Out
// @route   POST /v1/analysischeckouts
// @access  Private
//yeni çek çıkışı oluşturur.
export async function createAnalysisCheckOutHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const userId = get(req, "user._id");
    let newAnalysisCheckOut = await createAnalysisCheckOut({ ...req.body, branch: branchId, user: userId})
    return res.send(newAnalysisCheckOut)
}