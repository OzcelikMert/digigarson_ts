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
    /// İyileştirilmesi gerek
    if (req.method === "POST" && table.busy === true) {
        return res.status(400).json({ success: false, message: "This table is busy." })
    } else if (
        req.method !== "POST" && table.busy === false
    ) {
        return res.status(400).json({ success: false, message: "This table is already not busy." })

    }
    next();
}

//// Control products exist branch
export async function checkProducts(req: Request, res: Response, next: NextFunction) {

    const branchId = get(req, "user.branchId") || get(req.params, "branchId");
    const productsIds = get(req.body, "products").map((item: any) => get(item, "product"))
    const optionsIds = get(req.body, "products").map((item: any) => item.options.map((x: any) => x.id)).reduce((prev: any, next: any) => [...prev, ...next], [])
    let products = await findProducts({ _id: { '$in': productsIds }, branch: branchId });
    let options = await findOptions({ _id: { '$in': optionsIds }, branch: branchId });
    if (productsIds.every((item: any) => products.find((product: any) => item == product._id))) {

            let orderData = await Promise.all(req.body.products.map(async (item: any) => {

            let product: any = products.find((x: any) => x._id == item.product);
            let isForcedOptionsProvided = product.options.filter((option: any) => option.is_forced_choice == true).every((option: any) => item.options.find((x: any) => `${option.option_id}` == x.id))
            if (!isForcedOptionsProvided) {
                res.status(400).json({ success: false, message: `${product.title} forced options error` })
                return false
            }

            let price: any = product.prices.find((x: any) => x._id == item.price);
            let itemOptions = item.options.reduce((prev: any, next: any) => {
                let optionElement: any = options.find((x: any) => `${x._id}` == next.id);
                if (!optionElement) return
                let selectedSubitems: any = optionElement.items.filter((x: any) => next.sub_option.includes(`${x._id}`))
                return { string: prev.string += `${optionElement.name}:${selectedSubitems.reduce((prev: any, next: any) => (prev += next.item_name + ","), "")}-`, value: prev.value += selectedSubitems.reduce((prev: any, next: any) => prev += next.price, 0) }
            },{ string: "", value: 0 })
            return {
                productId: item.product,
                productName: product.title,
                quantity: item.quantity,
                priceId: item.price,
                priceName: price.price_name,
                price: (price.price + itemOptions.value) * item.quantity,
                optionsString: itemOptions.string,
                options: item.options
            }
        }))
        if (!orderData.includes(false)) {
            req.body.products = orderData
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