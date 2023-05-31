import mongoose from "mongoose";
import { BranchDocument } from "./";


// Kurye bölümünü oluşturmak için gereken bilgilerin girilmesi için model oluşturduk.
interface CourierDocument extends mongoose.Document {
  branch: BranchDocument["_id"]
  title:string;
  number:number;  

}

const  CourierSchema = new mongoose.Schema(
  {
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    title: { type: String, required:true },
    number:{ type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const CourierModel = mongoose.model<CourierDocument>("Courier", CourierSchema);

export {
    CourierModel,
    CourierDocument
};