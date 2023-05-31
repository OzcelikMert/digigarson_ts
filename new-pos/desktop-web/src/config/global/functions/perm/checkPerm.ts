import { getGlobalAuthData } from "config/global/auth";

const checkPerm = (permission: string) => {
  let p = false;
  getGlobalAuthData().user.permissions.forEach((perm: string) => {
    if (perm == permission) {
      p = true;
      return;
    }
  });
  return p;
};

export default checkPerm;
