import { Request, Response } from "express";
import { get , set} from "lodash";
import { findProducts,findProduct } from "../../service/product.service";
import { findLang, filterlang} from "../../service/lang.service";


// @desc    get All Product
// @route   GET /v1/app/product/:productId/product
// @access  Public

//app için ürünleri getiyor.
//parametreden gelen productId yi kontrol ettikten sonra, _id ye ait ürünleri buluyor ve getiriyor.

export async function getProductHandler(req: Request, res: Response) {
    const productId = get(req.params, "productId");
    let product = await findProduct({ _id: productId })
    res.send(product)
}

// @desc    get All Product
// @route   GET /v1/app//product/getallproducts/:branchId
// @access  Public

//app için ürünleri getiyor.
//paremetrelerden gelen branchId ile tüm ürünleri getirir.

export async function getBranchByIdHandler(req: Request, res: Response) {
    const branchId = get(req.params, "branchId");
    const langType: string = get(req.params, "langType")
    let product: any = await findProducts({ branch: branchId })
    let lang: any = await findLang({ branch: branchId })
    const products: any = await filterlang(product, lang, 1, langType);
    res.send(products)
}