import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { findTable } from "../service/table.service";
import { findProducts } from "../service/product.service";
import { findOneBranch } from "../service/branch.service";
import { findOptions } from "../service/option.service";
import { findBranchCustomer } from "../service/branchcustomer.service";

//// If table exists and control busy
export async function checkTable(req: Request, res: Response, next: NextFunction) {
    const tableId = get(req.params, "tableId")
    const table: any = await findTable({ _id: tableId }, { busy: 1 })
    if (!table) {
        return res.status(404).json({ success: false, message: "Table not found." })
    }
    if (req.method === "POST") {
        if (table.busy) return res.status(400).send("This table is busy");
    } else if (!table.busy) {
        return res.status(400).send("This table is already not busy.");
    }
    next();
}

//// Control products exist branch
export async function checkProducts(req: Request, res: Response, next: NextFunction) {

    const branchId = get(req, "user.branchId") || get(req.params, "branchId");
    let productsIds: any = [];
    let optionsIds: any = [];
    let totalPrice= 0;

    req.body.products.forEach((product: any) => {
        if(!productsIds.includes(product.product)) {
            productsIds.push(product.product)
        }
        product.options?.forEach((option: any) => {
            if(!optionsIds.includes(option.option_id)) {
                optionsIds.push(option.option_id);
            }
        })
    });
    
    let products = await findProducts({ _id: { '$in': productsIds }, branch: branchId }),
        options: any = await findOptions({ _id: { '$in': optionsIds }, branch: branchId });
    if (
        productsIds.length === productsIds.length &&
        optionsIds.length === options.length
    ) {
        let orderData = req.body.products.map((item: any) => {
            let product: any = products.findSingle("_id", item.product);
            if(!product) return false;
            
            let forcedOptionId: string[] = [];
            product.options?.forEach((item: any) => { if(item.is_forced_choice) forcedOptionId.push(item.option_id)});
            if(forcedOptionId.length > 0) {
                if (item.options?.filter((option: any) => forcedOptionId.includes(option.option_id.toString())).length != forcedOptionId.length) {
                    res.status(400).json({ success: false, message: `${product.title} forced options error` })
                    return false
                }
            }

            let price: any = product.prices?.findSingle("_id", item.price);
            if(!price) {
                res.status(400).json({ success: false, message: `${product.title} price error` })
                return false
            }

            let itemOptions = item.options?.reduce((prev: any, next: any) => {
                let optionElement: any = options.findSingle("_id", next.option_id);
                if (!optionElement) return
                let selectedSubitems: any = optionElement.items.filter((x: any) => Array.isArray(next.items) && next.items.indexOfKey("item_id", x._id.toString()) > -1)
                return {
                    string: prev.string += `${optionElement.name}:${selectedSubitems.reduce((prev: any, next: any) => (prev += next.item_name + ","), "")}-`,
                    value: prev.value += selectedSubitems.reduce((prev: any, next: any) => prev += next.price, 0)
                }
            },{ string: "", value: 0 }) || { string: "", value: 0 };

            let returnData = {
                isFirst: item.isFirst ?? false,
                productId: item.product,
                productName: product.title,
                quantity: item.quantity,
                priceId: item?.price,
                priceName: price?.price_name,
                price: (price.price + itemOptions.value) * item.quantity,
                optionsString: itemOptions.string,
                note: item?.note,
                options: item?.options
            }
            totalPrice += Number(returnData.price);
            return returnData;
        })

        if (!orderData.includes(false)) {
            req.body = {
                products: orderData,
                totalPrice: totalPrice
            }
            next();
        }
    } else {
        return res.status(400).json({ success: false, message: "Same products can not found." })
    }

}


//// If order exists and control busy
export async function checkOrder(req: Request, res: Response, next: NextFunction) {

    const tableId = get(req.params, "tableId");
    const orderId = get(req.params, "orderId");
    let table: any = await findTable({ "_id": tableId, "orders._id": orderId })
    if (!table) return res.status(404).json({ success: false, message: "Order not found." })
    next();
}



//// Control products exist branch
export async function checkBranchCustomerDelivery(req: Request, res: Response, next: NextFunction) {

    const branchId = get(req, "user.branchId")
    const customerId = get(req, "body.user")
    const addressIndex = get(req, "body.address") || 0
    const user = await findBranchCustomer({ _id: customerId })
    if (!user || user?.branch != branchId) {
        return res.status(400).json({ success: false, message: "Customer not found" })
    }
    if (user.address.length <= addressIndex) {
        return res.status(400).json({ success: false, message: "Customer address not found" })
    }
    let customer = {
        full_name: user.title,
        address: user.address[addressIndex],
        customer_id: customerId
    }
    req.body.customer = customer
    return next()

}