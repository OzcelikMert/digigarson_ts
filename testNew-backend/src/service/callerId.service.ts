import {
    DocumentDefinition,
    FilterQuery,
    UpdateQuery,
    QueryOptions,
  } from "mongoose";
  
import {
    CallerModel as Caller,
    CallerDocument
} from "../model";
  
  //kategori ekler.
export function createCaller(input: DocumentDefinition<CallerDocument>) {
    try {
      return Caller.create(input);
    } catch (error: any) {
      throw new Error(error);
    }
  }
  
  //kategoriyi bulur.
export function findOneCaller(
    query: FilterQuery<CallerDocument>,
    options: QueryOptions = { lean: true }
  ) {
    return Caller.findOne(query, {}, options);
  }
  
  //kategorileri bulur.
export function findCaller(
    query: FilterQuery<CallerDocument>,
    projection: {} = {},
    options: QueryOptions = { lean: true }
  ) {
    return Caller.find(query, projection , options);
  }
  
  //bulur ve değişiklik yapar.
export function findAndUpdate(
    query: FilterQuery<CallerDocument>,
    update: UpdateQuery<CallerDocument>,
  ) {
    return Caller.findOneAndUpdate(query, update, {
      new: true,
      runValidators: true,
    });
  }
  
  //kategoriyi siler.
export function deleteCaller(query: FilterQuery<CallerDocument>) {
    return Caller.deleteOne(query);
  }

  
  