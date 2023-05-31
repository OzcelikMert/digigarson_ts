import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import AnalysisMoneyOut, { AnalysisMoneyOutDocument } from "../model/analysis.moneyout.model";




//analizdeki yeni para çıkışı ekler.
export function createAnalysisMoneyOut(input: DocumentDefinition<AnalysisMoneyOutDocument>) {
  try {
    return AnalysisMoneyOut.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}


//analizdeki yeni para çıkışı bulur.
export function findAnalysisMoneyOuts(
  query: FilterQuery<AnalysisMoneyOutDocument>,
  projection: {} = {},
  options: QueryOptions = { lean: true }
) {
  return AnalysisMoneyOut.find(query, projection , options);
}
//analizdeki yeni para çıkışı bulur.
export function findAnalysisMoneyOut(
  query: FilterQuery<AnalysisMoneyOutDocument>,
  options: QueryOptions = { lean: true }
) {
  return AnalysisMoneyOut.findOne(query, {}, options);
}

//bulur ve değişiklik yapar.
export function findAndUpdate(
  query: FilterQuery<AnalysisMoneyOutDocument>,
  update: UpdateQuery<AnalysisMoneyOutDocument>,
) {
  return AnalysisMoneyOut.findOneAndUpdate(query, update, {
    new: true,
    runValidators: true,
  });
}

//analizdeki yeni para çıkışı siler.
export function deleteAnalysisMoneyOut(query: FilterQuery<AnalysisMoneyOutDocument>) {
  return AnalysisMoneyOut.deleteOne(query);
}

//analizdeki yeni para çıkışı sayar.
export function countAnalysisMoneyOut(query: FilterQuery<AnalysisMoneyOutDocument>) {
  return AnalysisMoneyOut.countDocuments(query);
}
