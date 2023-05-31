import { FilterQuery, UpdateQuery } from "mongoose";
import config from "config";
import { get } from "lodash";
import User,{ UserDocument } from "../model/user.model";
import { sign, decode } from "../utils/jwt.utils";
import { findUser } from "./user.service";



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

