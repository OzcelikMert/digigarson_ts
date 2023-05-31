import { findCategories } from "../../service/category.service";
import { Request, Response } from "express";
import { findOptions } from "../../service/option.service";
import { get } from "lodash";
import { filterlang, findLang } from "../../service/lang.service";


// @desc    get Options
// @route   GET /v1/options/getalloptions/:branchId
// @access  Public
//app için optionsları görmemizi sağlıyor.
export async function getOptionsByHandler(req: Request, res: Response) {
    const branchId = get(req.params, "branchId")
    const langType: string = get(req.params, "langType")
    let lang: any = await findLang({ branch: branchId })
    const option = await findOptions({ branch: branchId });
   // const options: any = await filterlang(option, lang, 3, langType);
    res.send(option);
}
