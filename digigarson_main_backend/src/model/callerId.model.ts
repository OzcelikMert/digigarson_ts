import mongoose from "mongoose";

export interface CallerDocument extends mongoose.Document {
  branch: string;
  phone:  number;
}

const CallerId = new mongoose.Schema(
  {
    branch: { type: String, required: true },
    phone: { type: Number, required: true },
  },{timestamps: true}
);

//şehir bilgileirni girebileceğiz ortamı tiplerine göre modeller.
const Caller = mongoose.model<CallerDocument>("CallerId", CallerId);

export default Caller;
