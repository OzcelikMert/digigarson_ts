import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
} from "mongoose";

import District, { DistrictDocument } from "../model/district.model";

///semt oluşturur.
export function createDistrict(input: DocumentDefinition<DistrictDocument>) {
  try {
    return District.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}

//semtleri bulur.
export function findDistricts(
  query: FilterQuery<DistrictDocument>,
  options: QueryOptions = { lean: true }
) {
  return District.find(query,{__v:0},options);
}

//semt siler.
export function deleteDistrict(query: FilterQuery<DistrictDocument>) {
  return District.deleteOne(query);
}
//semt sayar.
export function countDistrict(query: FilterQuery<DistrictDocument>) {
  return District.countDocuments(query);
}