import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery
} from "mongoose";
import {
  CaseModel as Case,
  CaseDocument,
  CheckDocument
} from "../model";



//kasa oluşturur.
export function createCase(input: DocumentDefinition<CaseDocument>) {
  try {
    return Case.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}

//kasayı bulur.
export function findCase(
  query: FilterQuery<CaseDocument>,
  options: QueryOptions = { lean: true }
) {
  return Case.findOne(query, {}, options);
}

//kasaları bulur.
export function findCases(
  query: FilterQuery<CaseDocument>,
  options: QueryOptions = { lean: true }
) {
  return Case.find(query, {}, options);
}

//bir tane değişiklik yapar.
export async function updateOne(
  query: FilterQuery<CaseDocument>,
  update: UpdateQuery<CaseDocument>
) {
  return Case.updateOne(query, update);
}


//bir tane değişiklik yapar.
export async function closeCase(
  query: FilterQuery<CaseDocument>
) {
  return Case.updateOne(query, { '$set': { is_open: false } });
}


//kasa adisyonunun Id sini dahil eder.
export async function insertCheckIdToCase(caseId: CaseDocument["_id"], checkId: CheckDocument["_id"]) {
  /// Instert Id to checks Array
  return await updateOne({ _id: caseId }, { "$push": { "checks": checkId } })
}


//kasaya giren toplam miktarı oluşturur.
export async function createBalance(caseId: CaseDocument["_id"], type: number, amount: number, currency: string) {
  return await updateOne({ _id: caseId }, { "$push": { "balance": { type, amount, currency } } })
}

//kasaya giren toplam miktar da değişiklik yapar.
export async function updateBalance(caseId: CaseDocument["_id"], type: number, amount: number, currency: string) {
  return await updateOne({ _id: caseId, "balance.type": type, "balance.currency": currency },
    { $inc: { "balance.$.amount": amount } })
}

//kasaya giren toplam miktarı getirir.
export async function getCaseBalance(caseId: CaseDocument["_id"], type: number, currency: string) {
  return await findCase({ _id: caseId, balance: { $elemMatch: { type: type, currency: currency } } })
}

export async function getOpenCasesAndBalances(query: FilterQuery<CaseDocument> = {}) {
  return await Case.aggregate([{ '$match': { ...query, is_open: true } }, { "$project": { "branch": "$branch", "totalIncome": { "$sum": "$balance.amount" } } }])
}

