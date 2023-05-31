import { Request, Response } from "express";
import { get } from "lodash";
import { findChecks } from "../../service/check.service";

// @desc    get my past order
// @route   GET v1/app/myorders/mypastorders
// @access  Public
//Geçmiş siparişi görüntüleme
//kullanıcı adına ait siparişleri buluyor, varsa gönderiyor yoksa hata kodu veriyor.
export async function pastOrderHander(req: Request, res: Response) {
    const userId = get(req, ("user._id"));
    const checks = await findChecks({ user: userId });
    if (checks) {
        return res.send(checks);
    } else
        return res.status(404).send("Past order is a not found.");
}