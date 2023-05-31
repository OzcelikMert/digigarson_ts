import mongoose from "mongoose";
import { BranchDocument } from "./";

interface SemiIngredientDetail {
  product:string;
  quantity:number;
  quantity_type:number;
  amount:number;
}

interface SemiIngredientDocument extends mongoose.Document {
  branch: BranchDocument["_id"]
  title: string;
  detail: SemiIngredientDetail[];
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
const SemiIngredientModel = mongoose.model<SemiIngredientDocument>("SemiIngredient", SemiIngredientSchema);

export {
    SemiIngredientModel,
    SemiIngredientDocument,
    SemiIngredientDetail
};
