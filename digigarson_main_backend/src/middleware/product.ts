import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import { AnySchema } from "yup";
import { findProduct, findProducts } from "../service/product.service";

const validateFavoriteAndOpportunity = () =>async (req: Request, res: Response, next: NextFunction)=> {
    const branch = get(req, "user.branchId");
    const operation:String = get(req.params, "operation");
    const productId:String = get(req.params, "productId");
    const action = get(req.params, "action");
    const product: any = await findProduct({id: productId});
    if(product){
    switch (operation) {
            case "favorite":
                var products = await findProducts({branch: branch, favorite: true})
                if(products.length > 5 || product.opportunity == true){
                    res.send("Favorites maximum limit reached. Or This product have 'opportunity'.");
                }
                break;
            case "opportunity":
                var products = await findProducts({branch: branch, opportunity: true})
                if(products.length > 5 || product.favorite == true){
                    console.log(product.favorite)
                    res.send("opportunity maximum limit reached. Or This product have 'favorite'.");
                }
                else 
                break;
            default:
                res.sendStatus(400);
                break;
    }
}else res.send("Ürün Bulunamadı")
  
next();
}
export default validateFavoriteAndOpportunity;