import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
} from "mongoose";

import City, { CityDocument } from "../model/city.model";


//şehir oluşturur.
export function createCity(input: DocumentDefinition<CityDocument>) {
  try {
    return City.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}

//şehirleri bulur.
export function findCitys(
  query: FilterQuery<CityDocument>,
  options: QueryOptions = { lean: true }
) {
  return City.find(query,{__v:0},options);
}

//şehir siler.
export function deleteCity(query: FilterQuery<CityDocument>) {
  return City.deleteOne(query);
}

//şehir bulur.
export function countCity(query: FilterQuery<CityDocument>) {
  return City.countDocuments(query);
}