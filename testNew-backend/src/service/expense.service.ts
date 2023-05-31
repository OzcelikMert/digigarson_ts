import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";

import {
  ExpenseModel as Expense,
  ExpenseDocument
} from "../model";

//gider ekler.
export function createExpense(input: DocumentDefinition<ExpenseDocument>) {
  try {
    return Expense.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}


//giderleri bulur.
export function findExpenses(
  query: FilterQuery<ExpenseDocument>,
  projection: {} = {},
  options: QueryOptions = { lean: true }
) {
  return Expense.find(query, projection , options);
}
//gideri bulur.
export function findExpense(
  query: FilterQuery<ExpenseDocument>,
  options: QueryOptions = { lean: true }
) {
  return Expense.findOne(query, {}, options);
}

//bulur ve değişiklik yapar.
export function findAndUpdate(
  query: FilterQuery<ExpenseDocument>,
  update: UpdateQuery<ExpenseDocument>,
) {
  return Expense.findOneAndUpdate(query, update, {
    new: true,
    runValidators: true,
  });
}

//gideri siler.
export function deleteExpense(query: FilterQuery<ExpenseDocument>) {
  return Expense.deleteOne(query);
}

//gideri sayar.
export function countExpense(query: FilterQuery<ExpenseDocument>) {
  return Expense.countDocuments(query);
}

