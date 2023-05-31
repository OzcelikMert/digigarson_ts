import mongoose from "mongoose";
import { BranchDocument } from "./";

// Depo bölümünü oluşturmak için gereken bilgilerin girilmesi için model oluşturduk.
interface WareHouseDocument extends mongoose.Document {
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

const WareHouseModel = mongoose.model<Document>("Warehouse", WarehouseSchema);


export {WareHouseModel, WareHouseDocument};

