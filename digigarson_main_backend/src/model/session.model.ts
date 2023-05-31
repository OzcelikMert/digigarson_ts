import mongoose from "mongoose";
import { UserDocument } from "./user.model";
import { BranchCrewUserDocument } from "./branchcrewuser.model";

export interface SessionDocument extends mongoose.Document {
  user: UserDocument["_id"] | BranchCrewUserDocument["_id"];
  valid: boolean;
  userAgent: string;
  scope: string;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" || "BranchCrew" },
    valid: { type: Boolean, default: true },
    scope: { type: String, enum: ["superadmin", "manager", "branchcrew", "user"], required: true },
    userAgent: { type: String },
  },
  { timestamps: true }
);

//oturum açmak için gereken ortamı modeller.
const Session = mongoose.model<SessionDocument>("Session", SessionSchema);

export default Session;
