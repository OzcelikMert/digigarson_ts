import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import AnalysisCheckOut, { AnalysisCheckOutDocument } from "../model/analysis.checkout.model";




//analizdeki yeni çek çıkışı ekler.
export function createAnalysisCheckOut(input: DocumentDefinition<AnalysisCheckOutDocument>) {
  try {
    return AnalysisCheckOut.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}


//analizdeki yeni çek çıkışı bulur.
export function findAnalysisCheckOuts(
  query: FilterQuery<AnalysisCheckOutDocument>,
  projection: {} = {},
  options: QueryOptions = { lean: true }
) {
  return AnalysisCheckOut.find(query, projection , options);
}
//analizdeki yeni çek çıkışı bulur.
export function findAnalysisCheckOut(
  query: FilterQuery<AnalysisCheckOutDocument>,
  options: QueryOptions = { lean: true }
) {
  return AnalysisCheckOut.findOne(query, {}, options);
}

//bulur ve değişiklik yapar.
export function findAndUpdate(
  query: FilterQuery<AnalysisCheckOutDocument>,
  update: UpdateQuery<AnalysisCheckOutDocument>,
) {
  return AnalysisCheckOut.findOneAndUpdate(query, update, {
    new: true,
    runValidators: true,
  });
}

//analizdeki yeni çek çıkışı siler.
export function deleteAnalysisCheckOut(query: FilterQuery<AnalysisCheckOutDocument>) {
  return AnalysisCheckOut.deleteOne(query);
}

//analizdeki yeni çek çıkışı sayar.
export function countAnalysisCheckOut(query: FilterQuery<AnalysisCheckOutDocument>) {
  return AnalysisCheckOut.countDocuments(query);
}
