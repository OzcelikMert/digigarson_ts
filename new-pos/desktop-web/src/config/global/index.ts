import GlobalStates from "./states";
import { getGlobalAuthData, setGlobalAuthData } from "./auth";
import {setSessionData, getSessionData} from "./session";
import GlobalLocalStorages from "./localStorages";
import {setGlobalBranchData, getGlobalBranchData} from "./branch";

export {
  GlobalStates,
  setSessionData,
  getSessionData,
  getGlobalAuthData,
  setGlobalAuthData,
  GlobalLocalStorages,
  setGlobalBranchData,
  getGlobalBranchData,
};
