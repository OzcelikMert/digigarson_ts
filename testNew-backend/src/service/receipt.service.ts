import { DocumentDefinition, FilterQuery, UpdateQuery } from "mongoose";
import{
ReceiptModel as Receipt,
ReceiptDocument,
} from "../model/";

export function createReceipt(input: DocumentDefinition<ReceiptDocument>) {
    try {
        return Receipt.create(input);
    } catch (error: any) {
        throw new Error(error);
    }
}

export function deleteReceipt(query: FilterQuery<ReceiptDocument>) {
    return Receipt.deleteOne(query)
}

export function updateReceipt(
    query: FilterQuery<ReceiptDocument>,
    update: UpdateQuery<ReceiptDocument>
) {
    return Receipt.findOneAndUpdate(query, update, { new: true, runValidators: true })
}

export function findReceipt(query: FilterQuery<ReceiptDocument>,
    projection: {} = {},
    options: any = { lean: true }) {
    return Receipt.find(query, projection, options)
}

export function findOneReceipt(query: FilterQuery<ReceiptDocument>) {
    return Receipt.findOne(query)
}

