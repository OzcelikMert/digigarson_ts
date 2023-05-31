import { get, set, omit } from "lodash";
import { Request, Response } from "express";
import { findOneBranch } from "../../service/branch.service";
import { createCategory, findCategories, findCategory, findAndUpdate, deleteCategory, countCategory } from "../../service/category.service";
import log from "../../logger";
import { deleteProduct } from "../../service/product.service";
import fs from 'fs';
import config from "config"
import { addToLang, deletelangLocale, findOneInLang, updateLang, updatelangLocale } from "../../service/lang.service";
import { createFile, createImage } from "../../service/createImage.service";

// @desc    Create a new Category
// @route   GET /v1/manager/category
// @access  Private
//manager olarak görev yapan branch in içerisine yeni kategoriler oluşturur.
export async function createCategoryHandler(req: Request, res: Response) {

    const branchId = get(req, "user.branchId");
        let category: any = [];

    try {
        category = await createCategory({ ...req.body.category, image: "", branch: branchId })
        if (req.body.category.image) {
        await createFile(branchId);
        const image = await createImage(req.body.category.image, branchId, category._id,"category");
        await findAndUpdate({ _id: category._id }, { '$set': { image: image } })
        }
        let lang = get(req.body, "lang")
        set(lang, 'type', 2)
        set(lang, 'itemId', category._id)
        let lang_find: any = await findOneInLang({ branch: branchId, "items.itemId": category._id })
        if (!lang_find) {
            await addToLang(branchId, { "$push": { items: lang } })
        }
        else {
            return res.status(409).send("Lang already exists ?!?")
        }
        let test = await findOneInLang({ branch: branchId})
        return res.send({ category, test})

    } catch (e: any) {
        log.error(e)
        res.status(409).send(e.message)
    }
}


// @desc    get Categories
// @route   GET /v1/manager/category
// @access  Public
//manager olarak görev yapan branch e oluşturduğumuz kategorilerin listesini gönderir.
export async function getCategoryHandler(req: Request, res: Response) {

    const branchId = get(req, "user.branchId");
    const range = req.query
    let _mongoQuery = JSON.parse(get(req, "params._mongoQuery"))
    let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"))

    let categories = await findCategories({ ..._mongoQuery, branch: branchId }, {}, _mongoOptions)
    const count = await countCategory({ ..._mongoQuery, branch: branchId })

    res.setHeader("Content-Range", `categories ${range._start}-${range._end}/${count}`);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
    res.setHeader('X-Total-Count', count)
    res.send(categories.map(item => (omit(Object.assign(item, { id: item._id }), "_id"))))
}


// @desc    get Category By Id
// @route   GET /v1/manager/category/:categoryId
// @access  Public
// manager olarak görev yapan branch e kategori Idlerini bulup listeler.
export async function getCategoryByIdHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");


    const categoryId = get(req.params, "categoryId");
    let category = await findCategory({ branch: branchId, _id: categoryId })
    res.send(category)
}
// @desc    put Category by Id
// @route   PUT /v1/manager/category/:categoryId
// @access  Private
//manager olarak görev yapan branch içerisindeki kategorileri değiştirir.

export async function updateCategoryHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const branch: any = await findOneBranch({ _id: branchId })

    const categoryId = get(req.params, "categoryId");

    let category: any = await findCategory({ _id: categoryId })

    if (!category) {
        return res.sendStatus(404);
    }

    if (String(category.branch) != String(branchId)) {
        return res.sendStatus(403);
    }
    /*let existCategory = await findCategory({ title: req.body.category.title, branch: branchId })
    if (existCategory) return res.status(409).json({ success: false, message: "Title is already in use." })*/
    let lang = get(req.body, "lang")
    set(lang, 'type', 2)
    set(lang, 'itemId', categoryId)
    console.log(lang)
    await deletelangLocale({branch: branchId}, categoryId);
    let lang_new = await updatelangLocale(branchId, categoryId, lang.locale)
    category = await findAndUpdate({ _id: categoryId }, req.body.category) // CAST ERROR VERIYOR
    res.send({ category, lang_new })

}


// @desc    Delete Category by Id
// @route   DEL /v1/manager/category/:categoryId
// @access  Private
//manager olarak görev yapan branch içerisindeki kategorileri siler.
export async function deleteCategoryHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");



    const categoryId = get(req.params, "categoryId");

    let category: any = await findCategory({ _id: categoryId })


    if (!category) {
        return res.sendStatus(404);
    }

    if (String(category.branch) != String(branchId)) {
        return res.sendStatus(403);
    }

    await deleteProduct({ category: categoryId })
    await deleteCategory({ _id: categoryId })
    res.sendStatus(200)

}