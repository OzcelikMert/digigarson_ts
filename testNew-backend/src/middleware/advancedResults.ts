import { Request, Response, NextFunction } from "express";
import { get, omit } from "lodash"


//arama yaptığımızda, yazdığımız kelimeyle ilişkili benzer sayfaları açar ve bir sayfada gösterilecek verilerin aralığını belirler.
const advancedResults = (req: Request, res: Response, next: NextFunction) => {
  
  let mongoQuery = {};
  let mongoOptions = { lean: true }

  if (req.query.q) {
    mongoQuery = Object.assign(mongoQuery, { '$or': [{ name: { '$regex': req.query.q } }, { title: { '$regex': req.query.q } }] })
  }
  if (req.query._start) {

    mongoOptions = Object.assign(mongoOptions, { skip: Number(req.query._start) })
  }
  if (req.query._start && req.query._end) {

    mongoOptions = Object.assign(mongoOptions, { limit: Number(req.query._end) - Number(req.query._start) })
  }

  
  

  req.params._mongoQuery = JSON.stringify(mongoQuery)
  req.params._mongoOptions = JSON.stringify(mongoOptions)
  next();
};

export default advancedResults;
