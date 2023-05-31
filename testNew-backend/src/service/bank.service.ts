
import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery
} from "mongoose";
import {
  BankModel as Bank,
  BankDocument,
  CheckDocument
} from "../model";




//analiz için banka oluşturur.
export function createBank(input: DocumentDefinition<BankDocument>) {
  try {
    return Bank.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}

//bankayı bulur.
export function findBank(
  query: FilterQuery<BankDocument>,
  options: QueryOptions = { lean: true }
) {
  return Bank.findOne(query, {}, options);
}

//bankaları bulur.
export function findBanks(
  query: FilterQuery<BankDocument>,
  options: QueryOptions = { lean: true }
) {
  return Bank.find(query, {}, options);
}

//bir tane değişiklik yapar.
export async function updateOne(
  query: FilterQuery<BankDocument>,
  update: UpdateQuery<BankDocument>
) {
  return Bank.updateOne(query, update);
}


//bir tane değişiklik yapar.
export async function closeBank(
  query: FilterQuery<BankDocument>
) {
  return Bank.updateOne(query, { '$set': { is_open: false } });
}


//banka adisyonunun Id sini dahil eder.
export async function insertCheckIdToBank(caseId: BankDocument["_id"], checkId: CheckDocument["_id"]) {
  /// Instert Id to checks Array
  return await updateOne({ _id: caseId }, { "$push": { "checks": checkId } })
}


//bankaya giren toplam miktarı oluşturur.
export async function createBalance(caseId: BankDocument["_id"], type: number, amount: number, currency: string) {
  return await updateOne({ _id: caseId }, { "$push": { "balance": { type, amount, currency } } })
}

//bankaya giren toplam miktar da değişiklik yapar.
export async function updateBalance(caseId: BankDocument["_id"], type: number, amount: number, currency: string) {
  return await updateOne({ _id: caseId, "balance.type": type, "balance.currency": currency },
    { $inc: { "balance.$.amount": amount } })
}

//bankaya giren toplam miktarı getirir.
export async function getBankBalance(caseId: BankDocument["_id"], type: number, currency: string) {
  return await findBank({ _id: caseId, balance: { $elemMatch: { type: type, currency: currency } } })
}

export async function getOpenBanksAndBalances(query: FilterQuery<BankDocument> = {}) {
  return await Bank.aggregate([{ '$match': { ...query, is_open: true } }, { "$project": { "branch": "$branch", "totalIncome": { "$sum": "$balance.amount" } } }])
}

