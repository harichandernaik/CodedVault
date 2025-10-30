import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  accessCode: String, // this links file to vault
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model("File", fileSchema);
