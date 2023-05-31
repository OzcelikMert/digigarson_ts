import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import {WareHouseModel,  WareHouseDocument } from "../model/";



//analizdeki depoları ekler.
export function createWarehouse(input: DocumentDefinition< WareHouseDocument>) {
  try {
    return WareHouseModel.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}


//analizdeki depoları bulur.
export function findWarehouses(
  query: FilterQuery< WareHouseDocument>,
  projection: {} = {},
  options: QueryOptions = { lean: true }
) {
  return WareHouseModel.find(query, projection , options);
}
//analizdeki depoyu bulur.
export function findWarehouse(
  query: FilterQuery< WareHouseDocument>,
  options: QueryOptions = { lean: true }
) {
  return WareHouseModel.findOne(query, {}, options);
}

//bulur ve değişiklik yapar.
export function findAndUpdate(
  query: FilterQuery< WareHouseDocument>,
  update: UpdateQuery< WareHouseDocument>,
) {
  return WareHouseModel.findOneAndUpdate(query, update, {
    new: true,
    runValidators: true,
  });
}

//analizdeki depoyu siler.
export function deleteWarehouse(query: FilterQuery< WareHouseDocument>) {
  return WareHouseModel.deleteOne(query);
}

//analizdeki depoları sayar.
export function countWarehouse(query: FilterQuery< WareHouseDocument>) {
  return WareHouseModel.countDocuments(query);
}

