import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,

} from "mongoose";

import {TableModel, TableDocument} from "../model/";
import { findProduct } from "./product.service";

//masa oluşturur.
export async function createTable(input: DocumentDefinition<TableDocument>) {
  return TableModel.create(input);
}
export async function createMultiTables(input: any) {
  return TableModel.create(input);
}

//masayı bulur.
export function findTable(
  query: FilterQuery<TableDocument>,
  projection = {},
  options: QueryOptions = { lean: true }
) {
  return TableModel.findOne(query, projection, options);
}

//seçeneklere bağlı masaları bulur.
export function findTablesBySection(
  query: FilterQuery<TableDocument>,
  options: QueryOptions = { lean: true }
) {
  return TableModel.find(query, {}, options);
}

//masaları bulur.
export function findTables(
  query: FilterQuery<TableDocument>,
  projection = {},
  options: QueryOptions = { lean: true }
) {
  return TableModel.find(query, projection, options);
}

//masayı bulur ve günceller.
export async function findAndUpdate(
  query: FilterQuery<TableDocument>,
  update: UpdateQuery<TableDocument>
) {
  return TableModel.findOneAndUpdate(query, update, {
    new: true,
    runValidators: true,
  });
}
//Kasa Satış Masasını Günceller
export async function setSafeSales(query: FilterQuery<TableDocument>, update: any) {
  return TableModel.updateOne(query, {
    '$set': update
  })
}
//bir tane masada değişiklik yapar.
export async function updateOne(
  query: FilterQuery<TableDocument>,
  update: UpdateQuery<TableDocument>,
  options: QueryOptions = { lean: true }
) {
  return TableModel.updateOne(query, update, {
    upsert: true,
    new: true,
    runValidators: true,
  });
}

//masayı siler.
export function deleteTable(query: FilterQuery<TableDocument>) {
  return TableModel.deleteOne(query);
}

//çoklu masayı siler.
export function deleteManyTable(query: FilterQuery<TableDocument>) {
  return TableModel.deleteMany(query);
}


//masaya ait toplam adisyonunu getirir.
export async function getTableTotalCheck(tableId: string, target_currency: string = "TL") {
  const table: any = await findTable({ _id: tableId }, { orders: 1, discount: 1, cover: 1 });
  let discount = table.discount;
  let cover = table.cover;
  let amount = 0;
  let currency = "TL";
  await Promise.all(table.orders.map(async (item: { productId: any; price: number; quantity: number; }) => {
    amount += item.price;
  }))
  const coversSum = cover?.map((item: any) => item.price * item.quantity).reduce((prev: any, all: any) => prev + all, 0)
  amount += coversSum
  const discountsSum = discount?.map((item: any) => item.amount).reduce((prev: any, all: any) => prev + all, 0);
  amount -= discountsSum;

  /// total convert target_currency;
  amount = Number(amount.toFixed(2))
  return {
    amount, currency
  }
}

//masadaki ürünlerin bilgilerini getirir.
export async function getTableProductsWithInfo(tableId: string, target_currency: string = "TL") {
  const table: any = await findTable({ _id: tableId }, { orders: 1 })
  let products = await Promise.all(table.orders.map(async (item: { _id: any; productId: any; priceName: string; price: number; quantity: number; options: any }) => {
    let product: any = await findProduct({ _id: item.productId });
    // let options: any = item.options.map((x: any) => x)
    /// price convert target_currency;
    return ({
      orderId: item._id,
      name: product?.title,
      priceName: item.priceName,
      quantity: item.quantity,
      price: item.price,
      productId: item.productId,
      options: item.options
    })
  }))
  return products;
}

//masa için ödeme oluşturur.
export async function createPayment(tableId: string, type: number, amount: number, currency: string, tickId?: string) {
  await updateOne({ _id: tableId }, { "$push": { "payments": { type, amount, currency, tickId } } })
  return true
}

//masadaki ödeme de değişiklik yapar.
export async function updatePayment(tableId: string, type: number, amount: number, currency: string) {
  await updateOne({ _id: tableId, "payments.type": type, "payments.currency": currency },
    { $inc: { "payments.$.amount": amount } })
  return true
}

//masaya ait ödemeyi getirir.
export async function getTablePayment(tableId: string, type: number, currency: string) {
  return await findTable({ _id: tableId, payments: { $elemMatch: { type: type, currency: currency } } }, { payments: 1, _id: 0 })
}



export async function createPaidOrder(tableId: string, id: string, quantity: number) {
  await updateOne({ _id: tableId }, { "$push": { "paid_orders": { id, quantity } } })
  return true
}

export async function updatePaidOrder(tableId: string, id: string, quantity: number) {
  await updateOne({ _id: tableId, "paid_orders.id": id },
    { $inc: { "paid_orders.$.quantity": quantity } })
  return true
}


export async function getTablePaidOrder(tableId: string, id: string) {
  return await findTable({ _id: tableId, paid_orders: { $elemMatch: { id: id } } }, { paid_orders: 1, _id: 0 })
}



export async function getTableTotalPayments(tableId: string, target_currency: string = "TL") {
  const allPayments: any = await findTable({ _id: tableId }, { payments: 1 });
    const newallPayment: any = allPayments.payments.filter((_: any) => _.type != 14)
    let total = newallPayment.reduce((prev: any, all: any) => ({ ...prev, amount: all.amount + prev.amount }),{ currency: target_currency, amount: 0 });
    total = { ...total, amount: Number(total.amount.toFixed(2))}
  return total;
}


//masayı kapatır.
/// Masanın, ödemeleri ve ödenmesi gerekenleri eşit olması gerekir.
export function closeTable(tableId: string) {
  return TableModel.updateOne({ _id: tableId }, {
    '$set': {
      orders: [],
      cancelled_orders: [],
      paid_orders: [],
      isPrint: {status: false,print: false},
      payments: [],
      discount: [],
      cover: [],
      order_type: 0, 
      busy: false,
      logs: []
    }
  })
}

//masa sayar.
export function countTable(query: FilterQuery<TableDocument>) {
  return TableModel.countDocuments(query);
}
//masaya giriş yapar.
export async function tableInsertLog(tableId: string, logs: string[]) {
  return TableModel.updateOne({ _id: tableId }, { "$push": { "logs": { "$each": logs } } })
}

//masanın bütün verilerini ayarlar.
export async function setTableAllData(tableId: string, fromTable: any) {
  return TableModel.updateOne({ _id: tableId }, {
    '$set': {
      orders: fromTable.orders,
      cancelled_orders: fromTable.cancelled_orders,
      paid_orders: fromTable.paid_orders,
      payments: fromTable.payments,
      busy: true,
      order_type: fromTable.order_type,
      logs: fromTable.logs
    }
  })
}

export async function getGroupByBusyTable(query: FilterQuery<TableDocument> = {}) {
  return TableModel.aggregate([{ '$match': query }, { '$group': { _id: "$busy", count: { '$sum': 1 } } }])
}



//Masa Yazdırma durum güncellemesi
export async function tableIsPrint(tableId: string, status: boolean, print: boolean){
  return TableModel.updateOne({_id: tableId}, {
    '$set': {
      "isPrint.status": status,
      "isPrint.print": print
    }
  })
}