import { store } from "@/config/store";

const get = (params: IUserGetParamService): IUserModel => { 
    const users = store.get("users"); 
    return users.find(user => user.id === params.id) || { id: params.id, isDarkMode: false };
}

const update = (params: IUserModel): boolean => {
    try {
        let users = store.get("users");
        let found = false;

        users = users.map(user => {
            if (user.id === params.id) {
                user = params;
                found = true;
            }

            return user;
        });

        if (!found) {
            users.push(params);
        }

        store.set("users", users);
    } catch (error) {
        console.log(error);
        return false;
    }

    return true;
}

export const UserService = {
    get,
    update
}