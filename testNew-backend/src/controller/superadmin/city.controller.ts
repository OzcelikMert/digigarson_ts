import { get, omit } from "lodash";
import { Request, Response } from "express";
import log from "../../logger";
import { createCity, findCitys, deleteCity, countCity } from "../../service/city.service";


// @desc    create a new City
// @route   POST /v1/superadmin/city
// @access  Private
////süper admin olarak görev yaptığı parametreden gelen cityId e yeni şehir ekler.
export async function createCityHandler(req: Request, res: Response) {
    try {
        const city = await createCity(req.body);
        res.send(Object.assign(city, { id: city._id }))
    } catch (e: any) {
        return res.status(409).send(e.message);
    }
}


// @desc    delete  City
// @route   DELETE /v1/superadmin/city/:cityId
// @access  Private
//süper admin olarak görev yaptığı parametreden gelen cityId den şehir siler.
export async function deleteCityHandler(req: Request, res: Response) {
    const cityId = get(req.params, "cityId");
    await deleteCity({ _id: cityId })
    res.sendStatus(200)
}

// @desc    get Citys
// @route   GET /v1/superadmin/city
// @access  Private
//süper admin olarak görev yaptığı parametreden gelen cityId e bütün şehirlerin listesini gönderir.
export async function getAllCityHandler(req: Request, res: Response) {
    const range = req.query
    try {
        let _mongoQuery = JSON.parse(get(req, "params._mongoQuery"))
        let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"))
        const city = await findCitys(_mongoQuery, _mongoOptions);
        const count = await countCity({});
        res.setHeader("Content-Range", `city ${range._start}-${range._end}/${count}`);
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
        res.setHeader('X-Total-Count', count)

        res.send(city.map(item => (omit(Object.assign(item, { id: item._id }), "_id"))))
    } catch (e: any) {
        return res.status(404).send(e.message);
    }
}