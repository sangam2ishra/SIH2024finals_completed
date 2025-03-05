import {Schema, model} from "mongoose";

const PdfDetailsSchema = new Schema(
  {
    pdf: String,
    title: String,
  },
  { collection: "PdfDetails" }
);

const PdfDetails = model("PdfDetails", PdfDetailsSchema);

export default PdfDetails;