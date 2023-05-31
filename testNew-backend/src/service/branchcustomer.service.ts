import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";

import {
    BranchCustomerModel as BranchCustomer,
    BranchCustomerDocument
} from "../model";

//müşteri ekler.
export function createBranchCustomer(input: DocumentDefinition<BranchCustomerDocument>) {
  try {
    return BranchCustomer.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}


//müşterileri bulur.
export function findBranchCustomers(
  query: FilterQuery<BranchCustomerDocument>,
  projection: {} = {},
  options: QueryOptions = { lean: true }
) {
  return BranchCustomer.find(query, projection , options);
}
//müşteriyi bulur.
export function findBranchCustomer(
  query: FilterQuery<BranchCustomerDocument>,
  options: QueryOptions = { lean: true }
) {
  return BranchCustomer.findOne(query, {}, options);
}

//bulur ve değişiklik yapar.
export function findAndUpdate(
  query: FilterQuery<BranchCustomerDocument>,
  update: UpdateQuery<BranchCustomerDocument>,
) {
  return BranchCustomer.findOneAndUpdate(query, update, {
    new: true,
    runValidators: true,
  });
}

//müşteriyi siler.
export function deleteBranchCustomer(query: FilterQuery<BranchCustomerDocument>) {
  return BranchCustomer.deleteOne(query);
}

//müşteriyi sayar.
export function countBranchCustomer(query: FilterQuery<BranchCustomerDocument>) {
  return BranchCustomer.countDocuments(query);
}

