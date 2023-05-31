import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import AnalysisCheckInflow, { AnalysisCheckInflowDocument } from "../model/analysis.checkinflow.model";





//analizdeki yeni çek girişi ekler.
export function createAnalysisCheckInflow(input: DocumentDefinition<AnalysisCheckInflowDocument>) {
  try {
    return AnalysisCheckInflow.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}


//yeni çek girişi bulur.
export function findAnalysisCheckInflow(
  query: FilterQuery<AnalysisCheckInflowDocument>,
  options: QueryOptions = { lean: true }
) {
  return AnalysisCheckInflow.findOne(query, {}, options);
}

//çek girişleri bulur.
export function findAnalysisCheckInflows(
  query: FilterQuery<AnalysisCheckInflowDocument>,
  options: QueryOptions = { lean: true }
) {
  return AnalysisCheckInflow.find(query, {}, options);
}

//bulur ve değişiklik yapar.
export function findAndUpdate(
  query: FilterQuery<AnalysisCheckInflowDocument>,
  update: UpdateQuery<AnalysisCheckInflowDocument>,
) {
  return AnalysisCheckInflow.findOneAndUpdate(query, update, {
    new: true,
    runValidators: true,
  });
}

//analizdeki yeni çek girişi siler.
export function deleteAnalysisCheckInflow(query: FilterQuery<AnalysisCheckInflowDocument>) {
  return AnalysisCheckInflow.deleteOne(query);
}

//analizdeki yeni çek girişi sayar.
export function countAnalysisCheckInflow(query: FilterQuery<AnalysisCheckInflowDocument>) {
  return AnalysisCheckInflow.countDocuments(query);
}
