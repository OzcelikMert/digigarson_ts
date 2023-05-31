import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";

import {CategoryModel as Category, CategoryDocument } from "../model";

//kategori ekler.
export function createCategory(input: DocumentDefinition<CategoryDocument>) {
  try {
    return Category.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}

//kategoriyi bulur.
export function findCategory(
  query: FilterQuery<CategoryDocument>,
  options: QueryOptions = { lean: true }
) {
  return Category.findOne(query, {}, options);
}

//kategorileri bulur.
export function findCategories(
  query: FilterQuery<CategoryDocument>,
  projection: {} = {},
  options: QueryOptions = { lean: true }
) {
  return Category.find(query, projection , options);
}

//bulur ve değişiklik yapar.
export function findAndUpdate(
  query: FilterQuery<CategoryDocument>,
  update: UpdateQuery<CategoryDocument>,
) {
  return Category.findOneAndUpdate(query, update, {
    new: true,
    runValidators: true,
  });
}

//kategoriyi siler.
export function deleteCategory(query: FilterQuery<CategoryDocument>) {
  return Category.deleteOne(query);
}

//kategoriyi sayar.
export function countCategory(query: FilterQuery<CategoryDocument>) {
  return Category.countDocuments(query);
}

