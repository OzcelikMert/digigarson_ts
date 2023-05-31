import { get, omit } from "lodash";
import { Request, Response } from "express";
import { findDiscount } from "../../service/userdiscount.service";

export async function getDiscountHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const key = get(req.body, "key");
    let discount = await findDiscount({ key: key, isActive: true }, {}, {})

        res.send(discount)

}