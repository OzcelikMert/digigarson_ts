import { get, omit } from "lodash";
import { Request, Response } from "express";
import log from "../../logger";
import { countBranch } from "../../service/branch.service";
import { countCategory } from "../../service/category.service";
import { countProduct } from "../../service/product.service";
import { getGroupByBusyTable } from "../../service/table.service";
import { getOpenCasesAndBalances } from "../../service/case.service";
import { countChecks, countSalesProduct } from "../../service/check.service";
import { countUser } from "../../service/user.service";



// @desc    get Dashboard
// @route   GET /v1/superadmin/dashboard
// @access  Private
// Superadmin short dashboard.
export async function getDashboardShortHandler(req: Request, res: Response) {
    try {

        const values = await Promise.all([
            countUser({}),
            countBranch({}),
            countCategory({}),
            countProduct({}),
            getGroupByBusyTable({}),
            getOpenCasesAndBalances({}),
            countChecks({}),
            countSalesProduct({}),
        ])
        const labels = ["qrcodeuser","branch", "category", "product", "table", "cases", "checks", "countofsaleproducts"]
        const data = labels.map((label: string, index: number) => ({ label, value: values[index] })).reduce((prev, next) => ({ ...prev, [next.label]: next.value }), {})
        res.status(200).json({ id: "basic", ...data })
    } catch (e: any) {
        return res.status(404).send(e.message);
    }
}

