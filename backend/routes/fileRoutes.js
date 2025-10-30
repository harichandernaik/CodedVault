import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import File from "../models/File.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ DELETE a file by ID (no need for code param)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // delete from local uploads folder
    const filePath = path.join(__dirname, "../uploads", file.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await file.deleteOne();
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("❌ Delete error:", error);
    res.status(500).json({ message: "Server error while deleting file" });
  }
});

export default router;
