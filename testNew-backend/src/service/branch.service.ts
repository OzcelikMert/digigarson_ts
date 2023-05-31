import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import { get } from "lodash";
import {
  BranchModel as Branch,
  UserModel as User,
  BranchPaymentsModel as BranchPayments,
  BranchDocument,
  UserDocument,
  BranchPaymentsDocument
} from "../model";

let roles = {
  "accounting": [600],
  "pos": [500],
  "kitchen": [700],
  "waiter": [400]
}

//yeni branch ekler.
export function createBranch(input: DocumentDefinition<BranchDocument>) {
  return Branch.create(input);
}

//bir tane branch ı bulur.
export function findOneBranch(
  query: FilterQuery<BranchDocument>,
  projection = {},
  options: QueryOptions = { lean: true }
) {
  return Branch.findOne(query, projection, options);
}

//branch ı bulur.
export function findBranch(
  query: FilterQuery<BranchDocument>,
  projection: {} = { crew: 0, createdAt: 0, updatedAt: 0, __v: 0 },
  options: QueryOptions = { lean: true }
) {
  return Branch.find(query, projection, options);
}

// bbul ve değiştir.
export function findAndUpdate(
  query: FilterQuery<BranchDocument>,
  update: UpdateQuery<BranchDocument>,
  options: QueryOptions
) {
  return Branch.findOneAndUpdate(query, update, options);
}


//branch ı sil
export function deleteBranch(query: FilterQuery<BranchDocument>) {
  return Branch.deleteOne(query);
}


//branch çalışanlarını getirir.
export async function getBranchEmplooyes(
  query: FilterQuery<BranchDocument>,
  options: QueryOptions = { lean: true }
) {
  let branch: any = await Branch.findOne(query, { crew: 1 }, options);
  return branch.crew.filter((user: { role: string; }) => user.role != "Manager" && user.role != "Supermanager")

}


// ekip üyelerini oluşturur.
export async function createCrewMember(input: DocumentDefinition<UserDocument>, role: string) {
  try {
    let user = await User.create({ ...input, permissions: get(roles, role) });
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}
//branch i sayar.
export function countBranch(query: FilterQuery<BranchDocument>) {
  return Branch.countDocuments(query);
}

//ödeme yapılacak branchleri oluşturur.
export function createBranchPayment(input: DocumentDefinition<BranchDocument>) {
  return BranchPayments.create(input)
}

//ödeme yapılacak branchleri bulur.
export function findBranchPayment(
  query: FilterQuery<BranchPaymentsDocument>,
  projection = {},
  options: QueryOptions = { lean: true }
) {
  return BranchPayments.findOne(query, projection, options);
}

//ödeme yapılacak branch ekler.
export function addBranchPayment(input: DocumentDefinition<BranchPaymentsDocument>, branchId: string) {
  return BranchPayments.findOneAndUpdate({ branch: branchId }, {
    '$push': {
      payment: input
    }
  }, {
    new: true
  })
}


export async function createCustomId() {
  const max_custom_id: any = await Branch.find().sort({ custom_id: -1 }).limit(1)
  if (max_custom_id.length === 0) return 100000
  return max_custom_id[0].custom_id + 2
}


export async function editWorking(branchId: string, input: Object) {
  return Branch.findOneAndUpdate({ _id: branchId }, {
    "$set": {
      working_hours: input
    }
  }, {
    new: true
  })
}


export async function editPaymentTypes(branchId: string, input: Object) {
  return Branch.findOneAndUpdate({ _id: branchId }, {
    "$push": {
      working_hours: input
    }
  }, {
    new: true
  })
}


export async function editMinimumOrderRequirement(branchId: string, input: object) {
  return Branch.findByIdAndUpdate({ _id: branchId }, {
    "$set": {
      min_order_requirements: input
    }
  })
}


export async function addServices(branchId: string, input: object) {
  return Branch.findOneAndUpdate({ _id: branchId }, {
    "$push": {
      user_services: input
    }
  }, {
    new: true
  })
}

export async function addSubBranch(branchId: string, input: any) {
  return Branch.findOneAndUpdate({ _id: branchId }, {
    "$push": {
      subBranch: input
    }
  })
}

export async function updatedFind(branchId: string, input: any) {
  return Branch.findByIdAndUpdate({ _id: branchId }, {
    "$set": {
      ...input
    }
  }, {
    new: true
  })
}

export async function getirSetToken(branchId: string, input: any){
 return Branch.findOneAndUpdate({_id : branchId}, {
    "$set": {
      "getir.$.token": input
      }
  })
}

export async function getirSetData(branchId: string, input: any){
 return Branch.findOneAndUpdate({_id : branchId}, {
    "$set": {
      "getir": input
      }
  })
}

export async function updateServices(serviceId: string, input: object) {
  return Branch.findOneAndUpdate({ "user_services._id": serviceId }, {
    "$set": {
      user_services: input
    }
  }, {
    new: true
  })
}