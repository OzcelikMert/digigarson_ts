import { get, omit } from "lodash";
import { Request, Response } from "express";
import log from "../../logger";
import { countSemiIngredient, createSemiIngredient, deleteSemiIngredient, findAndUpdate, findSemiIngredient, findSemiIngredients } from "../../service/semiingredient.service";



// @desc    Create a new Semi Ingredient
// @route   GET /v1/accounting/semiingredient
// @access  Private
//branchaccounting olarak görev yapan branch in içerisine yeni içerikler oluşturur.
export async function createSemiIngredientHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    try {
        let semiIngredient: any = await createSemiIngredient({ ...req.body, branch: branchId })
        return res.send({ ...semiIngredient._doc, id: semiIngredient._id })
    } catch (e: any) {
        log.error(e)
        return res.status(409).send(e.message)
    }
}


// @desc    get SemiIngredients
// @route   GET /v1/accounting/semiingredient
// @access  Public
//branchaccounting olarak görev yapan branch e  oluşturduğumuz içeriklerin  listesini gönderir.
export async function getSemiIngredientHandler(req: Request, res: Response) {


    const branchId = get(req, "user.branchId");
    const range = req.query
    let _mongoQuery = JSON.parse(get(req, "params._mongoQuery"))
    let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"))


    let semiingredients = await findSemiIngredients({ ..._mongoQuery, branch: branchId }, {}, _mongoOptions)
    const count = await countSemiIngredient({ ..._mongoQuery, branch: branchId })

    res.setHeader("Content-Range", `ingredients ${range._start}-${range._end}/${count}`);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
    res.setHeader('X-Total-Count', count)
    return res.send(semiingredients.map(item => (omit(Object.assign(item, { id: item._id }), "_id"))))
}


// @desc    get SemiIngredient By Id
// @route   GET /v1/accounting/semiingredient/:semiIngredientId
// @access  Public
// branchaccounting olarak görev yapan branch e içeriklerin Idlerini bulup listeler.
export async function getSemiIngredientByIdHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const SemiIngredientId = get(req.params, "semiIngredientId");
    let semiingredient: any = await findSemiIngredient({ branch: branchId, _id: SemiIngredientId })
    return res.send(Object.assign(semiingredient, { id: semiingredient._id }))
}
// @desc    put SemiIngredient by Id
// @route   PUT /v1/accounting/semiingredient/:semiIngredientId
// @access  Private
//accounting olarak görev yapan branch içerisindeki değiştirir.
export async function updateSemiIngredientHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");

    const semiIngredientId = get(req.params, "semiIngredientId");

    let semiIngredient: any = await findSemiIngredient({ _id: semiIngredientId })
    if (!semiIngredient) {
        return res.sendStatus(404);
    }

    if (String(semiIngredient.branch) != String(branchId)) {
        return res.sendStatus(403);
    }
    semiIngredient = await findAndUpdate({ _id: semiIngredientId }, req.body)
    return res.send(semiIngredient)

}





// @desc    Delete SemiIngredient by Id
// @route   DEL /v1/accounting/semiingredient/:semiIngredientId
// @access  Private
//branchaccounting olarak görev yapan branch içerisindeki içerikleri siler.
export async function deleteSemiIngredientHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");


    const semiIngredientId = get(req.params, "semiIngredientId");

    let semiIngredient: any = await findSemiIngredient({ _id: semiIngredientId })

    if (!semiIngredient) {
        return res.sendStatus(404);
    }

    if (String(semiIngredient.branch) != String(branchId)) {
        return res.sendStatus(403);
    }

    await deleteSemiIngredient({ _id: semiIngredientId })
    return res.sendStatus(200)

}