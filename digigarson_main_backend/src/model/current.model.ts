import { truncate } from "lodash";
import mongoose from "mongoose";
import { number, string } from "yup";
import { BranchDocument } from "./branch.model";


// Cari bölümünü oluşturmak için gereken bilgilerin girilmesi için model oluşturduk.
export interface CurrentDocument extends mongoose.Document {
  branch: BranchDocument["_id"]
  invoice_code: string;
  invoice_no: number;
  stock_code: string;
  product_information:string;
  title: string;
  outgoingprice:number;
  incomingprice:number;
  description: string;
  

}

const  CurrentSchema = new mongoose.Schema(
  {
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    invoice_code: { type:String, required:true },
    product_information: { type:String, required:true },
    invoice_no: { type: Number, required: true },
    stock_code: { type:String, required:true },
    title: { type: String, required:true },
    description: { type: String, required: true },
    outgoingprice:{ type: Number, required: true },
    incomingprice:{ type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Current = mongoose.model<CurrentDocument>("Current", CurrentSchema);

export default Current;
