import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,

} from "mongoose";

import Option, { OptionDocument } from "../model/option.model";

//opsiyon oluşturur.
export async function createOption(input: DocumentDefinition<OptionDocument>) {
  return Option.create(input);
}

//opsiyon bulur.
export function findOption(
  query: FilterQuery<OptionDocument>,
  projection = {},
  options: QueryOptions = { lean: true }
) {
  return Option.findOne(query, projection, options);
}

//seçeneğe bağlı opsiyonları bulur.
export function findOptionsBySection(
  query: FilterQuery<OptionDocument>,
  options: QueryOptions = { lean: true }
) {
  return Option.find(query, {}, options);
}

//opsiyonları bulur.
export function findOptions(
  query: FilterQuery<OptionDocument>,
  projection = {},
  options: QueryOptions = { lean: true }
) {
  return Option.find(query, { __v: 0,...projection }, options);
}

//bulur ve değişiklik yapar.
export async function findAndUpdate(
  query: FilterQuery<OptionDocument>,
  update: UpdateQuery<OptionDocument>
) {
  return Option.findOneAndUpdate(query, update, {
    new: true,
    runValidators: true,
  });
}
//opsiyonu siler.
export function deleteOption(query: FilterQuery<OptionDocument>) {
  return Option.deleteOne(query);
}

//çoklu opsiyon siler.
export function deleteManyOption(query: FilterQuery<OptionDocument>) {
  return Option.deleteMany(query);
}


//opsiyonları sayar.
export function countOptions(query: FilterQuery<OptionDocument>) {
  return Option.countDocuments(query);
}
