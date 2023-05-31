import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
import uniqueValidator from 'mongoose-unique-validator'
import { BranchDocument } from "./branch.model";

export interface BranchManageDocument extends mongoose.Document {
    email: string;
    gsm_no: string;
    name: string;
    lastname: string;
    password: string;
    role: string;
    permissions: Array<number>;
    branchId: BranchDocument["_id"];
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}



const BranchManageSchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        gsm_no: { type: String },
        name: { type: String, required: true },
        lastname: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["superbranchmanager", "branchmanager", "branchaccounting"], required: true },
        permissions: { type: Array, required: true },
        branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" }
    },
    { timestamps: true }
);

BranchManageSchema.pre("save", async function (next: mongoose.HookNextFunction) {
    let branchmanage = this as BranchManageDocument;

    // only hash the password if it has been modified (or is new)
    if (!branchmanage.isModified("password")) return next();

    // Random additional data
    const salt = await bcrypt.genSalt(config.get("saltWorkFactor"));

    const hash = await bcrypt.hashSync(branchmanage.password, salt);

    // Replace the password with the hash
    branchmanage.password = hash;

    return next();
});

// Used for logging in
BranchManageSchema.methods.comparePassword = async function (
    candidatePassword: string
) {
    const branchManage = this as BranchManageDocument;

    return bcrypt.compare(candidatePassword, branchManage.password).catch((e) => false);
};

BranchManageSchema.plugin(uniqueValidator, { message: 'email already exists!' });
BranchManageSchema.index({ email: 1 }, {
    unique: true,
    partialFilterExpression: {
        'email': { $exists: true, $gt: '' }
    }
});

BranchManageSchema.index({ gsm_no: 1 }, {
    unique: true,
    partialFilterExpression: {
        'gsm_no': { $exists: true, $gt: '' }
    }
});


//kullancıcı girişi yapmak için model oluşturuyoruz.
const BranchManageUser = mongoose.model<BranchManageDocument>("branchManageUser", BranchManageSchema);

export default BranchManageUser;
