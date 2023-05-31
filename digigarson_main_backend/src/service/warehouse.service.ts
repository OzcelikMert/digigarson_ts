import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import Warehouse, { WarehouseDocument } from "../model/warehouse.model";



//analizdeki depoları ekler.
export function createWarehouse(input: DocumentDefinition<WarehouseDocument>) {
  try {
    return Warehouse.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}


//analizdeki depoları bulur.
export function findWarehouses(
  query: FilterQuery<WarehouseDocument>,
  projection: {} = {},
  options: QueryOptions = { lean: true }
) {
  return Warehouse.find(query, projection , options);
}
//analizdeki depoyu bulur.
export function findWarehouse(
  query: FilterQuery<WarehouseDocument>,
  options: QueryOptions = { lean: true }
) {
  return Warehouse.findOne(query, {}, options);
}

//bulur ve değişiklik yapar.
export function findAndUpdate(
  query: FilterQuery<WarehouseDocument>,
  update: UpdateQuery<WarehouseDocument>,
) {
  return Warehouse.findOneAndUpdate(query, update, {
    new: true,
    runValidators: true,
  });
}

//analizdeki depoyu siler.
export function deleteWarehouse(query: FilterQuery<WarehouseDocument>) {
  return Warehouse.deleteOne(query);
}

//analizdeki depoları sayar.
export function countWarehouse(query: FilterQuery<WarehouseDocument>) {
  return Warehouse.countDocuments(query);
}

