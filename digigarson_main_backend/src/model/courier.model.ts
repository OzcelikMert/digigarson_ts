import { truncate } from "lodash";
import mongoose from "mongoose";
import { number, string } from "yup";
import { BranchDocument } from "./branch.model";


// Kurye bölümünü oluşturmak için gereken bilgilerin girilmesi için model oluşturduk.
export interface CourierDocument extends mongoose.Document {
  branch: BranchDocument["_id"]
  title:string;
  number:string;

}

const  CourierSchema = new mongoose.Schema(
  {
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    title: { type: String, required:true },
    number:{ type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Courier = mongoose.model<CourierDocument>("Courier", CourierSchema);

export default Courier;