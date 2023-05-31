import mongoose from "mongoose";
import { CountryDocument } from "./country.model";
export interface CityDocument extends mongoose.Document {
  name: string;
  country: CountryDocument["_id"]
}

const CitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    country: { type: mongoose.Schema.Types.ObjectId, ref: "Country", required: true }
  }
);



CitySchema.index({ name: 1, country: 1}, { unique: true });
//şehir bilgileirni girebileceğiz ortamı tiplerine göre modeller.
const City = mongoose.model<CityDocument>("City", CitySchema);

export default City;
