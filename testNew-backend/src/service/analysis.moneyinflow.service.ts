import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import {
  AnalysisMoneyInflowModel as AnalysisMoneyInflow,
  AnalysisMoneyInflowDocument
} from "../model";




//analizdeki yeni para girişi ekler.
export function createAnalysisMoneyInflow(input: DocumentDefinition<AnalysisMoneyInflowDocument>) {
  try {
    return AnalysisMoneyInflow.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}


//yeni para girişi bulur.
export function findAnalysisMoneyInflow(
  query: FilterQuery<AnalysisMoneyInflowDocument>,
  options: QueryOptions = { lean: true }
) {
  return AnalysisMoneyInflow.findOne(query, {}, options);
}

//para girişleri bulur.
export function findAnalysisMoneyInflows(
  query: FilterQuery<AnalysisMoneyInflowDocument>,
  options: QueryOptions = { lean: true }
) {
  return AnalysisMoneyInflow.find(query, {}, options);
}

//bulur ve değişiklik yapar.
export function findAndUpdate(
  query: FilterQuery<AnalysisMoneyInflowDocument>,
  update: UpdateQuery<AnalysisMoneyInflowDocument>,
) {
  return AnalysisMoneyInflow.findOneAndUpdate(query, update, {
    new: true,
    runValidators: true,
  });
}

//analizdeki yeni para girişi siler.
export function deleteAnalysisMoneyInflow(query: FilterQuery<AnalysisMoneyInflowDocument>) {
  return AnalysisMoneyInflow.deleteOne(query);
}

//analizdeki yeni para girişi sayar.
export function countAnalysisMoneyInflow(query: FilterQuery<AnalysisMoneyInflowDocument>) {
  return AnalysisMoneyInflow.countDocuments(query);
}
