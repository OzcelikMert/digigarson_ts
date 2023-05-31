import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import AnalysisBillOut, { AnalysisBillOutDocument } from "../model/analysis.billout.model";




//analizdeki yeni çek-senet çıkışı ekler.
export function createAnalysisBillOut(input: DocumentDefinition<AnalysisBillOutDocument>) {
  try {
    return AnalysisBillOut.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}


//analizdeki yeni çek-senet çıkışı bulur.
export function findAnalysisBillOuts(
  query: FilterQuery<AnalysisBillOutDocument>,
  projection: {} = {},
  options: QueryOptions = { lean: true }
) {
  return AnalysisBillOut.find(query, projection , options);
}
//analizdeki yeni çek-senet çıkışı bulur.
export function findAnalysisBillOut(
  query: FilterQuery<AnalysisBillOutDocument>,
  options: QueryOptions = { lean: true }
) {
  return AnalysisBillOut.findOne(query, {}, options);
}

//bulur ve değişiklik yapar.
export function findAndUpdate(
  query: FilterQuery<AnalysisBillOutDocument>,
  update: UpdateQuery<AnalysisBillOutDocument>,
) {
  return AnalysisBillOut.findOneAndUpdate(query, update, {
    new: true,
    runValidators: true,
  });
}

//analizdeki yeni çek-senet çıkışı siler.
export function deleteAnalysisBillOut(query: FilterQuery<AnalysisBillOutDocument>) {
  return AnalysisBillOut.deleteOne(query);
}

//analizdeki yeni çek-senet çıkışı sayar.
export function countAnalysisBillOut(query: FilterQuery<AnalysisBillOutDocument>) {
  return AnalysisBillOut.countDocuments(query);
}
