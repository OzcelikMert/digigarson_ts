import { get } from "lodash";
import { Request, Response } from "express";
import { findCase } from "../../service/case.service";
import { findCheck, findChecks } from "../../service/check.service";


const Report={
    // @desc    get Product Based Report
    // @route   GET /v1/report/z-report/:caseId
    // @access  Public
    // Pos Kasa Z Raporu
    zreport:  async function (req: Request, res: Response) {
        const caseId = get(req.params, "caseId");
        let posCase: any = await findCase({ _id: caseId });
        let checks: any[] = await findChecks({ _id: { '$in': posCase.checks } })
        let data: any = checks.map((b: any) => {
            let exist = ({ payment: b.payments.map((x: any) => ({ type: x.type, amount: x.amount, currency: x.currency })), product: b.products.map((x: any) => ({ productName: x.productName, quantity: x.quantity, price:x.price })) })
            return exist
        }).reduce((prev: any, next: any) => {
            next.product.forEach((el: any) => {
                let existProduct = prev.products.find((x: any) => x.productName == el.productName)
                if (existProduct){
                    existProduct.quantity += el.quantity
                    existProduct.price += el.price
                }
                else prev.products.push(el)
            });
            next.payment.forEach((el: any) => {
                let existPayment = prev.payments.find((x: any) => x.type == el.type && x.currency == el.currency)
                if (existPayment) existPayment.amount += el.amount
                else prev.payments.push(el)
            });

            return prev
        }, { payments: [], products: [] })
        res.send(data)
    }
}
export default Report;