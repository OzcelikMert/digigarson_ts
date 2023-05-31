import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";

import {SectionModel as Section, SectionDocument } from "../model/";

//seçenek oluşturur.
export function createSection(input: DocumentDefinition<SectionDocument>) {
  try {
    return Section.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}

//seçenek bulur.
export function findSection(
  query: FilterQuery<SectionDocument>,
  options: QueryOptions = { lean: true }
) {
  return Section.findOne(query, {}, options);
}

//seçenekleri bulur.
export function findSections(
  query: FilterQuery<SectionDocument>,
  projection = {},
  options: QueryOptions = { lean: true }
) {
  return Section.find(query, projection, options);
}

//sçenekleri bulur ve değişiklik yapar.
export function findAndUpdate(
  query: FilterQuery<SectionDocument>,
  update: UpdateQuery<SectionDocument>,
) {
  return Section.findOneAndUpdate(query, update, {
    new: true,
    runValidators: true,
  });
}
//seçeneği siler.
export function deleteSection(query: FilterQuery<SectionDocument>) {
  return Section.deleteOne(query);
}

//seçenek sayar.
export function countSection(query: FilterQuery<SectionDocument>) {
  return Section.countDocuments(query);
}
