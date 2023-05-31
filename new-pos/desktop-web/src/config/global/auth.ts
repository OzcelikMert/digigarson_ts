import {GlobalAuthDataDocument} from "../../modules/config/global";
import {GlobalAuthDataSetDocument} from "../../modules/config/global/auth";

let GlobalAuthData: GlobalAuthDataDocument = {
    tokens: {
        access: "",
        refresh: "",
    },
    user: {
        branchId: "",
        branchTitle: "",
        branch_custom_id: 0,
        name: "",
        lastname: "",
        role: "",
        permissions: []
    }
}

function setGlobalAuthData(data: GlobalAuthDataSetDocument) {
    Object.assign(GlobalAuthData, data);
}

function getGlobalAuthData() : GlobalAuthDataDocument { return GlobalAuthData; }

export { setGlobalAuthData, getGlobalAuthData }