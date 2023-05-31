import { get, omit } from "lodash";
import { Request, Response } from "express";
import { findOneBranch } from "../../service/branch.service";
import log from "../../logger";
import { countAnalysisCustomer, createAnalysisCustomer, deleteAnalysisCustomer, findAnalysisCustomer, findAnalysisCustomers, findAndUpdate } from "../../service/analysis.customer.service";





// @desc    Create a new AnalysisCustomer
// @route   GET /v1/accounting/analysiscustomer
// @access  Private
//manager olarak görev yapan branch in içerisine yeni analizdeki müşterileri oluşturur.
export async function createAnalysisCustomerHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const userId = get(req, "user._id");
    try {
        let analysiscustomer: any = await createAnalysisCustomer({ ...req.body, branch: branchId, user: userId })
        return res.send({ ...analysiscustomer._doc, id: analysiscustomer._id })
    } catch (e: any) {
        log.error(e)
        res.status(409).send(e.message)
    }
}


// @desc    get AnalysisCustomers
// @route   GET /v1/accounting/analysiscustomer
// @access  Public
//manager olarak görev yapan branch e  oluşturduğumuz analizdeki müşterilerin  listesini gönderir.
export async function getAnalysisCustomerHandler(req: Request, res: Response) {


    const branchId = get(req, "user.branchId");
    const range = req.query
    let _mongoQuery = JSON.parse(get(req, "params._mongoQuery"))
    let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"))

    let analysiscustomers = await findAnalysisCustomers({ ..._mongoQuery, branch: branchId }, {}, _mongoOptions)
    const count = await countAnalysisCustomer({ ..._mongoQuery, branch: branchId })

    res.setHeader("Content-Range", `analysiscustomers ${range._start}-${range._end}/${count}`);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
    res.setHeader('X-Total-Count', count)
    res.send(analysiscustomers.map(item => (omit(Object.assign(item, { id: item._id }), "_id"))))
}


// @desc    get AnalysisCustomer By Id
// @route   GET /v1/accounting/analysiscustomer/:analysiscustomerId
// @access  Public
// manager olarak görev yapan branch e analizdeki müşterileri Idlerini bulup listeler.
export async function getAnalysisCustomerByIdHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const analysiscustomerId = get(req.params, "analysiscustomerId");
    let analysiscustomer: any = await findAnalysisCustomer({ branch: branchId, _id: analysiscustomerId })
    return res.send(Object.assign(analysiscustomer, { id: analysiscustomer._id }))
}
// @desc    put AnalysisCustomer by Id
// @route   PUT /v1/accounting/analysiscustomers/:analysiscustomerId
// @access  Private
//manager olarak görev yapan branch içerisindeki analizdeki müşterileri değiştirir.
export async function updateAnalysisCustomerHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const branch: any = await findOneBranch({ _id: branchId })
    const analysiscustomerId = get(req.params, "analysiscustomerId");

    let analysiscustomer: any = await findAnalysisCustomer({ _id: analysiscustomerId })
    if (!analysiscustomer) {
        return res.sendStatus(404);
    }

    if (String(analysiscustomer.branch) != String(branchId)) {
        return res.sendStatus(403);
    }
    analysiscustomer = await findAndUpdate({ _id: analysiscustomerId }, req.body)
    res.send(analysiscustomer)

}


// @desc    Delete AnalysisCustomer by Id
// @route   DEL /v1/accounting/analysiscustomers/:analysiscustomerId
// @access  Private
//manager olarak görev yapan branch içerisindeki analizdeki müşterileri siler.
export async function deleteAnalysisCustomerHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const branch: any = await findOneBranch({ _id: branchId })
    const analysiscustomerId = get(req.params, "analysiscustomerId");

    let analysiscustomer : any = await findAnalysisCustomer({ _id: analysiscustomerId })

    if (!analysiscustomer) {
        return res.sendStatus(404);
    }

    if (String(analysiscustomer.branch) != String(branchId)) {
        return res.sendStatus(403);
    }

    await deleteAnalysisCustomer({ _id: analysiscustomerId })
    res.sendStatus(200)

}