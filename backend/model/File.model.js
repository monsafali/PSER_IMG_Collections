import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
  RespondentName: { type: String, required: true },
  imageUrl: { type: String, required: true },
  public_id: { type: String, required: true },
  Phone: { type: Number, required: true }, // remove unique
  HouseSerialNo: { type: Number, required: true },
});



const File = mongoose.model("File", FileSchema);
export default File;
