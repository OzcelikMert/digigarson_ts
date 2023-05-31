import { get, omit } from "lodash";
import { Request, Response } from "express";
import log from "../../logger";
import { countServe, createServe, deleteServe, findAndUpdate, findServe , findServes} from "../../service/serve.service";



// @desc    Create a new Serve
// @route   GET /v1/manager/serve
// @access  Private
//manager olarak görev yapan branch in içerisine yeni ikramlar oluşturur.
export async function createServeHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const userId = get(req, "user._id");
    try {
        let serve: any = await createServe({ ...req.body, branch: branchId})
        return res.send({ ...serve._doc, id: serve._id })
    } catch (e: any) {
        log.error(e)
        res.status(409).send(e.message)
    }
}


// @desc    get Serves
// @route   GET /v1/manager/serve
// @access  Public
//manager olarak görev yapan branch e  oluşturduğumuz ikramlar  listesini gönderir.
export async function getServeHandler(req: Request, res: Response) {


    const branchId = get(req, "user.branchId");
    const range = req.query
    let _mongoQuery = JSON.parse(get(req, "params._mongoQuery"))
    let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"))
  

    let serves = await findServes({ ..._mongoQuery, branch: branchId }, {}, _mongoOptions)
    const count = await countServe({ ..._mongoQuery, branch: branchId })

    res.setHeader("Content-Range", `serves ${range._start}-${range._end}/${count}`);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
    res.setHeader('X-Total-Count', count)
    return res.send(serves.map(item => (omit(Object.assign(item, { id: item._id }), "_id"))))
}


// @desc    get Serve By Id
// @route   GET /v1/manager/serve/:serveId
// @access  Public
// manager olarak görev yapan branch e ikramların Idlerini bulup listeler.
export async function getServeByIdHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const serveId = get(req.params, "serveId");
    let serve: any = await findServe({ branch: branchId, _id: serveId })
    return res.send(Object.assign(serve, { id: serve._id }))
}
// @desc    put Serve by Id
// @route   PUT /v1/manager/serve/:serveId
// @access  Private
//manager olarak görev yapan branch içerisindeki ikramları değiştirir.
export async function updateServeHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    
    const serveId = get(req.params, "serveId");

    let serve: any = await findServe({ _id: serveId })
    if (!serve) {
        return res.sendStatus(404);
    }

    if (String(serve.branch) != String(branchId)) {
        return res.sendStatus(403);
    }
    serve = await findAndUpdate({ _id: serveId }, req.body)
    return res.send(serve)

}

  



// @desc    Delete Serve by Id
// @route   DEL /v1/manager/serve/:serveId
// @access  Private
//manager olarak görev yapan branch içerisindeki ikramları siler.
export async function deleteServeHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    

    const serveId = get(req.params, "serveId");

    let serve: any = await findServe({ _id: serveId })

    if (!serve) {
        return res.sendStatus(404);
    }

    if (String(serve.branch) != String(branchId)) {
        return res.sendStatus(403);
    }

    await deleteServe({ _id: serveId })
    return res.sendStatus(200)

}