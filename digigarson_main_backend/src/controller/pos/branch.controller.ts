import { get } from "lodash";
import { Request, Response } from "express";
import { findOneBranch } from "../../service/branch.service";
import { findCategories } from "../../service/category.service";
import { findProducts } from "../../service/product.service";
import { findSections } from "../../service/section.service";
import { findTables } from "../../service/table.service";
import { findOptions } from "../../service/option.service";

// @desc    get My Branch
// @route   GET /v1/manager/mybranch
// @access  Private
//branch e ait ketegoriler, ürünler, seçenekler,masa ve opsiyonları bulup getirir.
export async function getMyBranchHandler(req: Request, res: Response) {
    
    const branchId = get(req, "user.branchId");
    const categories: any = await findCategories({ branch: branchId }, { createdAt: 0, updatedAt: 0, __v: 0 });
    const products: any = await findProducts({ branch: branchId }, { createdAt: 0, updatedAt: 0, __v: 0, slug: 0 });
    const sections: any = await findSections({ branch: branchId }, { _id: 1, title: 1 });
    const tables: any = await findTables({ branch: branchId }, { title: 1, _id: 1, section: 1 });
    const options: any = await findOptions({ branch: branchId }, { createdAt: 0, updatedAt: 0, __v: 0 });


    if (!categories || !products || !sections || !tables || !options) {
        return res.sendStatus(404);
    }
    return res.json({ categories, products, sections, tables, options });
}