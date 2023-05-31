import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import AnalysisCustomer, { AnalysisCustomerDocument } from "../model/analysis.customer.model";



//analizdeki müşterileri ekler.
export function createAnalysisCustomer(input: DocumentDefinition<AnalysisCustomerDocument>) {
  try {
    return AnalysisCustomer.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}


//analizdeki müşterileri bulur.
export function findAnalysisCustomers(
  query: FilterQuery<AnalysisCustomerDocument>,
  projection: {} = {},
  options: QueryOptions = { lean: true }
) {
  return AnalysisCustomer.find(query, projection , options);
}
//analizdeki müşterileri bulur.
export function findAnalysisCustomer(
  query: FilterQuery<AnalysisCustomerDocument>,
  options: QueryOptions = { lean: true }
) {
  return AnalysisCustomer.findOne(query, {}, options);
}

//bulur ve değişiklik yapar.
export function findAndUpdate(
  query: FilterQuery<AnalysisCustomerDocument>,
  update: UpdateQuery<AnalysisCustomerDocument>,
) {
  return AnalysisCustomer.findOneAndUpdate(query, update, {
    new: true,
    runValidators: true,
  });
}

//analizdeki müşterileri siler.
export function deleteAnalysisCustomer(query: FilterQuery<AnalysisCustomerDocument>) {
  return AnalysisCustomer.deleteOne(query);
}

//analizdeki müşterileri sayar.
export function countAnalysisCustomer(query: FilterQuery<AnalysisCustomerDocument>) {
  return AnalysisCustomer.countDocuments(query);
}
