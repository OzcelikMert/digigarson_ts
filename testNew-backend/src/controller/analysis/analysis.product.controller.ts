import { get, omit } from "lodash";
import { countProduct, findProducts } from "../../service/product.service";
import { Request, Response } from "express";



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

/*export async function getProductHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId")
    const products = findProducts({branch: branchId})
    if(!products){
        res.send("No product found")
    }
    res.send(products)

}*/