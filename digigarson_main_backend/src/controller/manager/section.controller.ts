import { get, set, omit } from "lodash";
import { Request, Response } from "express";
import { findOneBranch } from "../../service/branch.service";
import { createSection, findSection, findSections, findAndUpdate, deleteSection, countSection } from "../../service/section.service";
import log from "../../logger";
import { deleteManyTable } from "../../service/table.service";
import { findOneInLang, addToLang, updateLang } from "../../service/lang.service";

// @desc    create a new Section
// @route   POST /v1/manager/section
// @access  Private
//restorantlarda masaların olduğu bölüm seçeneğini ekler.
export async function createSectionHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    
    try {
        let section:any = []
        section = await createSection({ ...req.body, branch: branchId })
        /*let lang_body = { lang: get(req.body, "lang")}
        set(lang_body, 'lang[0].sectionId', section._id)
        let lang: any = await findOneInLang({ "section.sectionId": section._id })
        if (!lang) {
            await addToLang(branchId, {  "$push": { "sections": { "$each": lang_body.lang } }})
        }
        else {
            await updateLang(
                { "sections._id": section },
                lang_body.lang)
        }*/
        return res.send({ ...section._doc, id: section._id })
    } catch (e: any) {
        log.error(e)
        return res.status(409).send(e.message)
    }
}

// @desc    get All Section
// @route   GET /v1/manager/section
// @access  Public
//eklenen seçenekleri listeler.
export async function getSectionHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const range = req.query
    let _mongoQuery = JSON.parse(get(req, "params._mongoQuery"))
    let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"))

    const sections = await findSections({ ..._mongoQuery, branch: branchId },{}, _mongoOptions)
    const count = await countSection({ ..._mongoQuery, branch: branchId })

    res.setHeader("Content-Range", `sections ${range._start}-${range._end}/${count}`);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
    res.setHeader('X-Total-Count', count)

    return res.send(sections.map(item => (omit(Object.assign(item, { id: item._id }), "_id"))))
}


// @desc    get Section by Id
// @route   GET /v1/manager/section/:sectionId
// @access  Public
//eklenen seçeneklerin Idlerini listeler.
export async function getSectionByIdHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const sectionId = get(req.params, "sectionId");
    let section = await findSection({ branch: branchId, _id: sectionId })
    return res.send(section)

}


// @desc    update Section by Id
// @route   PUT /v1/manager/section/:sectionId
// @access  Private
//seçeneklerde değişiklik yapar.
export async function updateSectionHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const sectionId = get(req.params, "sectionId");

    let section: any = await findSection({ _id: sectionId })

    if (!section) {
        return res.sendStatus(404);
    }

    if (String(section.branch) != String(branchId)) {
        return res.sendStatus(403);
    }


    section = await findAndUpdate({ _id: sectionId }, req.body)
    return res.send(section)
}

// @desc    Delete Section by Id
// @route   DEL /v1/manager/section/:sectionId
// @access  Private
//eklenen seçeneği siler.
export async function deleteSectionHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");

    const sectionId = get(req.params, "sectionId");

    let section: any = await findSection({ _id: sectionId })

    if (!section) {
        return res.sendStatus(404);
    }

    if (String(section.branch) != String(branchId)) {
        return res.sendStatus(403);
    }

    await deleteManyTable({ section: sectionId })
    await deleteSection({ _id: sectionId })
    return res.sendStatus(200)
}


