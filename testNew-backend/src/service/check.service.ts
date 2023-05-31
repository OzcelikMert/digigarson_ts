import  {CheckModel as Check, CheckDocument } from "../model"
import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery
} from "mongoose";



//adisyonu oluşturur.
export function createCheck(input: DocumentDefinition<CheckDocument>) {
  try {
    return Check.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}
//adiyonu bulur.
export function findCheck(
  query: FilterQuery<CheckDocument>,
  options: QueryOptions = { lean: true }
) {
  return Check.findOne(query, {}, options);
}


export function updateCheckPayments(
  query: FilterQuery<CheckDocument>,
  update: any,
) {
  return Check.findOneAndUpdate(query, update, {
    new: true,
    runValidators: true,
  });
}

//adiyonları bulur.
export function findChecks(
  query: FilterQuery<CheckDocument>,
  options: QueryOptions = { lean: true }
) {
  return Check.find(query, { __v: 0 }, options);
}



export async function countChecks(query: FilterQuery<CheckDocument>) {
  return Check.count(query)
}

export async function countSalesProduct(input: FilterQuery<CheckDocument>) {
  let data = await Check.aggregate([
    { $match: input },
    { '$project': { '_id': 0, count: { $sum: '$products.quantity' } } }
  ])
  return data.reduce((prev: number, next: any) => prev += next.count, 0)
}

export async function checkInsertLog(checkId: string, logs: string[]) {
  return Check.updateOne({ _id: checkId }, { "$push": { "logs": { "$each": logs } } })
}


export async function getTotalCheck(check: any, target_currency: string = "TL") {
  let amount = 0;
  let currency = "TL";
  await Promise.all(check.products.map(async (item: { productId: any; price: number; quantity: number; }) => {
    amount += item.price;
  }))
  /// total convert target_currency;
  amount = Number(amount.toFixed(2))
  return {
    amount, currency
  }
}

export async function getCheckTotalPayments(check: any, target_currency: string = "TL") {
  let total = check.payments.reduce((prev: any, all: any) => ({ ...prev, amount: all.amount + prev.amount }), { currency: target_currency, amount: 0 });
  total = { ...total, amount: Number(total.amount.toFixed(2)) }
  return total;
}