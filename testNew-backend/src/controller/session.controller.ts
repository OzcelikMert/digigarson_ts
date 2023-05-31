import config from "config";
import { get, omit } from "lodash";
import { Request, Response } from "express";
import { validateAdminPassword,validateBranchCrewPassword,validateManagePassword,validatePassword } from "../service/user.service";
import permissionsTypes from "../permissions"

import {
  createSession,
  createAccessToken,
  updateSession,
  findSessions
} from "../service/session.service";
import  {UserDocument, AdminUserDocument, BranchManageUserDocument, BranchCrewUserDocument} from "../model";

import { checkPermission } from "../service/permissions.service";

import { sign } from "../utils/jwt.utils";

//Admin scope giriş kontrolu.
export async function createAdminSessionHandler(req: Request, res: Response) {
  // validate the email and password
  const user = await validateAdminPassword(req.body) as AdminUserDocument;
  if (!user) {
    return res.status(401).send("Invalid username or password");
  }

  const permissionId: string = req.method + '|' + req.baseUrl + req.route.path;
  const accessCode = get(permissionsTypes, permissionId)

  if (accessCode) {
    const permission = await checkPermission(user.permissions, accessCode);
    if (!permission) {
      // access denied
      return res.sendStatus(401);
    }
  }



  //yeni bir oturum açar.
  // Create a session
  const session = await createSession(user._id, req.get("user-agent") || "", "superadmin");

  // create access token
  const accessToken = createAccessToken({
    user,
    session,
  });

  // create refresh token
  const refreshToken = sign(session, {
    expiresIn: config.get("refreshTokenTtl"), // 1 year
  });

  // send refresh & access token back
  return res.send({ accessToken, refreshToken, user:omit(user, ["__v","updatedAt","createdAt"])});
}


//Manager scope giriş kontrolu.
export async function createManageSessionHandler(req: Request, res: Response) {
  // validate the email and password
  const user = await validateManagePassword(req.body) as BranchManageUserDocument;
  
  if (!user) {
    return res.status(401).send("Invalid username or password");
  }

  const permissionId: string = req.method + '|' + req.baseUrl + req.route.path;
  const accessCode = get(permissionsTypes, permissionId)

  if (accessCode) {
    const permission = await checkPermission(user.permissions, accessCode);
    if (!permission) {
      // access denied
      return res.sendStatus(401);
    }
  }



  //yeni bir oturum açar.
  // Create a session
  const session = await createSession(user._id, req.get("user-agent") || "", "manager");

  // create access token
  const accessToken = createAccessToken({
    user,
    session,
  });

  // create refresh token
  const refreshToken = sign(session, {
    expiresIn: config.get("refreshTokenTtl"), // 1 year
  });

  // send refresh & access token back
  return res.send({ accessToken, refreshToken, user:omit(user, ["__v","updatedAt","createdAt"])});
}



//Manager scope giriş kontrolu.
export async function createBranchCrewSessionHandler(req: Request, res: Response) {
  // validate the security_code or password
  const user = await validateBranchCrewPassword(req.body) as BranchCrewUserDocument;

  if (!user) {
    return res.status(401).send("Invalid branch_custom_id or password");
  }

  const permissionId: string = req.method + '|' + req.baseUrl + req.route.path;
  const accessCode = get(permissionsTypes, permissionId)

  if (accessCode) {
    const permission = await checkPermission(user.permissions, accessCode);
    if (!permission) {
      // access denied
      return res.sendStatus(401);
    }
  }

  //yeni bir oturum açar.
  // Create a session
  const session = await createSession(user._id, req.get("user-agent") || "", "branchcrew");

  // create access token
  const accessToken = createAccessToken({
    user,
    session,
  });

  // create refresh token
  const refreshToken = sign(session, {
    expiresIn: config.get("refreshTokenTtl"), // 1 year
  });

  // send refresh & access token back
  return res.send({ accessToken, refreshToken, user:omit(user, ["__v","updatedAt","createdAt"])});
}

//User scope giriş kontrolu.
export async function createUserSessionHandler(req: Request, res: Response) {
  // validate the email and password
  const user = await validatePassword(req.body) as unknown as UserDocument;
  if (!user) {
    return res.status(401).send("Invalid username or password");
  }

  //yeni bir oturum açar.
  // Create a session
  const session = await createSession(user._id, req.get("user-agent") || "", "user");

  // create access token
  const accessToken = createAccessToken({
    user,
    session,
  });

  // create refresh token
  const refreshToken = sign(session, {
    expiresIn: config.get("refreshTokenTtl"), // 1 year
  });

  // send refresh & access token back
  return res.send({ accessToken, refreshToken, user:omit(user, ["__v","updatedAt","createdAt"])});
}



//kullanıcı adına ait hesap olup olmadığını kontrol eder.
export async function invalidateUserSessionHandler(
  req: Request,
  res: Response
) {
  const sessionId = get(req, "user.session");

  await updateSession({ _id: sessionId }, { valid: false });

  return res.sendStatus(200);
}

//kullanıcı adına ait oturum olup olmadığının kontrolünü sağlıyor.
export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = get(req, "user._id");

  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
}
