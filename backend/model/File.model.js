import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Name: { type: String, required: true },
    Fathername: { type: String, required: true },
    Phone: { type: Number, required: true },
    CNIC: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  { timestamps: true }, // ✅ This adds createdAt & updatedAt automatically
);

const File = mongoose.model("File", FileSchema);
export default File;
