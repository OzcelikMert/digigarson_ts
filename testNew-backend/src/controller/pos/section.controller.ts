import { get } from "lodash";
import { Request, Response } from "express";
import { findOneBranch } from "../../service/branch.service";
import { findSection, findSections } from "../../service/section.service";
import { findTables } from "../../service/table.service";


const Section = {
// @desc    get All Section
// @route   GET /v1/pos/sections
// @access  Public
//pos olarak görev yaptığı branch de seçeneklerin kontrolünü yapar.
    get: async function (req: Request, res: Response) {
        const branchId = get(req, "user.branchId");
        const branch: any = await findOneBranch({ _id:branchId })
        const range = req.query
        const headerName = "X-Total-Count";
        let sections = await findSections({ branch: branchId })
        const header = `sections ${range._start}-${range._end}/${sections.length}`;
        res.setHeader(headerName, header);
        res.send(sections.map(item => Object.assign(item, { id: item._id })))
    },
    // @desc    get All Table
// @route   GET /v1/pos/:sectionId
// @access  Private
    IdByTable:async function (req: Request, res: Response) {
        const branchId = get(req, "user.branchId");
        const branch: any = await findOneBranch({ _id:branchId })
        let sectionId = get(req.params,"sectionId")
        const range = req.query
        const headerName = "X-Total-Count";
        let section = await findSection({_id:sectionId})
        let tables = await findTables({ section: sectionId })
        tables.map(item=>Object.assign(item,{id:item._id}))
        const header = `tables ${range._start}-${range._end}/${tables.length}`;
        res.setHeader(headerName, header);
        res.send(Object.assign(section,{tables}))
    }
}
export default  Section;



