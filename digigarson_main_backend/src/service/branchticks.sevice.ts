import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import Branch, { BranchDocument } from "../model/branch.model";
import { CheckDocument } from "../model/check.model";
import { get } from "lodash"
import BranchTicks, { BranchTicksDocument } from "../model/branchticks.model";

//Find Ticks

export function findTicks(
  query: FilterQuery<BranchTicksDocument>,
  options: QueryOptions = { lean: true }
) {
  return BranchTicks.find(query, {}, options)
}
//Find One ticks
export function findOneTick(
  query: FilterQuery<BranchTicksDocument>,
  options: QueryOptions = { lean: true }
) {
  return BranchTicks.findOne(query, {}, options)
}
//Create Ticks

export function createTick(input: DocumentDefinition<BranchTicksDocument>) {
  try {
    return BranchTicks.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}
export function addTicks(
  query: FilterQuery<BranchTicksDocument>,
  update: any,
  options: QueryOptions = { lean: true }
) {
  return BranchTicks.updateOne(query, { '$push': { ticks: update } })
}

export function ticksPay(
  branchId: any,
  branchTickId: any,
  tickId: any,
  value: Number,
) {
  return BranchTicks.updateOne(
    {_id: branchTickId},
    { 
    "$set": {[`ticks.$[outer].on_payment`]: value } 
    },
    { "arrayFilters": [{ "outer._id": tickId }]}
    ,)
}
export function setIsActive(
  branchId: any,
  branchTickId: any,
  tickId: any,
  value: Boolean,
) {
  return BranchTicks.updateOne(
    {_id: branchTickId},
    { 
    "$set": {[`ticks.$[outer].isActive`]: value } 
    },
    { "arrayFilters": [{ "outer._id": tickId }]}
    ,)
}

export function findTick
(
  branchId: any,
  branchTickId: any,
  tickId: any,
)
{
  BranchTicks.findOne
}