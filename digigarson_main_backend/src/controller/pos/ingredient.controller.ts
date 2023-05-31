import { get, omit } from "lodash";
import { Request, Response } from "express";
import { findOneBranch } from "../../service/branch.service";
import log from "../../logger";
import { createIngredient, findIngredients } from "../../service/ingredient.service";



// @desc    get Ingredients
// @route   GET /v1/pos/ingredient
// @access  Public
//pos olarak görev yaptığı branch e içindekilerin listesini gösterir.
export async function getIngredientHandler(req: Request, res: Response) {

    const branchId = get(req, "user.branchId");
    const branch: any = await findOneBranch({ _id: branchId })
    const range = req.query
    let ingredients = await findIngredients({ branch: branchId }, {})

    res.setHeader("Content-Range", `ingredients ${range._start}-${range._end}/${ingredients.length}`);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
    res.setHeader('X-Total-Count', ingredients.length)

    res.send(ingredients.map(item => (omit(Object.assign(item, { id: item._id }), "_id"))))
}


// @desc    post Ingredients
// @route   POST /v1/pos/ingredient
// @access  Public
//pos olarak görev yaptığı branch e içindekiler ekler.
export async function createIngredientHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const userId = get(req, "user._id");
    try {
        let ingredient: any = await createIngredient({ ...req.body, branch: branchId })
        return res.send({ ...ingredient._doc, id: ingredient._id })
    } catch (e: any) {
        log.error(e)
        res.status(409).send(e.message)
    }
}



