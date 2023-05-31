import mongoose from "mongoose";
import { BranchDocument, UserDocument, TableDocument } from "./";

interface ServiceDocument extends mongoose.Document {
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

const ServiceModel = mongoose.model<ServiceDocument>("services", serviceSchema);

export {
    ServiceDocument,
    ServiceModel
};