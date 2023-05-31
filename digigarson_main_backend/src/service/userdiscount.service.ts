import {
    DocumentDefinition,
    FilterQuery,
    UpdateQuery
} from "mongoose";

import Discount, { DiscountDocument } from "../model/userdiscount.model";

export function createDiscount(input: DocumentDefinition<DiscountDocument>) {
    try {
        return Discount.create(input);
    } catch (error: any) {
        throw new Error(error);
    }
}
export function findDiscount(
    query: FilterQuery<DiscountDocument>,
    projection: {} = {},
    options: any = { lean: true }
) {
    return Discount.find(query, projection, options);
}
export function findOneDiscount(
    query: FilterQuery<DiscountDocument>,
    projection: {} = {},
    options: any = { lean: true }
) {
    return Discount.findOne(query, projection, options);
}

export function updateDiscount(
    query: FilterQuery<DiscountDocument>,
    update: UpdateQuery<DiscountDocument>
) {
    return Discount.updateOne(query, update, {
        new: true,
        runValidators: true,
    });
}

export function deleteDiscount(query: FilterQuery<DiscountDocument>, input: any) {
    return Discount.deleteOne(query)
}