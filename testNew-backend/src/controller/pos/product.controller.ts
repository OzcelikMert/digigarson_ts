import { get, omit } from "lodash";
import { Request, Response } from "express";
import { findOneBranch } from "../../service/branch.service";
import { findProduct, findProducts } from "../../service/product.service";


// @desc    get All Product
// @route   GET /v1/pos/product
// @access  Public
//pos olarak görev yaptığı branch de ürünleri kontrol eder.

const Product = {
  getOne: async function (req: Request, res: Response) {
    const productId = get(req.params, "productId");
    let product = await findProduct({ _id: productId });
    res.send(product)
  },
  getAll: async function (req: Request, res: Response) {
    const branchId = get(req, "user.BranchId");
    let products = await findProducts({ branch: branchId });
    res.send(products)
  }
}
export default Product;