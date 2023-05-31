import { get, omit } from "lodash";
import { Request, Response } from "express";
import { findOneBranch } from "../../service/branch.service";
import { findProduct, findProducts } from "../../service/product.service";


// @desc    get All Product
// @route   GET /v1/waiter/product
// @access  Public
//waiter olarak görev yapan kullanıcı ürünlerin listesini gönderir.
export async function getProductHandler(req: Request, res: Response) {
  
  const productId = get(req.params, "productId");
  let product = await findProduct({ _id: productId });
  res.send(product)
}