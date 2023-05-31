import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import log from "../logger";
import { findDiscount } from "../service/userdiscount.service";

export async function validateDiscount(req: Request, res: Response, next: NextFunction) {
    const discountKey = get(req.body, "discountKey");
    let discount: any = await findDiscount({ key: discountKey, isActive: true }, {}, {});
    const currentDate = new Date()
    if (discount.expirationDate <= currentDate) {
        return res.status(404).json({ success: false, message: "Discount key is not valid." })
    }
    next();
}