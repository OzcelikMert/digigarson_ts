import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import {
  AnalysisBillInflowModel as AnalysisBillInflow,
  AnalysisBillInflowDocument
} from "../model";





//analizdeki yeni senet girişi ekler.
export function createAnalysisBillInflow(input: DocumentDefinition<AnalysisBillInflowDocument>) {
  try {
    return AnalysisBillInflow.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}


//yeni senet girişi bulur.
export function findAnalysisBillInflow(
  query: FilterQuery<AnalysisBillInflowDocument>,
  options: QueryOptions = { lean: true }
) {
  return AnalysisBillInflow.findOne(query, {}, options);
}

//senet girişleri bulur.
export function findAnalysisBillInflows(
  query: FilterQuery<AnalysisBillInflowDocument>,
  options: QueryOptions = { lean: true }
) {
  return AnalysisBillInflow.find(query, {}, options);
}

//bulur ve değişiklik yapar.
export function findAndUpdate(
  query: FilterQuery<AnalysisBillInflowDocument>,
  update: UpdateQuery<AnalysisBillInflowDocument>,
) {
  return AnalysisBillInflow.findOneAndUpdate(query, update, {
    new: true,
    runValidators: true,
  });
}

//analizdeki yeni senet girişi siler.
export function deleteAnalysisBillInflow(query: FilterQuery<AnalysisBillInflowDocument>) {
  return AnalysisBillInflow.deleteOne(query);
}

//analizdeki yeni senet girişi sayar.
export function countAnalysisBillInflow(query: FilterQuery<AnalysisBillInflowDocument>) {
  return AnalysisBillInflow.countDocuments(query);
}
