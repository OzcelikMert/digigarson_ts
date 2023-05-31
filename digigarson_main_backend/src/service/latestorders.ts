import {
    FilterQuery
  
  } from "mongoose";
  
  import Case, { CaseDocument } from "../model/case.model";

  
  //Get Latest Orders.
  export async function getLatestOrders(input: FilterQuery<CaseDocument>) {
    return Case.aggregate([
      { $match: input },
      { "$project": { "_id": 1, "createdAt": 1, "updatedAt": 1 } }])
  }