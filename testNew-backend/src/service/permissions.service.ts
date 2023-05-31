import {FilterQuery} from "mongoose";
import {
    UserModel as User,
    UserDocument} from "../model/";

//yetki ekler.
export async function addPermission(
    query: FilterQuery<UserDocument>,
    permissionCode: number
) {
    return User.updateOne(query, {
        $push: {
            permissions: permissionCode
        }
    
    });
}

//yetkiyi siler.
export async function deletePermission(
    query: FilterQuery<UserDocument>,
    permissionCode: number
) {
    return User.updateOne(query, {
        $pull: {
            permissions: permissionCode
        }
    });
}

//yetkileri  getirir.
export async function checkPermission(permissions:Array<number>,permissionCode:number) {
    return permissions.includes(permissionCode)
}

