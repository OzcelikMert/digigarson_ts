import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import {
  SemiIngredientModel as SemiIngredient,
  SemiIngredientDocument as SemiIngredientDocument,
  SemiIngredientDetail}
from "../model/";



//içeirk ekler.
export function createSemiIngredient(input: DocumentDefinition<SemiIngredientDocument>) {
  try {
    return SemiIngredient.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}

//içerikleri bulur.
export function findSemiIngredients(
  query: FilterQuery<SemiIngredientDocument>,
  projection: {} = {},
  options: QueryOptions = { lean: true }
) {
  return SemiIngredient.find(query, projection , options);
}
//içeriği bulur.
export function findSemiIngredient(
  query: FilterQuery<SemiIngredientDocument>,
  options: QueryOptions = { lean: true }
) {
  return SemiIngredient.findOne(query, {}, options);
}

//bulur ve değişiklik yapar.
export function findAndUpdate(
  query: FilterQuery<SemiIngredientDocument>,
  update: UpdateQuery<SemiIngredientDocument>,
) {
  return SemiIngredient.findOneAndUpdate(query, update, {
    new: true,
    runValidators: true,
  });
}

//içeriği siler.
export function deleteSemiIngredient(query: FilterQuery<SemiIngredientDocument>) {
  return SemiIngredient.deleteOne(query);
}

//içeriği sayar.
export function countSemiIngredient(query: FilterQuery<SemiIngredientDocument>) {
  return SemiIngredient.countDocuments(query);
}

