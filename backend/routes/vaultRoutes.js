import express from "express";
import multer from "multer";
import fs from "fs";

const router = express.Router();

// Create uploads folder if not exists
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

// Configure Multer (local file storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// 📤 Upload File
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = `/uploads/${req.file.filename}`;
    res.status(200).json({
      message: "File uploaded successfully",
      filePath,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "File upload failed" });
  }
});

// 📂 Get all uploaded files
router.get("/files", async (req, res) => {
  try {
    const files = fs.readdirSync("./uploads");
    res.status(200).json({ files });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch files" });
  }
});

export default router;
