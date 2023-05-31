import mongoose from "mongoose";

interface CallerDocument extends mongoose.Document {
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
const CallerModel = mongoose.model<CallerDocument>("CallerId", CallerId);

export {
    CallerModel,
    CallerDocument
};
