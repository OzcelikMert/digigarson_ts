import { get, omit } from "lodash";
import { Request, Response } from "express";
import { createDiscount, deleteDiscount, findDiscount, updateDiscount } from "../../service/userdiscount.service";

export async function createDiscountHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const key = get(req.body, "key")
    try {
        let discount = await findDiscount({key: key, isActive: true},{},{})
        if (discount.length > 0 ) {
            return res.send("Discount with given key already exists and is valid")
        } else {
            await createDiscount({ ...req.body, branch: branchId })
            return res.send("ok")
        }
    } catch (e: any) {
        res.status(409).send(e.message)
    }
}


export async function getDiscountHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    let discount = await findDiscount({ branch: branchId }, {}, {})
    res.send(discount)
}

export async function updateDiscountHandler(req: Request, res: Response) {
    const discountId = get(req.params, "discountId");
    await updateDiscount({ _id: discountId }, req.body)

    res.send("ok")
}

export async function deleteDiscountHandler(req: Request, res: Response) {
    const discountId = get(req.params, "discountId");
    await deleteDiscount({ _id: discountId }, req.body)
    res.send("ok")
}