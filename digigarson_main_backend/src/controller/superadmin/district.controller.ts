import { get, omit } from "lodash";
import { Request, Response } from "express";
import log from "../../logger";
import { createDistrict, findDistricts, deleteDistrict, countDistrict } from "../../service/district.service";

// @desc    create a new District
// @route   POST /v1/superadmin/district
// @access  Private
//süper admin olarak görev yaptığı parametreden gelen yere yeni semt ekler.
export async function createDistrictHandler(req: Request, res: Response) {
    try {
        const district = await createDistrict({ ...req.body });
        res.send(district)
    } catch (e: any) {
        return res.status(409).send(e.message);
    }
}

// @desc    delete  District
// @route   DELETE /v1/superadmin/district/districtId
// @access  Private
//süper admin olarak görev yaptığı parametreden gelen districtId de bulunan semti siler.
export async function deleteDistrictHandler(req: Request, res: Response) {
    const districtId = get(req.params, "districtId");
    await deleteDistrict({ _id: districtId })
    res.sendStatus(200)
}



// @desc    get Districts
// @route   GET /v1/superadmin/district
// @access  Private
//süper admin olarak görev yaptığı parametreden gelen veritabanına bütün semtlerin listesini gönderir.
export async function getAllDistrictHandler(req: Request, res: Response) {
    const range = req.query
    try {
        let _mongoQuery = JSON.parse(get(req, "params._mongoQuery"))
        let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"))
        const district = await findDistricts(_mongoQuery, _mongoOptions);
        const count = await countDistrict({});
        res.setHeader("Content-Range", `district ${range._start}-${range._end}/${count}`);
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
        res.setHeader('X-Total-Count', count)
        res.send(district.map(item => (omit(Object.assign(item, { id: item._id }), "_id"))))
    } catch (e: any) {
        return res.status(404).send(e.message);
    }
}

