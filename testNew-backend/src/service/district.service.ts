import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
} from "mongoose";

import {DistrictModel, DistrictDocument } from "../model/";

///semt oluşturur.
export function createDistrict(input: DocumentDefinition<DistrictDocument>) {
  try {
    return DistrictModel.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}

//semtleri bulur.
export function findDistricts(
  query: FilterQuery<DistrictDocument>,
  options: QueryOptions = { lean: true }
) {
  return DistrictModel.find(query,{__v:0},options);
}

//semt siler.
export function deleteDistrict(query: FilterQuery<DistrictDocument>) {
  return DistrictModel.deleteOne(query);
}
//semt sayar.
export function countDistrict(query: FilterQuery<DistrictDocument>) {
  return DistrictModel.countDocuments(query);
}