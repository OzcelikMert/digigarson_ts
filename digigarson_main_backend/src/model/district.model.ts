import mongoose from "mongoose";
import { CountryDocument } from "./country.model";
import { CityDocument } from "./city.model";
export interface DistrictDocument extends mongoose.Document {
  name: string;
  city: CityDocument["_id"]
  country: CountryDocument["_id"]
}

const DistrictSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
    country: { type: mongoose.Schema.Types.ObjectId, ref: "Country", required: true }
  }
);



DistrictSchema.index({ name: 1, city: 1, country: 1 }, { unique: true });
//semt bilgilerini girmek için gereken modeli oluşturduk.
const District = mongoose.model<DistrictDocument>("District", DistrictSchema);

export default District;
