import mongoose from "mongoose";
import { stringify } from "querystring";
import { string } from "yup";
import { BranchDocument } from "./branch.model";
import Check from "./check.model";
import { UserDocument } from "./user.model";

interface Discount {
  price: number;
}
export interface BranchTicksDocument extends mongoose.Document {
  branch: BranchDocument["_id"];
  userId: UserDocument["_id"];
  discount?: Discount,
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
const BranchTicks = mongoose.model<BranchTicksDocument>("branchTick", BranchTicksSchema);

export default BranchTicks;
