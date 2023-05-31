import {Router } from "express";
import superadmin from "./superadmin";
import manager from "./manager";
import app from "./app";
import accounting from "./accounting";
import waiter from "./waiter";
import pos from "./pos";
import kitchen from "./kitchen";
import { accessPermissions, advancedResults, requiresUser, validateRequest } from "../middleware";

const router = Router();

router.use("/superadmin",superadmin);
router.use("/manager",manager);
router.use("/app",app);
router.use("/accounting",accounting);
router.use("/pos", [requiresUser, accessPermissions], pos);
router.use("/waiter",waiter);
router.use("/kitchen",kitchen);


export default router;