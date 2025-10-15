import { store } from "@/config/store";

const get = (): ICustomizeModel => { 
    return store.get("customize"); 
}

const update = (params: ICustomizeModel): boolean => {
    try {
        store.set("customize", params);
    } catch (error) {
        console.log(error);
        return false;
    }

    return true;
}

export const CustomizeService = {
    get,
    update
}