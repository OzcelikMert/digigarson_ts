import { get, omit } from "lodash";
import { Request, Response } from "express";
import { createBranch, findBranch, findOneBranch } from "../../service/branch.service";
import log from "../../logger";
import { createCountry, findCountrys, deleteCountry, countCountry } from "../../service/country.service";


// @desc    create a new Country
// @route   POST /v1/superadmin/country
// @access  Private
//süper admin olarak görev yaptığı body den gelen response yeni ülke ekler.
export async function createCountryHandler(req: Request, res: Response) {
    try {
        const country = await createCountry(req.body);
        res.send(country)
    } catch (e: any) {
        log.error(e);
        return res.status(409).send(e.message);
    }
}


// @desc    delete  Country
// @route   DELETE /v1/superadmin/country/:countryId
// @access  Private
//süper admin olarak görev yaptığı parametreden gelen countryId den ülkeyi siler.
export async function deleteCountryHandler(req: Request, res: Response) {
    const countryId = get(req.params, "countryId");
    await deleteCountry({ _id: countryId })
    res.sendStatus(200)
}

// @desc    get Countrys
// @route   GET /v1/superadmin/country
// @access  Private
//süper admin olarak görev yaptığı parametreden gelen veri tabanına bütün şehirlerin listesini gönderir.
export async function getAllCountryHandler(req: Request, res: Response) {
    const range = req.query
    try {
        let _mongoQuery = JSON.parse(get(req, "params._mongoQuery"))
        let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"))


        const country = await findCountrys(_mongoQuery, _mongoOptions);
        const count = await countCountry({});
        res.setHeader("Content-Range", `country ${range._start}-${range._end}/${count}`);
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
        res.setHeader('X-Total-Count', count)
        res.send(country.map(item => (omit(Object.assign(item, { id: item._id }), "_id"))))
    } catch (e: any) {
        return res.status(404).send(e.message);
    }
}


