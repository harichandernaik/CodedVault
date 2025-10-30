import express from "express";
import cors from "cors";
import multer from "multer";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fileRoutes from "./routes/fileRoutes.js";

import File from "./models/File.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- File upload setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// --- Upload API ---
app.post("/api/upload", upload.array("files"), async (req, res) => {
  try {
    const { accessCode } = req.body;
    const savedFiles = [];

    for (const file of req.files) {
      const newFile = await File.create({
        filename: file.filename,
        originalname: file.originalname,
        accessCode,
      });
      savedFiles.push(newFile);
    }

    res.json({ success: true, files: savedFiles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// --- Fetch Files API ---
app.get("/api/files/:accessCode", async (req, res) => {
  try {
    const files = await File.find({ accessCode: req.params.accessCode });
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch files" });
  }
});

// --- Use the delete routes ---
app.use("/api/files", fileRoutes); // ✅ this connects delete API properly

// --- Serve uploaded files ---
app.use("/uploads", express.static("uploads"));

// --- MongoDB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// --- Start server ---
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
