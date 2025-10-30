// backend/models/Vault.js
import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  name: String,
  url: String,
  uploadedAt: { type: Date, default: Date.now }
});

const vaultSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  files: [fileSchema]
});

export default mongoose.model("Vault", vaultSchema);
