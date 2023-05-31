import { LeanDocument, FilterQuery, UpdateQuery } from "mongoose";
import config from "config";
import { get } from "lodash";
import { UserDocument } from "../model/user.model";
import Session, { SessionDocument } from "../model/session.model";
import { sign, decode } from "../utils/jwt.utils";
import { findOneAdminUser, findOneBranchCrewUser, findOneManageUser } from "./user.service";
import { BranchCrewUserDocument } from "../model/branchcrewuser.model";
import { BranchManageDocument } from "../model/branchmanageuser.model";


//yeni oturum oluşturur.
export async function createSession(userId: string, userAgent: string, scope: string) {
  const session = await Session.create({ user: userId, userAgent, scope });

  return session.toJSON();
}

//erişim belirtici oluşturur.
export function createAccessToken({
  user,
  session,
}: {
  user:
  | Omit<UserDocument, "password">
  | LeanDocument<Omit<UserDocument, "password">>
  | Omit<BranchCrewUserDocument, "password">
  | LeanDocument<Omit<BranchCrewUserDocument, "password">>
  | Omit<BranchManageDocument, "password">
  | LeanDocument<Omit<BranchManageDocument, "password">>;
  session:
  | Omit<SessionDocument, "password">
  | LeanDocument<Omit<SessionDocument, "password">>;
}) {
  // Build and return the new access token
  const accessToken = sign(
    { ...user, session: session._id },
    { expiresIn: config.get("accessTokenTtl") } // 15 minutes
  );

  return accessToken;
}


//erişim olduğunu tekrar sor.
export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  // Decode the refresh token
  const { decoded } = decode(refreshToken);

  if (!decoded || !get(decoded, "_id")) return false;

  // Get the session
  const session: any = await Session.findById(get(decoded, "_id"));

  // Make sure the session is still valid
  if (!session || !session?.valid) return false;
  let user;

  switch (session.scope) {
    case "superadmin":
      user = await findOneAdminUser({ _id: session.user });
      break;
    case "manager":
      user = await findOneManageUser({ _id: session.user });
      break;
    case "branchcrew":
      user = await findOneBranchCrewUser({ _id: session.user });
      break;
  }

  if (!user) return false;

  const accessToken = createAccessToken({ user, session });

  return accessToken;
}




//oturumu günceller.
export async function updateSession(
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) {
  return Session.updateOne(query, update);
}

//oturumları bulur.
export async function findSessions(query: FilterQuery<SessionDocument>) {
  return Session.find(query).lean();
}
