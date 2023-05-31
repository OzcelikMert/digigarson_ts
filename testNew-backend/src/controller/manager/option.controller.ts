import { get, omit } from "lodash";
import { Request, Response } from "express";
import log from "../../logger";
import * as services from "../../service/option.service";




// @desc    create a new Option
// @route   POST /v1/manager/options
// @access  Private
//yeni opsiyon ekler.
export async function createOptionHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    try {
        let option: any = await services.createOption({ ...req.body, branch: branchId })
        return res.send({ ...option._doc, id: option._id })
    } catch (e: any) {
        log.error(e)
        return res.status(409).send(e.message)
    }
}

// @desc    get All Option
// @route   GET /v1/manager/options
// @access  Private
//opsiyonların listesini gönderir.
export async function getOptionHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const range = req.query;
    let _mongoQuery = JSON.parse(get(req, "params._mongoQuery"))
    let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"))

    let options = await services.findOptions({ ..._mongoQuery, branch: branchId }, {}, _mongoOptions)
    const count = await services.countOptions({ ..._mongoQuery, branch: branchId })


    res.setHeader("Content-Range", `options ${range._start}-${range._end}/${count}`);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
    res.setHeader('X-Total-Count', count)

    res.send(options.map(item => (omit(Object.assign(item, { id: item._id }), "_id"))))
}

// @desc    get Option by Id
// @route   GET /v1/manager/options/:optionId
// @access  Private
//parametreden gelen orderId leri listeler.
export async function getOptionByIdHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const optionId = get(req.params, "optionId");

    let option: any = await services.findOption({ _id: optionId })
    if (!option)
        return res.sendStatus(404)

    res.send(Object.assign(option, { id: option._id }))
}


// @desc    Update Option by Id
// @route   PUT /v1/manager/options/:optionId
// @access  Private
//listelenen opsiyonları değiştirir.
export async function updateOptionHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const optionId = get(req.params, "optionId");

    let option: any = await services.findOption({ _id: optionId })

    if (!option) {
        return res.sendStatus(404);
    }

    if (String(option.branch) != String(branchId)) {
        return res.sendStatus(403);
    }
    option = await services.findAndUpdate({ _id: optionId }, req.body)
    res.send(option)
}

// @desc    Delete Option by Id
// @route   DEL /v1/manager/options/:optionId
// @access  Private
//listelenen opsiyonları siler.
export async function deleteOptionHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const optionId = get(req.params, "optionId");

    let option: any = await services.findOption({ _id: optionId })

    if (!option) {
        return res.sendStatus(404);
    }

    if (String(option.branch) != String(branchId)) {
        return res.sendStatus(403);
    }

    await services.deleteOption({ _id: optionId })
    res.sendStatus(200)
}

