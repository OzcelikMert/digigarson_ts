import { get, omit } from "lodash";
import { Request, Response } from "express";
import { findOneBranch } from "../../service/branch.service";
import { findCategories, findCategory } from "../../service/category.service";
import { findProducts } from "../../service/product.service";



const Category = {
// @desc    get Categories
// @route   GET /v1/pos/category
// @access  Public
//pos olarak görev yaptığı branch e kategorilerin listesini gösterir.
getCategoryHandler: async function (req: Request, res: Response) {

    const branchId = get(req, "user.branchId");
    const range = req.query
    let categories = await findCategories({ branch: branchId }, {})
    res.setHeader("Content-Range", `categories ${range._start}-${range._end}/${categories.length}`);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
    res.setHeader('X-Total-Count', categories.length)

    res.send(categories.map(item => (omit(Object.assign(item, { id: item._id }), "_id"))))
},
// @desc    get All Product
// @route   GET /v1/pos/category/:categoryId
// @access  Private
////pos olarak görev yaptığı branch e ürünlerin listesini gösterir.
getProductsByCategoryId: async function (req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    let categoryId = get(req.params, "categoryId")
    const range = req.query
    const headerName = "X-Total-Count";
    let category = await findCategory({ _id: categoryId })
    category = (omit(Object.assign(category, { id: get(category,"_id") }), "_id"))
    let products = await findProducts({ category: categoryId })
    const header = `products ${range._start}-${range._end}/${products.length}`;
    res.setHeader(headerName, header);
    res.send(Object.assign(category, { products:products.map(item => (omit(Object.assign(item, { id: item._id }), "_id"))) }))
}
}
export default Category;