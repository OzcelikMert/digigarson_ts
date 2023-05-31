import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import {
  InvoiceModel as Invoice,
  InvoiceDocument
} from "../model";

//fatura ekler.
export function createInvoice(input: DocumentDefinition<InvoiceDocument>) {
  try {
    return Invoice.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}


//faturalari bulur.
export function findInvoices(
  query: FilterQuery<InvoiceDocument>,
  projection: {} = {},
  options: QueryOptions = { lean: true }
) {
  return Invoice.find(query, projection , options);
}
//faturayı bulur.
export function findInvoice(
  query: FilterQuery<InvoiceDocument>,
  options: QueryOptions = { lean: true }
) {
  return Invoice.findOne(query, {}, options);
}

//bulur ve değişiklik yapar.
export function findAndUpdate(
  query: FilterQuery<InvoiceDocument>,
  update: UpdateQuery<InvoiceDocument>,
) {
  return Invoice.findOneAndUpdate(query, update, {
    new: true,
    runValidators: true,
  });
}

//faturayı siler.
export function deleteInvoice(query: FilterQuery<InvoiceDocument>) {
  return Invoice.deleteOne(query);
}

//faturayı sayar.
export function countInvoice(query: FilterQuery<InvoiceDocument>) {
  return Invoice.countDocuments(query);
}

