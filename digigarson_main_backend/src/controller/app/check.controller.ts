import { Request, Response } from "express";
import { get } from "lodash";
import { findOneBranch } from "../../service/branch.service";
import { findProduct } from "../../service/product.service";
import { findTable, getTableProductsWithInfo, getTableTotalCheck, getTableTotalPayments } from "../../service/table.service";

// @desc    create Check
// @route   POST /v1/app/checks/:tableId
// @access  Private
export async function getCheckHandler(req: Request, res: Response) {
    const _id = get(req, "user._id");
    const tableId = get(req.params, "tableId");
    let table: any = await findTable({ _id: tableId })

    let payments = 0
    let total = await getTableTotalCheck(tableId)
    let products = await getTableProductsWithInfo(tableId);
    let paymentReceived = await getTableTotalPayments(tableId);

    let check = {
        table: table.title,
        createdAt: new Date(),
        products,
        total,
        paymentReceived
    }
    res.send(check)
}