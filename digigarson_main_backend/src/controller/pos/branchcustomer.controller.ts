import { get, omit } from "lodash";
import { Request, Response } from "express";
import { findOneBranch } from "../../service/branch.service";
import log from "../../logger";
import { countBranchCustomer, createBranchCustomer, deleteBranchCustomer, findAndUpdate, findBranchCustomer, findBranchCustomers } from "../../service/branchcustomer.service";


// @desc    get Customers
// @route   GET /v1/pos/customer
// @access  Public
//pos olarak görev yaptığı branch e müşterilerin listesini gösterir.
export async function getBranchCustomerHandler(req: Request, res: Response) {

    const branchId = get(req, "user.branchId");
    const branch: any = await findOneBranch({ _id: branchId })
    const range = req.query
    let customers = await findBranchCustomers({ branch: branchId }, {})

    res.setHeader("Content-Range", `customers ${range._start}-${range._end}/${customers.length}`);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
    res.setHeader('X-Total-Count', customers.length)

    res.send(customers.map(item => (omit(Object.assign(item, { id: item._id }), "_id"))))
}


// @desc    post Customers
// @route   POST /v1/pos/customer
// @access  Public
//pos olarak görev yaptığı branch e müşteriler ekler.
export async function createBranchCustomerHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const userId = get(req, "user._id");
    const branch: any = await findOneBranch({ _id: branchId })
    try {
        let customer: any = await createBranchCustomer({ ...req.body, branch: branchId, branchName: branch.title })
        return res.send({ ...customer._doc, id: customer._id })
    } catch (e: any) {
        log.error(e)
        res.status(409).send(e.message)
    }
}

// @desc    post Customers
// @route   POST /v1/pos/customer
// @access  Public
//pos olarak görev yaptığı branch e müşteriler ekler.
export async function updateBranchCustomerHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const userId = get(req, "user._id");
    const customerId = get(req.params, "customerId")
    const branch: any = await findOneBranch({ _id: branchId })
    console.log(customerId)
    try {
        let customer: any = await findAndUpdate({_id: customerId},req.body)
        return res.send(customer)
    } catch (e: any) {
        log.error(e)
        res.status(409).send(e.message)
    }
}