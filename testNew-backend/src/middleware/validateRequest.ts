import { AnySchema } from "yup";
import { Request, Response, NextFunction } from "express";
import log from "../logger";


//gönderilen istekler schema ile eşleşip eşleşmediğinin kontrolünü sağlamaktadır.
const validate = (schema: AnySchema) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    /// Request body filter
    if(JSON.parse(JSON.stringify(schema))?.fields?.body?._nodes){
      let filteringBody = {} as any;
      for(let property of JSON.parse(JSON.stringify(schema)).fields.body._nodes){
        filteringBody[property] = req.body[property]
      }
      req.body = filteringBody  
    }

    return next();
  } catch (e: any) {
    return res.status(400).send(e.errors);
  }
};

export default validate;
