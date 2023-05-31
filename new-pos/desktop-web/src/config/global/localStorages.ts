import {bottomButtons, caseSaleButtons, rightButtons, takeawayButtons} from "../../constants/checkButtons";
import {
    LocalStoragesButtonDocument,
    LocalStoragesGeneralPrinterDocument,
    LocalStoragesPrinterGroupDocument
} from "../../modules/config/global/localStorages";

const GlobalLocalStorages = {
    Token: {
        set(access: string, refresh: string) {
            window.localStorage.setItem(process.env.REACT_APP_ACCESS_TOKEN_NAME!, access);
            window.localStorage.setItem(process.env.REACT_APP_REFRESH_TOKEN_NAME!, refresh);
        },
        delete() {
            window.localStorage.setItem(process.env.REACT_APP_ACCESS_TOKEN_NAME!, "");
            window.localStorage.setItem(process.env.REACT_APP_REFRESH_TOKEN_NAME!, "");
        },
        get get() {
            return {
                access: window.localStorage.getItem(process.env.REACT_APP_ACCESS_TOKEN_NAME!)!,
                refresh: window.localStorage.getItem(process.env.REACT_APP_REFRESH_TOKEN_NAME!)!
            }
        }
    },
    Buttons: {
        set(params: LocalStoragesButtonDocument) {
            window.localStorage.setItem("rightButtons", JSON.stringify(params.rightButtons));
            window.localStorage.setItem("bottomButtons", JSON.stringify(params.bottomButtons));
            window.localStorage.setItem("takeawayButtons", JSON.stringify(params.takeawayButtons));
            window.localStorage.setItem("caseSaleButtons", JSON.stringify(params.caseSaleButtons))
        },
        get get(): LocalStoragesButtonDocument {
            return {
                bottomButtons: JSON.parse(window.localStorage.getItem("bottomButtons") || JSON.stringify(bottomButtons)),
                rightButtons: JSON.parse(window.localStorage.getItem("rightButtons") || JSON.stringify(rightButtons)),
                takeawayButtons: JSON.parse(window.localStorage.getItem("takeawayButtons") || JSON.stringify(takeawayButtons)),
                caseSaleButtons: JSON.parse(window.localStorage.getItem("caseSaleButtons") || JSON.stringify(caseSaleButtons))
            }
        }
    },
    User: {
        set(branchId: string) {
            window.localStorage.setItem("BranchID", branchId);
        },
        delete() {
            window.localStorage.setItem("BranchID", "");
        },
        get get() {
            return {
                branchId: window.localStorage.getItem("BranchID")
            }
        }
    },
    PrinterGroups: {
        set(data: LocalStoragesPrinterGroupDocument[]) {
            window.localStorage.setItem("printer-groups", JSON.stringify(data));
        },
        delete() {
            window.localStorage.removeItem("printer-groups");
        },
        get get(): LocalStoragesPrinterGroupDocument[] {
            return JSON.parse(window.localStorage.getItem("printer-groups") || "[]")
        }
    },
    GeneralPrinter: {
        set(data: LocalStoragesGeneralPrinterDocument) {
            window.localStorage.setItem("general-printer", JSON.stringify(data));
        },
        delete() {
            window.localStorage.removeItem("general-printer");
        },
        get get(): LocalStoragesGeneralPrinterDocument {
            return JSON.parse(window.localStorage.getItem("general-printer") || "[]")
        }
    }
}

export default GlobalLocalStorages;