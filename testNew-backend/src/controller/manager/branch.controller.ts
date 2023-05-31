import { get, omit, set } from "lodash";
import { Request, Response } from "express";
import { addServices, editMinimumOrderRequirement, editWorking, findBranch, findOneBranch, updateServices } from "../../service/branch.service";
import { createQrCodes } from "../../service/qrcode.service";
import { addToLang, deletelangLocale, findOneInLang, updateLang, updatelangLocale } from "../../service/lang.service";
import { BranchDocument } from "../../model/branch.model";
import Getir from "../../service/getir.service";
import getirRoute from "../../statics/getirRoute";
import config from "../../../config/default";
// @desc    get My Branch
// @route   GET /v1/manager/mybranch
// @access  Private
//manager olarak görev aldığı branchlerin listesini gönderir.
export async function getMyBranchHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const range = req.query
    const branch = await findBranch({ _id: branchId }, { createdAt: 0, updatedAt: 0, __v: 0 });

    res.setHeader("Content-Range", `branch ${range._start}-${range._end}/${branch.length}`);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
    res.setHeader('X-Total-Count', branch.length)

    res.send(branch.map(item => omit(Object.assign(item, { id: item._id }), "_id")))
}


// @desc    get Branch by Id
// @route   GET /v1/manager/branches/:branchId
// @access  Private
//manager olarak görev aldığı branchlerin kontrolünü sağlıyor.
export async function getBranchByIdHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const branch: any = await findOneBranch({ _id: branchId })

    return res.send(Object.assign(branch, { id: branchId }))
}



// @desc    create QR Code
// @route   GET /v1/manager/qrcode
// @access  Private
//manager olarak görev yaptığı qr kodlarını oluşturur.
export async function createQrCodeHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const qrCodes = await createQrCodes(branchId, req.body)
    res.json(qrCodes)
}



// @desc    Edit Working Hours
// @route   POST /v1/manager/branchs/workinghours
// @access  Private
//manager, branch saatlerini girer.
export async function editWorkingHours(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const branch: any = await editWorking(branchId, req.body)
    res.send(branch)
}



// @desc    edit minimum order requirements
// @route   POST /v1/manager/branches/minimumorderrequirements
// @access  Private
//manager, minimum sipariş teslim süresini ve minimum tutarı girer.
export async function editMinOrders(req: Request, res: Response) {

    const branchId = get(req, "user.branchId");
    const branch: any = await editMinimumOrderRequirement(branchId, req.body)
    res.send(branch)
}



// // @desc    add services
// // @route   POST /v1/manager/branches/services
// // @access  Private
//manager, uygulama için servisler ekler
export async function addUserServices(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const branch: any = await addServices(branchId, req.body.service)
    let user_services = branch.user_services
    let last_id = user_services.slice(-1)
    let lang = get(req.body, "lang")
    set(lang, 'itemId', last_id[0]._id)
    set(lang, "type", 4 )
    await addToLang(branchId, { "$push": { items: lang } })
    return res.send({ ...branch._doc, id: branch._id })
}

// // // @desc    update services
// // // @route   PUT /v1/manager/branches/services
// // // @access  Private
// //manager, uygulama için servisler günceller.
export async function updateUserServices(req: Request, res: Response) {
    const serviceId = get(req.params, "serviceId");
    let service:object = get(req.body, "service");
    const branch:any = await updateServices(serviceId, service)
    const branchId =  branch._id;
    let lang = get(req.body, "lang")
    set(lang, 'itemId', serviceId)
    set(lang, "type", 4)
    await deletelangLocale({branch: branchId}, serviceId);
    let category_new = await updatelangLocale(branchId, serviceId, lang.locale)
    res.send(branch)
 }


 export async function getirSigIn(req: Request, res: Response){
  const query: any = await Getir.Post({},  {appSecretKey: config.appSecretKey, restaurantSecretKey: req.body.restaurantSecretKey}, getirRoute.login.path)

  res.send(query)
}  


// // // @desc    add services
// // // @route   DELETE /v1/manager/branches/services
// // // @access  Private
// //manager, uygulama içindeki servisleri siler.
// export async function deleteUserServices(req: Request, res: Response) {
//     const branchId = get(req, "user.branchId");
//     const branch = await addServices(branchId, req.body)
//     res.send(branch)
// }