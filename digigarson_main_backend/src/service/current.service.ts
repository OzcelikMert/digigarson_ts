import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import Current, { CurrentDocument } from "../model/current.model";



//cari ekler.
export function createCurrent(input: DocumentDefinition<CurrentDocument>) {
  try {
    return Current.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}


//carileri bulur.
export function findCurrents(
  query: FilterQuery<CurrentDocument>,
  projection: {} = {},
  options: QueryOptions = { lean: true }
) {
  return Current.find(query, projection , options);
}
//cari bulur.
export function findCurrent(
  query: FilterQuery<CurrentDocument>,
  options: QueryOptions = { lean: true }
) {
  return Current.findOne(query, {}, options);
}

//bulur ve değişiklik yapar.
export function findAndUpdate(
  query: FilterQuery<CurrentDocument>,
  update: UpdateQuery<CurrentDocument>,
) {
  return Current.findOneAndUpdate(query, update, {
    new: true,
    runValidators: true,
  });
}

//carileri siler.
export function deleteCurrent(query: FilterQuery<CurrentDocument>) {
  return Current.deleteOne(query);
}

//carileri sayar.
export function countCurrent(query: FilterQuery<CurrentDocument>) {
  return Current.countDocuments(query);
}

