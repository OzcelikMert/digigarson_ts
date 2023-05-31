import {
    DocumentDefinition,
    FilterQuery,
    UpdateQuery
} from "mongoose";

import {UserDiscountModel,UserDiscountDocument }from "../model/";

export function createDiscount(input: DocumentDefinition<UserDiscountDocument>) {
    try {
        return UserDiscountModel.create(input);
    } catch (error: any) {
        throw new Error(error);
    }
}
export function findDiscount(
    query: FilterQuery<UserDiscountDocument>,
    projection: {} = {},
    options: any = { lean: true }
) {
    return UserDiscountModel.find(query, projection, options);
}
export function findOneDiscount(
    query: FilterQuery<UserDiscountDocument>,
    projection: {} = {},
    options: any = { lean: true }
) {
    return UserDiscountModel.findOne(query, projection, options);
}

export function updateDiscount(
    query: FilterQuery<UserDiscountDocument>,
    update: UpdateQuery<UserDiscountDocument>
) {
    return UserDiscountModel.updateOne(query, update, {
        new: true,
        runValidators: true,
    });
}

export function deleteDiscount(query: FilterQuery<UserDiscountDocument>, input: any) {
    return UserDiscountModel.deleteOne(query)
}