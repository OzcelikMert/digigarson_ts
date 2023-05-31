import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { omit } from "lodash";
import User, { UserDocument } from "../model/user.model";
import AdminUser, { AdminUserDocument } from "../model/adminuser.model";
import BranchCrewUser, { BranchCrewUserDocument } from "../model/branchcrewuser.model";
import BranchManageUser, { BranchManageDocument } from "../model/branchmanageuser.model";
import bcrypt from "bcrypt";
import config from "config";

// (async () => {
//   try {
//     AdminUser.create({
//       name:"Super",
//       lastname:"Admin",
//       email:"admin@digigarson.com",
//       password:"123456",
//       permissions:[0],
//       role:"superadmin"
//     })
//   } catch (e) {
//     console.log(e)

//   }
// })();
// (async () => {
//   try {

//   } catch (e) {
//     console.log(e)

//   }
// })();


//bir tane kullanıcı bulur.
export async function findOneUser(query: FilterQuery<UserDocument>) {
  return User.findOne(query, { password: 0, __v: 0, updatedAt: 0 }).lean();
}
//Admin resource icerisinde bir tane kullanıcı bulur.
export async function findOneAdminUser(query: FilterQuery<AdminUserDocument>) {
  return AdminUser.findOne(query, { password: 0, __v: 0, updatedAt: 0 }).lean();
}

//Manage resource icerisinde bir tane kullanıcı bulur.
export async function findOneManageUser(query: FilterQuery<BranchManageDocument>) {
  return BranchManageUser.findOne(query, { password: 0, __v: 0, updatedAt: 0 }).lean();
}

//Crew resource icerisinde bir tane kullanıcı bulur.
export async function findOneBranchCrewUser(query: FilterQuery<BranchCrewUserDocument>) {
  return BranchCrewUser.findOne(query, { __v: 0, updatedAt: 0 }).lean();
}

//kullanıcıyı bulur.
export async function findUser(query: FilterQuery<UserDocument>, options: QueryOptions = { lean: true }) {
  return User.find(query, { password: 0, __v: 0, updatedAt: 0 }, options);
}

//Branch managers bulur.
export async function findBranchManagers(query: FilterQuery<BranchManageDocument>, options: QueryOptions = { lean: true }) {
  return BranchManageUser.find(query, { password: 0, __v: 0, updatedAt: 0 }, options);
}

//Admin Users bulur.
export async function findAdminUsers(query: FilterQuery<AdminUserDocument>, options: QueryOptions = { lean: true }) {
  return AdminUser.find(query, { password: 0, __v: 0, updatedAt: 0 }, options);
}

//Branch Crew Users bulur.
export async function findBranchCrewUsers(query: FilterQuery<BranchCrewUserDocument>, options: QueryOptions = { lean: true }) {
  console.log(query)
  return BranchCrewUser.find(query, { __v: 0, updatedAt: 0 }, options);
}



//kullanıcı bilgilerini değiştirir.
export async function updateUser(input: DocumentDefinition<UserDocument>, userId: string) {
  return User.findOneAndUpdate({ _id: userId }, {
    "$push": {
      permissions: input
    }
  }, {
    new: true
  })
}

//kullanıcı şifresini günceller.
export async function updateUserPassword(newPassword: string, userId: string) {
  const salt = await bcrypt.genSalt(config.get("saltWorkFactor"));
  const hash = await bcrypt.hashSync(newPassword, salt);

  // Replace the password with the hash
  newPassword = hash;
  return User.findOneAndUpdate({ _id: userId }, {
    "$set": {
      password: newPassword
    }
  }, {
    new: true
  })
}
//şifre sorgusu yapar.
export async function validatePassword({
  email,
  password,
}: {
  email: UserDocument["email"];
  password: string;
}) {
  const user = await User.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    return false;
  }

  return omit(user.toJSON(), "password");
}

export async function validateAdminPassword({
  email,
  gsm_no,
  password,
}: {
  email: AdminUserDocument["email"];
  gsm_no: AdminUserDocument["gsm_no"];
  password: string;
}) {
  let user;
  if (email) {
    user = await AdminUser.findOne({ email });
  } else if (gsm_no) {
    user = await AdminUser.findOne({ gsm_no });
  }
  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    return false;
  }

  return omit(user.toJSON(), "password");
}

export async function validateManagePassword({
  email,
  gsm_no,
  password,
}: {
  email: BranchManageDocument["email"];
  gsm_no: BranchManageDocument["gsm_no"];
  password: string;
}) {
  let user;
  if (email) {
    user = await BranchManageUser.findOne({ email });
  } else if (gsm_no) {
    user = await BranchManageUser.findOne({ gsm_no });
  }

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    return false;
  }

  return omit(user.toJSON(), "password");
}


export async function validateBranchCrewPassword({
  password,
  branch_custom_id
}: {
  password: string;
  branch_custom_id: number;
}) {
  const user = await BranchCrewUser.findOne({ branch_custom_id: Number(branch_custom_id), password });
  if (!user) {
    return false;
  }
  return omit(user.toJSON(), "password");
}


//bulunduğu alana ait yeni müdür oluşturur.
export async function createRegionalManager(input: DocumentDefinition<AdminUserDocument>) {
  try {
    let regionamanager = await AdminUser.create(input);
    return regionamanager;
  } catch (error: any) {
    throw new Error(error);
  }
}

//yeni branch manager oluşturur.
export async function createBranchManager(input: DocumentDefinition<BranchManageDocument>) {
  try {
    let user = await BranchManageUser.create(input);
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}

// create Crew Member
// Branch çalışanı oluşturur (Pos,waiter,kitchen,delivery)
export async function createCrewMember(input: DocumentDefinition<BranchCrewUserDocument>) {
  try {
    let user = await BranchCrewUser.create(input);
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}

// create User, register from app
// Müşteri kayıt olur.
export async function createUser(input: DocumentDefinition<UserDocument>) {
  try {
    let user = await User.create(input);
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}

//kullanıcıları sayar.
export function countUser(query: FilterQuery<UserDocument>) {
  return User.countDocuments(query);
}

//kullanıcıları sayar.
export function countBranchManagers(query: FilterQuery<BranchManageDocument>) {
  return BranchManageUser.countDocuments(query);
}

//kullanıcıları sayar.
export function countAdminUsers(query: FilterQuery<AdminUserDocument>) {
  return AdminUser.countDocuments(query);
}


//kullanıcıları sayar.
export function countBranchCrewUsers(query: FilterQuery<BranchCrewUserDocument>) {
  return BranchCrewUser.countDocuments(query);
}

// Set crew member permissions.
export function setCrewMemberPermissions(branchCrewUserId: string, permissions: number[]) {
  return BranchCrewUser.findOneAndUpdate({ _id: branchCrewUserId }, { '$set': { permissions: permissions } })

}
//bulur ve değişiklik yapar.
export function crewMemberfindAndUpdate(
  query: FilterQuery<BranchCrewUserDocument>,
  update: UpdateQuery<BranchCrewUserDocument>,
) {
  return BranchCrewUser.findOneAndUpdate(query, update, {
    new: true,
    runValidators: true,
  });
}


//crew member siler.
export function deleteCrewMember(query: FilterQuery<BranchCrewUserDocument>) {
  return BranchCrewUser.deleteOne(query);
}
