import mongoose from "mongoose";
import { BranchDocument, UserDocument } from "./";

interface BranchTicksDiscount {
  price: number;
}

interface BranchTicksDocument extends mongoose.Document {
  branch: BranchDocument["_id"];
  userId: UserDocument["_id"];
  discount?: BranchTicksDiscount,
  taxNum?: Number;
  taxAdmin?: string;
}

const TickOrderSchema = new mongoose.Schema(
  { 
    checkId: {type: String, required: false},
    debt: {type: Number, required: false, default: 0},
    on_payment:{type: Number, required: false, default: 0},
    isActive:{type: Boolean, default:true}
}, {timestamps: true});


const DiscountSchema = new mongoose.Schema(
    {
    price: {type: Number, default: 0},
    type: {type: Number, default: 0}
  },{timestamps: true});

const BranchTicksSchema = new mongoose.Schema(
  {
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    name:{type: String, required: true },
    phoneNum: {type: Number, required: true},
    taxNum: {type: Number},
    taxAdmin: {type: String},
    discount: [DiscountSchema],
    ticks: [TickOrderSchema],
  },{ timestamps: true });

// ödeme için gereken modeli oluşturur ve gereken bağlantıları sağlar.
const BranchTicksModel = mongoose.model<BranchTicksDocument>("branchTick", BranchTicksSchema);

export {
    BranchTicksModel,
    BranchTicksDocument,
    BranchTicksDiscount
};
