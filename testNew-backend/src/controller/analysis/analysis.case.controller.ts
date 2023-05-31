import { Request, Response } from "express";
import { get } from "lodash";
import log from "../../logger";
import { findOneBranch } from "../../service/branch.service";
import { createAnalysisCase, deleteAnalysiscase, findAnalysisCase, findAnalysisCases, findAndUpdate } from "../../service/analysis.case.service";

// @desc    get My AnalysisCase
// @route   GET /v1/analysiscases
// @access  Private
//analiz olarak görev yaptığı branch e kasayı getirir.
export async function getAnalysisCaseHandler(req: Request, res: Response) {
    const userId = get(req, "user._id");
    let _analysiscase = await findAnalysisCases({ user: userId})
    return res.send(_analysiscase)
}

// @desc    Create a new Analysis Case
// @route   POST /v1/analysiscases
// @access  Private
//yeni kasa oluşturur.
export async function createAnalysisCaseHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const userId = get(req, "user._id");
    try {
        let analysiscase: any = await createAnalysisCase({ ...req.body, branch: branchId, user: userId })
        return res.send({ ...analysiscase._doc, id: analysiscase._id })
    } catch (e: any) {
        log.error(e)
        res.status(409).send(e.message)
    }
}
// @desc    get AnalysisCase By Id
// @route   GET /v1/accounting/analysiscase/:analysiscaseId
// @access  Public
// manager olarak görev yapan branch e analizdeki müşterileri Idlerini bulup listeler.
export async function getAnalysisCaseByIdHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const analysiscaseId = get(req.params, "analysiscaseId");
    let analysiscase: any = await findAnalysisCase({ branch: branchId, _id: analysiscaseId })
    return res.send(Object.assign(analysiscase, { id: analysiscase._id }))
}

// @desc    put AnalysisCase by Id
// @route   PUT /v1/accounting/analysiscases/:analysiscaseId
// @access  Private
//manager olarak görev yapan branch içerisindeki analizdeki kasanın ismini değiştirir.
export async function updateAnalysisCaseHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const branch: any = await findOneBranch({ _id: branchId })
    const analysiscaseId = get(req.params, "analysiscaseId");

    let analysiscase: any = await findAnalysisCase({ _id: analysiscaseId })
    if (!analysiscase) {
        return res.sendStatus(404);
    }

    if (String(analysiscase.branch) != String(branchId)) {
        return res.sendStatus(403);
    }
    analysiscase = await findAndUpdate({ _id: analysiscaseId },req.body)
    res.send(analysiscase)

}

// // @desc    Delete Analysis by Id
// // @route   DEL /v1/accounting/analysiscases/:analysiscasesId
// // @access  Private
// //manager olarak görev yapan branch içerisindeki analizdeki kasayı siler.
// export async function deleteAnalysisCaseHandler(req: Request, res: Response) {
//     const branchId = get(req, "user.branchId");
//     const branch: any = await findOneBranch({ _id: branchId })
//     const analysiscaseId = get(req.params, "analysiscaseId");

//     let analysiscase : any = await findAnalysisCase({ _id: analysiscaseId })

//     if (!analysiscase) {
//         return res.sendStatus(404);
//     }

//     if (String(analysiscase.branch) != String(branchId)) {
//         return res.sendStatus(403);
//     }

//     await deleteAnalysiscase({ _id: analysiscaseId })
//     res.sendStatus(200)

//}