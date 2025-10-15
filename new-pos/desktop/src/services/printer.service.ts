import { store } from "@/config/store";

const get = (): IPrinterModel => {
    return store.get("printer");
}

const update = (params: IPrinterModel): boolean => {
    try {
        store.set("printer", params);
    } catch (error) {
        console.log(error);
        return false;
    }

    return true;
}

export const PrinterService = {
    get,
    update
}