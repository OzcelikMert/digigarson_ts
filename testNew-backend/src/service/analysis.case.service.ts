import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery
} from "mongoose";
import  {
  AnalysisCaseModel as AnalysisCase,
  AnalysisCaseDocument,
  CheckDocument
} from "../model";

//analiz için kasa oluşturur.
export function createAnalysisCase(input: DocumentDefinition<AnalysisCaseDocument>) {
  try {
    return AnalysisCase.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}

//kasayı bulur.
export function findAnalysisCase(
  query: FilterQuery<AnalysisCaseDocument>,
  options: QueryOptions = { lean: true }
) {
  return AnalysisCase.findOne(query, {}, options);
}

//kasaları bulur.
export function findAnalysisCases(
  query: FilterQuery<AnalysisCaseDocument>,
  options: QueryOptions = { lean: true }
) {
  return AnalysisCase.find(query, {}, options);
}

//bir tane değişiklik yapar.
export async function updateOne(
  query: FilterQuery<AnalysisCaseDocument>,
  update: UpdateQuery<AnalysisCaseDocument>
) {
  return AnalysisCase.updateOne(query, update);
}

//bulur ve değişiklik yapar.
export function findAndUpdate(
  query: FilterQuery<AnalysisCaseDocument>,
  update: UpdateQuery<AnalysisCaseDocument>,
) {
  return AnalysisCase.findOneAndUpdate(query, update, {
    new: true,
    runValidators: true,
  });
}


//bir tane değişiklik yapar.
export async function closeAnalysisCase(
  query: FilterQuery<AnalysisCaseDocument>
) {
  return AnalysisCase.updateOne(query, { '$set': { is_open: false } });
}


//kasa adisyonunun Id sini dahil eder.
export async function insertCheckIdToAnalysisCase(analysiscaseId: AnalysisCaseDocument["_id"], checkId: CheckDocument["_id"]) {
  /// Instert Id to checks Array
  return await updateOne({ _id: analysiscaseId }, { "$push": { "checks": checkId } })
}


//kasaya giren toplam miktarı oluşturur.
export async function createBalance(analysiscaseId: AnalysisCaseDocument["_id"], type: number, amount: number, currency: number) {
  return await updateOne({ _id: analysiscaseId }, { "$push": { "balance": { type, amount, currency } } })
}

//kasaya giren toplam miktar da değişiklik yapar.
export async function updateBalance(analysiscaseId: AnalysisCaseDocument["_id"], type: number, amount: number, currency: number) {
  return await updateOne({ _id: analysiscaseId, "balance.type": type, "balance.currency": currency },
    { $inc: { "balance.$.amount": amount } })
}

//kasaya giren toplam miktarı getirir.
export async function getAnalysisCaseBalance(analysiscaseId: AnalysisCaseDocument["_id"], type: number, currency: number) {
  return await findAnalysisCase({ _id: analysiscaseId, balance: { $elemMatch: { type: type, currency: currency } } })
}

export async function getOpenAnalysisCasesAndBalances(query: FilterQuery<AnalysisCaseDocument> = {}) {
  return await AnalysisCase.aggregate([{ '$match': { ...query, is_open: true } }, { "$project": { "branch": "$branch", "totalIncome": { "$sum": "$balance.amount" } } }])
}


//analizdeki kasadakileri siler.
export function deleteAnalysiscase(query: FilterQuery<AnalysisCaseDocument>) {
  return AnalysisCase.deleteOne(query);
}