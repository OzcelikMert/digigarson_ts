import mongoose from "mongoose";
import { BranchDocument } from "./";

interface BranchCustomerIAddress {
  title:string;
  adress: string;
  id: string;
}


interface BranchCustomerDocument extends mongoose.Document {
  branch: BranchDocument["_id"]
  title: string;
  address: BranchCustomerIAddress[];
  gsm_no: number;
  currency: string;
  description: string;
  credit_amount: number;
}

const BranchCustomerSchema = new mongoose.Schema(
  {
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    branchName: {type: String, required:true,},
    title: { type: String, required: true },
    address: { type: Array, required: true, default: [] },
    gsm_no: { type: Number },
    currency: { type: String, enum: ["TL", "USD", "EUR"], required: true,default:"TL" },
    description: { type: String, required: true },
    credit_amount: { type: Number, min: 0.00, required: true },
  },
  { timestamps: true }
);
// müşteriler bölümüm oluşturmak için gereken bilgilerin girilmesi için model oluşturduk.
const BranchCustomerModel = mongoose.model<BranchCustomerDocument>("BranchCustomer", BranchCustomerSchema);

export {
    BranchCustomerModel,
    BranchCustomerDocument,
    BranchCustomerIAddress
};
