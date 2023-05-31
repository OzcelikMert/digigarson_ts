import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { findTable } from "../service/table.service";
import { findProducts } from "../service/product.service";
import { findOneBranch } from "../service/branch.service";


//masaya ait adisyonu çıkarır.
//// If table exists and control busy
export async function checkTable(req: Request, res: Response, next: NextFunction) {
    const _id = get(req.params, "branchId");
    const branch: any = await findOneBranch({_id});
    if (!branch) {
        res.sendStatus(404);
    }

    const tableId = get(req.params, "tableId")
    const table = await findTable({ _id: tableId, branch: branch._id }, { busy: 1 })
    if (!table) {
        return res.sendStatus(404)
    }

    /// İyileştirilmesi gerek
    if (req.method === "POST" && table.busy === true) {
        return res.status(400).send("This table is busy.")
    } else if (
        req.method !== "POST" && table.busy === false
    ) {
        return res.status(400).send("This table is already not busy.")
    }
    next();
}

