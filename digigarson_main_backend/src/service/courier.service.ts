import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import Courier, { CourierDocument } from "../model/courier.model";




//kurye ekler.
export function createCourier(input: DocumentDefinition<CourierDocument>) {
  try {
    return Courier.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}


//kuryeleri bulur.
export function findCouriers(
  query: FilterQuery<CourierDocument>,
  projection: {} = {},
  options: QueryOptions = { lean: true }
) {
  return Courier.find(query, projection , options);
}
//kurye bulur.
export function findCourier(
  query: FilterQuery<CourierDocument>,
  options: QueryOptions = { lean: true }
) {
  return Courier.findOne(query, {}, options);
}

//bulur ve değişiklik yapar.
export function findAndUpdate(
  query: FilterQuery<CourierDocument>,
  update: UpdateQuery<CourierDocument>,
) {
  return Courier.findOneAndUpdate(query, update, {
    new: true,
    runValidators: true,
  });
}

//kuryeleri siler.
export function deleteCourier(query: FilterQuery<CourierDocument>) {
  return Courier.deleteOne(query);
}

//kuryeleri sayar.
export function countCourier(query: FilterQuery<CourierDocument>) {
  return Courier.countDocuments(query);
}

