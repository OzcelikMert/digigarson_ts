import { get, omit } from "lodash";
import { Request, Response } from "express";
import { findOneBranch } from "../../service/branch.service";
import log from "../../logger";
import { countInvoice, createInvoice, deleteInvoice, findAndUpdate, findInvoice, findInvoices } from "../../service/invoice.service";




// @desc    Create a new Invoice
// @route   GET /v1/accounting/invoice
// @access  Private
//manager olarak görev yapan branch in içerisine yeni faturalar oluşturur.
export async function createInvoiceHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const userId = get(req, "user._id");
    try {
        let invoice: any = await createInvoice({ ...req.body, branch: branchId, user: userId })
        return res.send({ ...invoice._doc, id: invoice._id })
    } catch (e: any) {
        log.error(e)
        res.status(409).send(e.message)
    }
}


// @desc    get Invoices
// @route   GET /v1/accounting/invoice
// @access  Public
//manager olarak görev yapan branch e  oluşturduğumuz faturaların  listesini gönderir.
export async function getInvoiceHandler(req: Request, res: Response) {


    const branchId = get(req, "user.branchId");
    const range = req.query
    let _mongoQuery = JSON.parse(get(req, "params._mongoQuery"))
    let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"))

    let invoices = await findInvoices({ ..._mongoQuery, branch: branchId }, {}, _mongoOptions)
    const count = await countInvoice({ ..._mongoQuery, branch: branchId })

    res.setHeader("Content-Range", `invoices ${range._start}-${range._end}/${count}`);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
    res.setHeader('X-Total-Count', count)
    res.send(invoices.map(item => (omit(Object.assign(item, { id: item._id }), "_id"))))
}


// @desc    get Invoice By Id
// @route   GET /v1/accounting/invoice/:invoiceId
// @access  Public
// manager olarak görev yapan branch e fatura Idlerini bulup listeler.
export async function getInvoiceByIdHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const invoiceId = get(req.params, "invoiceId");
    let invoice: any = await findInvoice({ branch: branchId, _id: invoiceId })
    return res.send(Object.assign(invoice, { id: invoice._id }))
}
// @desc    put Invoice by Id
// @route   PUT /v1/accounting/invoices/:invoiceId
// @access  Private
//manager olarak görev yapan branch içerisindeki faturaları değiştirir.
export async function updateInvoiceHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const branch: any = await findOneBranch({ _id: branchId })
    const invoiceId = get(req.params, "invoiceId");

    let invoice: any = await findInvoice({ _id: invoiceId })
    if (!invoice) {
        return res.sendStatus(404);
    }

    if (String(invoice.branch) != String(branchId)) {
        return res.sendStatus(403);
    }
    invoice = await findAndUpdate({ _id: invoiceId }, req.body)
    res.send(invoice)

}


// @desc    Delete Invoice by Id
// @route   DEL /v1/accounting/invoices/:invoiceId
// @access  Private
//manager olarak görev yapan branch içerisindeki faturaları siler.
export async function deleteInvoiceHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const branch: any = await findOneBranch({ _id: branchId })
    const invoiceId = get(req.params, "invoiceId");

    let invoice : any = await findInvoice({ _id: invoiceId })

    if (!invoice) {
        return res.sendStatus(404);
    }

    if (String(invoice.branch) != String(branchId)) {
        return res.sendStatus(403);
    }

    await deleteInvoice({ _id: invoiceId })
    res.sendStatus(200)

}