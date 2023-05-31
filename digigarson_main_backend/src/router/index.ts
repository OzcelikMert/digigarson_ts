import {Router } from "express";
import superadmin from "./superadmin";
import manager from "./manager";
import app from "./app";
import accounting from "./accounting";
import waiter from "./waiter";
import pos from "./pos";
import kitchen from "./kitchen";

const router = Router();

router.use("/superadmin",superadmin);
router.use("/manager",manager);
router.use("/app",app);
router.use("/accounting",accounting);
router.use("/pos",pos);
router.use("/waiter",waiter);
router.use("/kitchen",kitchen);


export default router;