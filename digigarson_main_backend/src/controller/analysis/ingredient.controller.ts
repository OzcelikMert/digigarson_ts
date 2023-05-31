import { get, omit } from "lodash";
import { Request, Response } from "express";
import log from "../../logger";
import { countIngredient, createIngredient, deleteIngredient, findAndUpdate, findIngredient, findIngredients } from "../../service/ingredient.service";



// @desc    Create a new Ingredient
// @route   GET /v1/manager/ingredient
// @access  Private
//manager olarak görev yapan branch in içerisine yeni içerikler oluşturur.
export async function createIngredientHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const userId = get(req, "user._id");
    try {
        let ingredient: any = await createIngredient({ ...req.body, branch: branchId})
        return res.send({ ...ingredient._doc, id: ingredient._id })
    } catch (e: any) {
        log.error(e)
        res.status(409).send(e.message)
    }
}


// @desc    get Ingredients
// @route   GET /v1/manager/ingredient
// @access  Public
//manager olarak görev yapan branch e  oluşturduğumuz içeriklerin  listesini gönderir.
export async function getIngredientHandler(req: Request, res: Response) {


    const branchId = get(req, "user.branchId");
    const range = req.query
    let _mongoQuery = JSON.parse(get(req, "params._mongoQuery"))
    let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"))
  

    let ingredients = await findIngredients({ ..._mongoQuery, branch: branchId }, {}, _mongoOptions)
    const count = await countIngredient({ ..._mongoQuery, branch: branchId })

    res.setHeader("Content-Range", `ingredients ${range._start}-${range._end}/${count}`);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
    res.setHeader('X-Total-Count', count)
    return res.send(ingredients.map(item => (omit(Object.assign(item, { id: item._id }), "_id"))))
}


// @desc    get Ingredient By Id
// @route   GET /v1/manager/ingredient/:ingredientId
// @access  Public
// manager olarak görev yapan branch e içeriklerin Idlerini bulup listeler.
export async function getIngredientByIdHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const ingredientId = get(req.params, "ingredientId");
    let ingredient: any = await findIngredient({ branch: branchId, _id: ingredientId })
    return res.send(Object.assign(ingredient, { id: ingredient._id }))
}
// @desc    put Ingredient by Id
// @route   PUT /v1/manager/ingredient/:ingredientId
// @access  Private
//manager olarak görev yapan branch içerisindeki içeirkleri değiştirir.
export async function updateIngredientHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    
    const ingredientId = get(req.params, "ingredientId");

    let ingredient: any = await findIngredient({ _id: ingredientId })
    if (!ingredient) {
        return res.sendStatus(404);
    }

    if (String(ingredient.branch) != String(branchId)) {
        return res.sendStatus(403);
    }
    ingredient = await findAndUpdate({ _id: ingredientId }, req.body)
    return res.send(ingredient)

}

  



// @desc    Delete Ingredient by Id
// @route   DEL /v1/manager/ingredient/:ingredientId
// @access  Private
//manager olarak görev yapan branch içerisindeki içerikleri siler.
export async function deleteIngredientHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    

    const ingredientId = get(req.params, "ingredientId");

    let ingredient: any = await findIngredient({ _id: ingredientId })

    if (!ingredient) {
        return res.sendStatus(404);
    }

    if (String(ingredient.branch) != String(branchId)) {
        return res.sendStatus(403);
    }

    await deleteIngredient({ _id: ingredientId })
    return res.sendStatus(200)

}