import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import {
  IngredientModel as Ingredient,
  IngredientDocument
} from "../model";

//içeirk ekler.
export function createIngredient(input: DocumentDefinition<IngredientDocument>) {
  try {
    return Ingredient.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}

//içerikleri bulur.
export function findIngredients(
  query: FilterQuery<IngredientDocument>,
  projection: {} = {},
  options: QueryOptions = { lean: true }
) {
  return Ingredient.find(query, projection , options);
}
//içeriği bulur.
export function findIngredient(
  query: FilterQuery<IngredientDocument>,
  options: QueryOptions = { lean: true }
) {
  return Ingredient.findOne(query, {}, options);
}

//bulur ve değişiklik yapar.
export function findAndUpdate(
  query: FilterQuery<IngredientDocument>,
  update: UpdateQuery<IngredientDocument>,
) {
  return Ingredient.findOneAndUpdate(query, update, {
    new: true,
    runValidators: true,
  });
}

//içeriği siler.
export function deleteIngredient(query: FilterQuery<IngredientDocument>) {
  return Ingredient.deleteOne(query);
}

//içeriği sayar.
export function countIngredient(query: FilterQuery<IngredientDocument>) {
  return Ingredient.countDocuments(query);
}

