import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
} from "mongoose";

import {CountryModel as Country, CountryDocument } from "../model";

//ülke oluşturur.
export function createCountry(input: DocumentDefinition<CountryDocument>) {
  try {
    return Country.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}

//ülkeleri bulur.
export function findCountrys(
  query: FilterQuery<CountryDocument>,
  options: QueryOptions = { lean: true }
) {
  return Country.find(query,{__v:0},options);
}

//ülke siler
export function deleteCountry(query: FilterQuery<CountryDocument>) {
  return Country.deleteOne(query);
}

//ülke sayar.
export function countCountry(query: FilterQuery<CountryDocument>) {
  return Country.countDocuments(query);
}