import { get, omit } from "lodash";
import { Request, Response } from "express";
import log from "../../logger";
import { countBranchCustomer, createBranchCustomer, deleteBranchCustomer, findAndUpdate, findBranchCustomer, findBranchCustomers } from "../../service/branchcustomer.service";



// @desc    Create a new Customer
// @route   GET /v1/manager/customer
// @access  Private
//manager olarak görev yapan branch in içerisine yeni müşteriler oluşturur.
export async function createCustomerHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const userId = get(req, "user._id");
    try {
        let customer: any = await createBranchCustomer({ ...req.body, branch: branchId})
        return res.send({ ...customer._doc, id: customer._id })
    } catch (e: any) {
        log.error(e)
        res.status(409).send(e.message)
    }
}


// @desc    get Customers
// @route   GET /v1/manager/customer
// @access  Public
//manager olarak görev yapan branch e  oluşturduğumuz müşterilerin  listesini gönderir.
export async function getCustomerHandler(req: Request, res: Response) {


    const branchId = get(req, "user.branchId");
    const range = req.query
    let _mongoQuery = JSON.parse(get(req, "params._mongoQuery"))
    let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"))
  

    let customers = await findBranchCustomers({ ..._mongoQuery, branch: branchId }, {}, _mongoOptions)
    const count = await countBranchCustomer({ ..._mongoQuery, branch: branchId })

    res.setHeader("Content-Range", `customers ${range._start}-${range._end}/${count}`);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
    res.setHeader('X-Total-Count', count)
    return res.send(customers.map((item:any) => (omit(Object.assign(item, { id: item._id }), "_id"))))
}


// @desc    get Customer By Id
// @route   GET /v1/manager/customer/:customerId
// @access  Public
// manager olarak görev yapan branch e müşteri Idlerini bulup listeler.
export async function getCustomerByIdHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const customerId = get(req.params, "customerId");
    let customer: any = await findBranchCustomer({ branch: branchId, _id: customerId })
    return res.send(Object.assign(customer, { id: customer._id }))
}
// @desc    put Customer by Id
// @route   PUT /v1/manager/customer/:customerId
// @access  Private
//manager olarak görev yapan branch içerisindeki müşterileri değiştirir.
export async function updateCustomerHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    
    const customerId = get(req.params, "customerId");

    let customer: any = await findBranchCustomer({ _id: customerId })
    if (!customer) {
        return res.sendStatus(404);
    }

    if (String(customer.branch) != String(branchId)) {
        return res.sendStatus(403);
    }
    customer = await findAndUpdate({ _id: customerId }, req.body)
    return res.send(customer)

}

  



// @desc    Delete Customer by Id
// @route   DEL /v1/manager/customer/:customerId
// @access  Private
//manager olarak görev yapan branch içerisindeki müşterileri siler.
export async function deleteCustomerHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    

    const customerId = get(req.params, "customerId");

    let customer: any = await findBranchCustomer({ _id: customerId })

    if (!customer) {
        return res.sendStatus(404);
    }

    if (String(customer.branch) != String(branchId)) {
        return res.sendStatus(403);
    }

    await deleteBranchCustomer({ _id: customerId })
    return res.sendStatus(200)

}