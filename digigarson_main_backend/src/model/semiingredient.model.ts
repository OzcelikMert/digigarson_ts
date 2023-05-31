import mongoose from "mongoose";
import { number, string } from "yup/lib/locale";
import { BranchDocument } from "./branch.model";
import {array} from "yup";

export interface detail {
  product:string;
  quantity:number;
  quantity_type:number;
  amount:number;
}

export interface SemiIngredientDocument extends mongoose.Document {
  branch: BranchDocument["_id"]
  title: string;
  detail: detail[];
}
const DetailSchema = new mongoose.Schema({
    product:{type:String,required:true},
    quantity: {type: Number,required:true},
    quantity_type:{type: Number,required:true},
    amount: {type: Number,required:true}
})
const SemiIngredientSchema = new mongoose.Schema(
  {
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    title: { type: String, required: true },
    detail: [DetailSchema],
  },
  {timestamps: true }
);
// İçindekiler bölümüm oluşturmak için gereken bilgilerin girilmesi için model oluşturduk.
const SemiIngredient = mongoose.model<SemiIngredientDocument>("SemiIngredient", SemiIngredientSchema);

export default SemiIngredient;
