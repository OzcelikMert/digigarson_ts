import { Request, Response, NextFunction } from "express";
import { get, omit } from "lodash"


//Report mongo query prepare
const reportAdvancedResult = (req: Request, res: Response, next: NextFunction) => {

  let mongoQuery = {};
  let mongoOptions = { lean: true }

  if (req.query.startdate && req.query.enddate) {
    mongoQuery = Object.assign(mongoQuery, { "createdAt": { '$gte': new Date(Number(req.query.startdate)), '$lt': new Date(Number(req.query.enddate)) } })
  } else if (req.query.startdate && !(req.query.enddate)) {
    mongoQuery = Object.assign(mongoQuery, { "createdAt": { '$gte': new Date(Number(req.query.startdate)) } })
  }
  if (req.query.per) {
    mongoOptions = Object.assign(mongoOptions, { per: Number(req.query.per) })
  }
  //@ts-ignore
  req.params._mongoQuery = mongoQuery
  req.params._mongoOptions = JSON.stringify(mongoOptions)
  next();
};

export default reportAdvancedResult;
