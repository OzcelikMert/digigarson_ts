const get = async (params: { id: number }): Promise<IUserModel | null> => { 
    return null; 
}

const add = async (params: IUserModel): Promise<boolean> => { 
    return false; 
};

const update = async (params: IUserModel): Promise<boolean> => {
    return false;
}

export const UserService = {
    get,
    add,
    update
}