import { Router } from "express";
import { createBranchCrewSessionHandler } from "../controller/session.controller";
import { validateRequest } from "../middleware";
import { createCrewSessionSchema} from "../schema/user.schema";


const kitchen = Router();

// Sign In
kitchen.post("/signin", [validateRequest(createCrewSessionSchema)], createBranchCrewSessionHandler);

export default kitchen;