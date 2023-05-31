import { Request, Response, NextFunction } from "express";
import { findOneBranch } from "../service/branch.service";
import { get } from "lodash";

const branchActive = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const _id = get(req, "user");
  const branch : any = await findOneBranch({ crew: { $elemMatch: {user: _id}}});
  if(!branch) {
    
    return res.status(404).send("Branch is a not found.");
  }


  const status = branch.active;
  
  if(!status){
    return res.status(404).send("Branch is a not active.");
  }

  return next();
};

export default branchActive;