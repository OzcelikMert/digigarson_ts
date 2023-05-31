import mongoose from "mongoose";
import { StringifyOptions } from "querystring";
import { number, string } from "yup/lib/locale";
import { BranchDocument } from "./branch.model";



// Depo bölümünü oluşturmak için gereken bilgilerin girilmesi için model oluşturduk.
export interface WarehouseDocument extends mongoose.Document {
  branch: BranchDocument["_id"]
  title: string;
  user: string;
}

const  WarehouseSchema = new mongoose.Schema(
  {
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    title: { type: String, required:true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  
  },
  { timestamps: true }
);

const Warehouse = mongoose.model<WarehouseDocument>("Warehouse", WarehouseSchema);

export default Warehouse;

