import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
import uniqueValidator from 'mongoose-unique-validator'

interface UserDocument extends mongoose.Document {
  email: string;
  name: string;
  lastname: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next: mongoose.HookNextFunction) {
  let user = this as UserDocument;

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
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user = this as UserDocument;

  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

UserSchema.plugin(uniqueValidator, { message: 'email already exists!' });



//kullancıcı girişi yapmak için model oluşturuyoruz.
const UserModel = mongoose.model<Document>("User", UserSchema);

export {
    UserModel,
    UserDocument
};
