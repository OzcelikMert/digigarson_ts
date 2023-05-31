import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
import { BranchDocument } from "./branch.model";

export interface BranchCrewUserDocument extends mongoose.Document {

    name: string;
    lastname: string;
    password: string;
    branch_custom_id: number;
    role: string;
    permissions: Array<number>;
    branchId: BranchDocument["_id"];
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}



const BranchCrewUserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        lastname: { type: String, required: true },
        password: { type: String, required: true },
        branch_custom_id: { type: Number },
        role: { type: String, enum: ["waiter", "pos", "kitchen", "delivery"], required: true },
        permissions: { type: Array, required: true },
        branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" }
    },
    { timestamps: true }
);



// Used for logging in
BranchCrewUserSchema.methods.comparePassword = async function (
    candidatePassword: string
) {
    const branchCrew = this as BranchCrewUserDocument;

    return bcrypt.compare(candidatePassword, branchCrew.password).catch((e) => false);
};
BranchCrewUserSchema.index({ branch_custom_id: 1, password: 1}, { unique: true });



//kullancıcı girişi yapmak için model oluşturuyoruz.
const BranchCrewUser = mongoose.model<BranchCrewUserDocument>("branchcrewuser", BranchCrewUserSchema);

export default BranchCrewUser;
