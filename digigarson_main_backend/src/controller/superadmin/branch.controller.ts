import { get, omit } from "lodash";
import { Request, Response } from "express";
import { updatedFind, addBranchPayment, countBranch, createBranch, createBranchPayment, findAndUpdate, findBranch, findBranchPayment, findOneBranch, createCustomId , addSubBranch} from "../../service/branch.service";
import log from "../../logger";
import fs from 'fs';
import { AnySchema } from "yup";
import { createLang } from "../../service/lang.service";
import config from "config";
import { createFile, createImage } from "../../service/createImage.service";


// @desc    create a new Branch
// @route   POST /v1/superadmin/branch
// @access  Private
// süper admin olarak görev yaptığı branch e yeni branch ekler.
export async function createBranchHandler(req: Request, res: Response) {
    let branch:any = [];
    const new_custom_id = await createCustomId();
    try {
            branch = await createBranch({ ...req.body, custom_id: new_custom_id });

            await createFile(branch._id);
            const image = await createImage(req.body.image, branch._id, "branch", "logo");
           
            branch = await findAndUpdate({ _id: branch._id}, {'$set': {image: image}}, { new: true })
        return res.send(Object.assign(branch))
    } catch (e: any) {
        log.error(e);
        return res.status(409).send(e.message);
    }
}


// @desc delete branch all
// @route   POST /v1/superadmin/deletebranch
// @access  Private
// süper admin olarak görev yaptığı branch tamamen silinir.
export async function deleteBranchHandler(req: Request, res:Response) {

}



// @desc    get Branches
// @route   GET /v1/superadmin/branch
// @access  Private
//süper admin olarak göre yaptığı branch e bütün branchlerin listesini gönderir.
export async function getAllBranchHandler(req: Request, res: Response) {
    const range = req.query
    try {
        let _mongoQuery = JSON.parse(get(req, "params._mongoQuery"))
        let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"))
        const branch = await findBranch(_mongoQuery, { crew: 0, createdAt: 0, updatedAt: 0, __v: 0 }, _mongoOptions);
        const count = await countBranch({});

        res.setHeader("Content-Range", `branch ${range._start}-${range._end}/${count}`);
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
        res.setHeader('X-Total-Count', count)

        res.send(branch.map(item => (omit(Object.assign(item, { id: item._id }), "_id"))))
    } catch (e: any) {
        log.error(e)
        return res.status(404).send(e.message);
    }
}

// @desc    get Branch By Id
// @route   GET /v1/superadmin/branch/:branchId
// @access  Private
//süper admin olarak görev yaptığı branch e parametreden gelen branch Idleri getirir.
export async function getBranchHandler(req: Request, res: Response) {
    try {
        const branchId = get(req, "params.branchId");
        let branch = await findOneBranch({ _id: branchId });
        branch = Object.assign(branch, { id: branchId });
        res.send(branch)
    } catch (e: any) {
        log.error(e);
        return res.status(404).send(e.message);
    }
}


// @desc    update Branch by Id
// @route   PUT /v1/superadmin/branch/:branchId
// @access  Private
//süper admin olarak görev yaptığı branch e parametreden gelen branchlerde değişiklik yapar.
export async function updateBranchHandler(req: Request, res: Response) {
    try {
        let branch = await findOneBranch({ _id: req.params.branchId })
        if (!branch) {
            return res.sendStatus(404);
        }
        branch = await findAndUpdate({ _id: req.params.branchId }, req.body, { new: true })
        return res.send(branch)

    } catch (e: any) {
        return res.status(404).send(e.message);
    }
}

// @desc    Payment Branch
// @route   POST /v1/superadmin/branchpayment
// @access  Private
//süper admin olarak görev yaptığı branch e ödeme branch i ekler.
export async function createBranchPaymentHandler(req: Request, res: Response) {
    try {
        const check = await createBranchPayment(req.body);
        return res.send(check);

    } catch (e: any) {
        return res.status(404).send(e.message)
    }
}


// @desc    get Branch By Id
// @route   GET /v1/superadmin/branch/:branchId
// @access  Private
//süper admin olarak görev yaptığı branch e parametreden gelen branch Idlerin listesini gönderir.
export async function getBranchPaymentHandler(req: Request, res: Response) {
    try {
        const branchId = get(req.params, "branchId");
        let branchPayments = await findBranchPayment({ branch: branchId });
        res.send(branchPayments)
    } catch (e: any) {
        log.error(e);
        return res.status(404).send(e.message);
    }
}



// @desc    add Branch By Id
// @route   PUT /v1/superadmin/branch/:branchId
// @access  Private
//süper admin olarak görev yaptığı branch e parametreden gelen branch Idlere yeni ödeme ekler.
export async function addBranchPaymentHandler(req: Request, res: Response) {
    try {
        const branchId = get(req.params, "branchId");
        let branchPayment: any = await findBranchPayment({ branch: branchId });
        let payment = get(req.body, "payment");
        branchPayment = await addBranchPayment(payment, branchId);
        return res.send(branchPayment);

    } catch (e: any) {
        return res.sendStatus(404);
    }
}

// // @desc    add services
// // @route   PUT /v1/superadmin/branch/subBranch
// // @access  Private
//Şubeye, Alt Şube Eklenir
export async function updateSubBranch(req: Request, res: Response) {
    const {Id, subId} = req.body;
    let branch: any = await findOneBranch({ _id: Id });
    let subBranch: any = await findOneBranch({ _id: subId });
    try {
    const branch: any = await addSubBranch(Id, subId)
    return res.send({ ...branch._doc, id: branch._id })
    } catch (e: any) {
        return res.sendStatus(404);
    }
}

export async function updateManagebranch(req: Request, res: Response) {
    const branchId: any = get(req.params, "branchId");
    try {
        await updatedFind(branchId, { ...req.body })
        res.send("ok")
    } catch (e: any) {
        return res.sendStatus(404);
    }
}