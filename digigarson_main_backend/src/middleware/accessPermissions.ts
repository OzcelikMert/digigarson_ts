import { get } from "lodash";
import permissionsTypes from "../permissions";

import { Request, Response, NextFunction } from "express";
import { checkPermission } from "../service/permissions.service";

// Erişim izinlerini kontrol eder.
const accessPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const permissionId: string =
      req.method + "|" + req.baseUrl + req.route.path;
    const permissionCode: number = get(permissionsTypes, permissionId);
    const user: any = get(req, "user");
    const permission = await checkPermission(user.permissions, permissionCode);

    if (!permission) {
      return res.sendStatus(401);
    }

    return next();
  } catch (e: any) {
    res.status(404).json({ success: false, message: e.message });
  }
};

export default accessPermissions;
