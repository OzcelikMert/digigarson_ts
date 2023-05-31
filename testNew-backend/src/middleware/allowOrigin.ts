import { Request, Response, NextFunction } from "express";


//frontend middleware
const AllowOrigin =  (req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Expose-Headers", "X-Total-Count, Content-Range");
    next();
}
  
export default AllowOrigin