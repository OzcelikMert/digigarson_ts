import { DocumentDefinition, FilterQuery, UpdateQuery, QueryOptions } from "mongoose";
import {
  TableModel as Table,
  UserModel as User,
  TableDocument as OrdersDocument,
  UserDocument
} from "../model"

//masaya userId yi ekler.
export async function instertUserId(userId: string, tableId: string) {
  return Table.updateOne({ _id: tableId }, {
    '$set': {
      userId: userId
    }
  })
}

// bbul ve değiştir.
export function findAndUpdate(
  query: FilterQuery<UserDocument>,
  update: UpdateQuery<UserDocument>,
  options: QueryOptions = { lean: true }
) {
  return User.findOneAndUpdate(query, update, options);
}


//masaya yeni sipariş ekler.
export async function createNewOrder(input: DocumentDefinition<OrdersDocument>, tableId: string, order_type: number) {
  return Table.updateOne({ _id: tableId }, {
    '$set': {
      orders: input,
      paid_orders: [],
      payments: [],
      busy: true,
      order_type
    }
  })
}
//masadaki siparişlerde değişiklik yapar.
export async function updateOrder(input: DocumentDefinition<OrdersDocument>, tableId: string) {
  return Table.updateOne({ _id: tableId }, {
    '$set': {
      orders: input
    }
  })
}