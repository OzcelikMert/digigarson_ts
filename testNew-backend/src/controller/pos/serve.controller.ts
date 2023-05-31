import { get, omit } from "lodash";
import { Request, Response } from "express";
import { findOneBranch } from "../../service/branch.service";
import log from "../../logger";
import { createServe, findServes } from "../../service/serve.service";



const Serve = {
// @desc    get Serves
// @route   GET /v1/pos/serve
// @access  Public
//pos olarak görev yaptığı branch e ikramların listesini gösterir.
    get: async function (req: Request, res: Response) {
        const branchId = get(req, "user.branchId");
        const branch: any = await findOneBranch({ _id: branchId })
        const range = req.query
        let serves = await findServes({ branch: branchId }, {})

        res.setHeader("Content-Range", `serves ${range._start}-${range._end}/${serves.length}`);
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
        res.setHeader('X-Total-Count', serves.length)

        res.send(serves.map(item => (omit(Object.assign(item, { id: item._id }), "_id"))))
    },
// @desc    post Serves
// @route   POST /v1/pos/serve
// @access  Public
//pos olarak görev yaptığı branch e ikram ekler.
    create: async function(req: Request, res: Response) {
        const branchId = get(req, "user.branchId");
        try {
            let serve: any = await createServe({ ...req.body, branch: branchId })
            return res.send({ ...serve._doc, id: serve._id })
        } catch (e: any) {
            log.error(e)
            res.status(409).send(e.message)
        }
    }
}
export default Serve;




