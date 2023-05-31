import mongoose from "mongoose";
import { BranchDocument } from "./branch.model";

export interface IAdress {
  title:string;
  address: string;
  id: string;
}


export interface BranchCustomerDocument extends mongoose.Document {
  branch: BranchDocument["_id"]
  title: string;
  address: IAdress[];
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
    address: { type: Array, required: true },
    gsm_no: { type: Number },
    currency: { type: String, enum: ["TL", "USD", "EUR"], required: true,default:"TL" },
    description: { type: String, required: true },
    credit_amount: { type: Number, min: 0.00, required: true },
  },
  { timestamps: true }
);
// müşteriler bölümüm oluşturmak için gereken bilgilerin girilmesi için model oluşturduk.
const BranchCustomer = mongoose.model<BranchCustomerDocument>("BranchCustomer", BranchCustomerSchema);

export default BranchCustomer;
