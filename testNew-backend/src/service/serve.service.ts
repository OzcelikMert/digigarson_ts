import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import {ServeModel as Serve, ServeDocument} from "../model/serve.model";



//ikram ekler.
export function createServe(input: DocumentDefinition<ServeDocument>) {
  try {
    return Serve.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}

//ikramleri bulur.
export function findServes(
  query: FilterQuery<ServeDocument>,
  projection: {} = {},
  options: QueryOptions = { lean: true }
) {
  return Serve.find(query, projection , options);
}
//ikramı bulur.
export function findServe(
  query: FilterQuery<ServeDocument>,
  options: QueryOptions = { lean: true }
) {
  return Serve.findOne(query, {}, options);
}

//bulur ve değişiklik yapar.
export function findAndUpdate(
  query: FilterQuery<ServeDocument>,
  update: UpdateQuery<ServeDocument>,
) {
  return Serve.findOneAndUpdate(query, update, {
    new: true,
    runValidators: true,
  });
}

//ikramı siler.
export function deleteServe(query: FilterQuery<ServeDocument>) {
  return Serve.deleteOne(query);
}

//ikramı sayar.
export function countServe(query: FilterQuery<ServeDocument>) {
  return Serve.countDocuments(query);
}

