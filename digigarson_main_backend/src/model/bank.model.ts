import mongoose from "mongoose";
import { BranchDocument } from "./branch.model";
import { UserDocument } from "./user.model";


export interface balance {
  type: number,
  amount: number;
  currency: number;
}


export interface BankDocument extends mongoose.Document {
  branch: BranchDocument["_id"];
  user: UserDocument["_id"];
  account_name: string;
  bank_name:string;
  bank_branch:string;
  account_number:number;
  iban_no:string;
  balance: balance[];


}

const BankSchema = new mongoose.Schema(
  {
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    account_name: { type: String, required:true },
    bank_name:{ type: String, required:true },
    bank_branch:{ type: String, required:true },
    account_number:{ type: Number, required:true },
    iban_no: { type:String, required:true },
    balance: { type: Array, required: true }
  },
  { timestamps: true }
);
//banka içiçn gereken modeli oluşturarak bilgilerin girileceği ortamı oluşturur.
const Bank = mongoose.model<BankDocument>("Bank", BankSchema);

export default Bank;
