import mongoose, { ObjectId } from "mongoose";
import { BranchDocument } from "./branch.model";
import { UserDocument } from "./user.model";
import {TableDocument} from "./table.model";


export interface ServiceDocument extends mongoose.Document {
    branch: BranchDocument["_id"];
    user: UserDocument["_id"];
    serviceId: string;
    tableId: TableDocument["_id"];
  }


const serviceSchema = new mongoose.Schema({
branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
user: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true},
serviceId: {type: mongoose.Schema.Types.ObjectId, require:true},
tableId: {type: mongoose.Schema.Types.ObjectId, require: true},
confirmedUser: {type: mongoose.Schema.Types.ObjectId, require: false},
isConfirm: {type: Boolean, default: false},
}, {timestamps: true})

const service = mongoose.model<ServiceDocument>("services", serviceSchema);

export default service;