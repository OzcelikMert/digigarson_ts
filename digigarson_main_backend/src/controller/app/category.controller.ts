import { findCategories, findCategory } from "../../service/category.service";
import { Request, Response } from "express";
import { findProducts } from "../../service/product.service";
import { get } from "lodash";
import { filterlang, findLang } from "../../service/lang.service";


// @desc    get Categories
// @route   GET /v1/category/getallcategory/:categoryId
// @access  Public
//app için kategorileri görmemizi sağlıyor.
//kategorinin içerisinde bulunan branchler arasından, parametreden gelen branchId ile eşleyeni buluyor.
export async function getCategoryHandler(req: Request, res: Response) {
    const branchId = get(req.params, "branchId")
    const langType: string = get(req.params, "langType")
    let lang: any = await findLang({ branch: branchId })
    const category = await findCategories({ branch: branchId });
    const categories: any = await filterlang(category, lang, 2, langType);
    res.send(categories);
}


// @desc    get All Product
// @route   GET /v1/app/category/getallproducts/:categoryId
// @access  Public
//app için kategorinin içerisideki ürünleri  gösteriyor.
//ürünlerin, kategoriler içerisinde parametreden gelen categoryId ile eşleyeni buluyor.
export async function getCategoryByIdHandler(req: Request, res: Response) {
    const categoryId = get(req.params, "categoryId")
    const langType: string = get(req.params, "langType")
    const category:any = await findCategory({_id: categoryId})
    const branchId = category.branch
    let lang: any = await findLang({ branch: branchId })
    const products = await findProducts({ category: categoryId }, {})
    const products_filtered: any = await filterlang(products, lang, 1, langType);
    res.send(products_filtered);
}
