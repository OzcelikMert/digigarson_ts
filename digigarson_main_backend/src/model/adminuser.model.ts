import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";

import uniqueValidator from 'mongoose-unique-validator'

export interface AdminUserDocument extends mongoose.Document {
  email: string;
  name: string;
  gsm_no: string;
  lastname: string;
  password: string;
  role: String;
  createdAt: Date;
  permissions: Array<number>;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}



const AdminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    gsm_no: { type: String },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["superadmin", "regionalmanager"], required: true, default: "regionalmanager" },
    permissions: { type: Array }
  },
  { timestamps: true }
);

AdminUserSchema.pre("save", async function (next: mongoose.HookNextFunction) {
  let user = this as AdminUserDocument;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // Random additional data
  const salt = await bcrypt.genSalt(config.get("saltWorkFactor"));

  const hash = await bcrypt.hashSync(user.password, salt);

  // Replace the password with the hash
  user.password = hash;

  return next();
});

// Used for logging in
AdminUserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user = this as AdminUserDocument;

  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

AdminUserSchema.plugin(uniqueValidator, { message: 'email already exists!' });


AdminUserSchema.index({ email: 1 }, {
  unique: true,
  partialFilterExpression: {
    'email': { $exists: true, $gt: '' }
  }
});

AdminUserSchema.index({ gsm_no: 1 }, {
  unique: true,
  partialFilterExpression: {
    'gsm_no': { $exists: true, $gt: '' }
  }
});


//Admin girişi yapmak için model oluşturuyoruz.
const AdminUser = mongoose.model<AdminUserDocument>("adminusers", AdminUserSchema);
export default AdminUser;
