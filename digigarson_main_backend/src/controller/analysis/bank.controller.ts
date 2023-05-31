import { Request, Response } from "express";
import { get } from "lodash";
import { findOneBranch } from "../../service/branch.service";
import { createBank, findBanks } from "../../service/bank.service";

// @desc    get My Bank
// @route   GET /v1/banks
// @access  Private
//analiz olarak görev yaptığı branch e bankayı getirir.
export async function getBankHandler(req: Request, res: Response) {
    const userId = get(req, "user._id");
    let _bank = await findBanks({ user: userId})
    return res.send(_bank)
}


// @desc    Create a new Bank
// @route   POST /v1/banks
// @access  Private
//yeni banka oluşturur.
export async function createBankHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const userId = get(req, "user._id");
    let newBank = await createBank({ ...req.body, branch: branchId, user: userId})
    return res.send(newBank)
}