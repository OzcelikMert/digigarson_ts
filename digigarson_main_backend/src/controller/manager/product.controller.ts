import { get, set, omit } from "lodash";
import { Request, Response } from "express";
import { findOneBranch } from "../../service/branch.service";
import { findCategory } from "../../service/category.service";
import log from "../../logger";
import { createProduct, productQractive,findProduct, findProducts, findAndUpdate, deleteProduct, countProduct } from "../../service/product.service";
import fs from 'fs';
import config from "config"
import { ObjectId } from "mongoose";
import { findOneInLang,addToLang, updatelangLocale, deletelangLocale } from "../../service/lang.service";
import { createFile, createImage } from "../../service/createImage.service";
// @desc    create a new Product
// @route   GET /v1/manager/product
// @access  Private
//kategorilerin içerisine ürümleri ekler.
export async function createProductHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    let lang = get(req.body, "lang");
    let product: any = [];
    // Check Category
    const categoryId = get(req.body.product, "category");
    let category: any = await findCategory({ _id: categoryId, branch: branchId })
    if (!category) {
        return res.status(404).json({ success: false, message: "Category not found." });
    }
    try {
        product = await createProduct({ ...req.body.product, image: "", branch: branchId })
        if (req.body.product.image) {
        await createFile(branchId);
        const image = await createImage(req.body.product.image, branchId, product._id,"products");
        await findAndUpdate({ _id: product._id }, { '$set': { image: image } })
        }
        let findlang = await findOneInLang({ branchId: branchId, "items.itemId": product.id });
        set(lang, 'type', 1);
        set(lang, 'itemId', product._id)
        if (findlang) {
            //return res.status(409).send("Lang already exists!?!")
        } else {
            await addToLang(branchId, { "$push": { items: lang } });
        }
        return res.send({ ...product._doc, id: product._id })
    } catch (e: any) {
        log.error(e)
        res.status(409).send(e.message)
    }
}

// @desc    get All Product
// @route   GET /v1/manager/product
// @access  Public
//ürünleri listeler.
export async function getProductHandler(req: Request, res: Response) {
    const range = req.query
    const branchId = get(req, "user.branchId");
    let _mongoQuery = JSON.parse(get(req, "params._mongoQuery"))
    let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"))

    let products = await findProducts({ ..._mongoQuery, branch: branchId }, {}, _mongoOptions)
    const count = await countProduct({ ..._mongoQuery, branch: branchId })
    res.setHeader("Content-Range", `products ${range._start}-${range._end}/${count}`);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
    res.setHeader('X-Total-Count', count)

    res.send(products.map(item => (omit(Object.assign(item, { id: item._id }), "_id"))))
}

// @desc    put Product by Id
// @route   PUT /v1/manager/product/:productId
// @access  Private
//ürünlerin Idlerini listeler.
export async function getProductByIdHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const productId = get(req.params, "productId");

    let product: any = await findProduct({ _id: productId })

    if (!product) {
        return res.sendStatus(404);
    }
    res.send(Object.assign(product, { id: productId }))
}


// @desc    update Product by Id
// @route   PUT /v1/manager/product/:productId
// @access  Private
//ürünlerde değişiklik yapar.
export async function updateProductHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const productId = get(req.params, "productId");
    const lang: any = get(req.body, "lang")
    let product: any = await findProduct({ _id: productId })
    if (!product) {
        return res.sendStatus(404);
    }
    if (String(product.branch) != String(branchId)) {
        return res.sendStatus(403);
    }
    // Check Category
    const categoryId = get(req.body, "product.category");
    let category: any = await findCategory({ _id: categoryId })
    if (!category) {
        return res.sendStatus(404);
    }
    if (String(category.branch) != String(branchId)) {
        return res.sendStatus(403);
    }
    await deletelangLocale({branch: branchId}, productId);
    let lang_new = await updatelangLocale(branchId, productId, lang.locale)
    
    product = await findAndUpdate({ _id: productId }, req.body.product)
    res.send({ product, lang_new })
}

// @desc    delete Product by Id
// @route   DELETE /v1/manager/product/:productId
// @access  Private
// kategorilerin içerinde bulunan ürünleri siler.
export async function deleteProductHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");


    const productId = get(req.params, "productId");

    let product: any = await findProduct({ _id: productId })

    if (!product) {
        return res.sendStatus(404);
    }

    if (String(product.branch) != String(branchId)) {
        return res.sendStatus(403);
    }

    await deleteProduct({ _id: productId })
    res.sendStatus(200)
}



export async function FavoritesAndOpportunity(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const operation: any = get(req.params, "operation");
    const productId: String = get(req.params, "productid");
    const action = get(req.params, "action");
    if (operation == "favorite" || operation == "opportunity" ||operation == "qractivate") {
        if (operation == "favorite") {
            const products: any = await findProducts({ branch: branchId, favorite: true })
            if (products.length > 5) {
                res.sendStatus(401);
            }
            await findAndUpdate({ _id: productId }, { '$set': { favorite: action } })
        }
        else if (operation == "opportunity") {
            const products: any = await findProducts({ branch: branchId, favorite: true })
            if (products.length > 5) {
                res.sendStatus(401);
            }
            await findAndUpdate({ _id: productId }, {
                '$set': {
                    opportunity: action
                }
            })
        }
        else if(operation == "qractivate"){
        let product:any = await findProduct({_id: productId});
        let active_list:Number[] = product.active_list;
            console.log(action)
        if(action == "true") 
            {  (active_list.indexOf(2) > -1) ? null : active_list.push(2);
            }
        else {
        active_list.splice(active_list.indexOf(2), 1)
        }
        await productQractive({_id: productId}, active_list);
        }
    }
    else {
        res.sendStatus(401)
    }
    res.send("ok")
}

