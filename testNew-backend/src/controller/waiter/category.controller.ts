import { get } from "lodash";
import { Request, Response } from "express";
import { findCategories, findCategory } from "../../service/category.service";
import { findProducts } from "../../service/product.service";


// @desc    get Categories
// @route   GET /v1/waiter/category
// @access  Public
//waiter olarak görev yapan kullanıcı kategorilerin listesini gönderir.
export async function getCategoryHandler(req: Request, res: Response) {

    const branchId = get(req, "user.branchId");
    const range = req.query
    let categories = await findCategories({ branch: branchId },{},{})

    res.setHeader("Content-Range", `categories ${range._start}-${range._end}/${categories.length}`);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
    res.setHeader('X-Total-Count', categories.length)

    res.send(categories.map(item => Object.assign(item, { id: item._id })))
}



// @desc    get All Product
// @route   GET /v1/waiter/category/:categoryId
// @access  Private
//waiter olarak görev yapan kullanıcı kategoriye ait ürünlerin listesini gönderir.
export async function getProductsHandler(req: Request, res: Response) {
    
    let categoryId = get(req.params, "categoryId")
    const range = req.query
    const headerName = "X-Total-Count";
    let category = await findCategory({ _id: categoryId })
    let products = await findProducts({ category: categoryId })
    products.map(item => Object.assign(item, { id: item._id }))
    const header = `products ${range._start}-${range._end}/${products.length}`;
    res.setHeader(headerName, header);
    res.send(Object.assign(category, { products }))
}