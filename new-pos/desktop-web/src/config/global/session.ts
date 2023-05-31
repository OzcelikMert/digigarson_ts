import {GlobalSessionDocument} from "../../modules/config/global/session";

let GlobalSessionData: GlobalSessionDocument = {
    id: 0,
    accessToken: "",
    refreshToken: ""
}

function setSessionData(data: GlobalSessionDocument) {
    Object.assign(GlobalSessionData, data);
}

function getSessionData() : GlobalSessionDocument { return GlobalSessionData; }

export {
    setSessionData,
    getSessionData
}