import mongoose from "mongoose";
import { BranchDocument } from "./";

interface UserDiscountDocument{
    discountAmount: number;
    branch: BranchDocument["_id"];
    key: string;
    isActive: boolean;
    expirationDate: Date;
    type: number;
}

const DiscountSchema = new mongoose.Schema(
    {
        branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
        discountAmount: { type: Number, required:true },
        key: {type: String, required:true},
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        isActive: {type: Boolean, default: true},
        expirationDate: {type: Date, default: true},
        type: {type: Number, default: true}

    },{timestamps: true}
)
const UserDiscountModel = mongoose.model<Document>("userDiscount", DiscountSchema)

export {
    UserDiscountModel,
    UserDiscountDocument
};