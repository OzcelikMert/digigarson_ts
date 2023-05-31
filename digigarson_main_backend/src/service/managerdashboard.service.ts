import {
  FilterQuery,
  UpdateQuery,
  QueryOptions,

} from "mongoose";

import Case, { CaseDocument } from "../model/case.model";
import Check, { CheckDocument } from "../model/check.model";
import Table, { TableDocument } from "../model/table.model";

//Get Profit.
export async function getProfit(input: FilterQuery<CaseDocument>) {
  return Case.aggregate([
    { $match: input },
    { "$project": { "_id": 1, "createdAt": 1, "updatedAt": 1, "totalIncome": { "$sum": "$balance.amount" }, "totalExpense": { "$sum": "$expense.amount" } } }])
}

//Get Income.
export async function getIncome(input: FilterQuery<CaseDocument>) {
  return Case.aggregate([
    { $match: input },
    { "$project": { "_id": 1, "createdAt": 1, "updatedAt": 1, "totalIncome": { "$sum": "$balance.amount" } } }])
}

//Get Checks count.
export async function getChecksCount(input: FilterQuery<CaseDocument>) {
  return Case.aggregate([
    { $match: input },
    { "$project": { "_id": 1, "createdAt": 1, "updatedAt": 1, "totalChecks": { $size: "$checks" } } }])
}

//Get BusyRate.
export async function getBusyRate(input: FilterQuery<TableDocument>) {
  return Table.aggregate([
    { $match: input },
    { "$group": { _id: "$busy", count: { $sum: 1 } } }
  ])
}

//Get Checks
export async function getLastChecks(input: FilterQuery<CheckDocument>) {
  return Check.find(input).sort({ createdAt: -1 })
}


//Aggregate and get most salled products
export async function getTopSellingProductsonChecks(input: FilterQuery<CheckDocument>) {
  return Check.aggregate([
    { $match: input },
    { $unwind: '$products' }, { $unwind: '$products.productName' }, { $group: { _id: '$products.productName', count: { $sum: '$products.quantity'} } }
  ])
}

//Get Last Updated Tables
export async function getLastUpdatedTables(input: FilterQuery<TableDocument>) {
  return Table.find(input).sort({ updatedAt: -1 })
}

//Get Orders Traffic
export async function getOrdersTraffic(input: FilterQuery<CheckDocument>) {
  return Check.aggregate([
    { $match: input },
    { $group: { _id: '$order_type', count: { $sum: 1 } } }
  ])
}

