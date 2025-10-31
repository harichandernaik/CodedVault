import { useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import {
  FiUnlock,
  FiUploadCloud,
  FiFileText,
  FiPlusCircle,
  FiLogOut,
  FiSave,
} from "react-icons/fi";
import "./App.css";

export default function App() {
  const [accessCode, setAccessCode] = useState("");
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  // ✅ Fetch files for this access code
  const fetchFiles = async () => {
    try {
      const res = await axios.get(`https://codedvault.onrender.com/api/files/${accessCode}`);
      setFiles(res.data);
    } catch (err) {
      console.error("❌ Fetch error:", err);
    }
  };

  // ✅ View file
  const handleView = (file) => {
    window.open(`https://codedvault.onrender.com/uploads/${file.filename}`, "_blank");
  };

  // ✅ Delete file
  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await axios.delete(`https://codedvault.onrender.com/api/files/${fileId}`);
      alert("File deleted successfully!");
      await fetchFiles(); // refresh
    } catch (err) {
      console.error("❌ Delete error:", err);
      alert("Failed to delete file.");
    }
  };

  // ✅ Open vault and load files
  const handleOpenVault = async () => {
    if (!accessCode.trim()) {
      alert("Please enter your access code!");
      return;
    }
    setIsVaultOpen(true);
    await fetchFiles();
  };

  // ✅ Upload handler for file input
  const handleUpload = async (e) => {
    const uploaded = Array.from(e.target.files);
    const formData = new FormData();
    uploaded.forEach((file) => formData.append("files", file));
    formData.append("accessCode", accessCode);

    try {
      const res = await axios.post("https://codedvault.onrender.com/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("✅ Uploaded:", res.data);
      alert("Files uploaded successfully!");
      await fetchFiles();
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert("File upload failed. Check backend connection.");
    }
  };

  // ✅ Drag-drop upload
  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);

    const uploaded = Array.from(e.dataTransfer.files);
    const formData = new FormData();
    uploaded.forEach((file) => formData.append("files", file));
    formData.append("accessCode", accessCode);

    try {
      const res = await axios.post("https://codedvault.onrender.com/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("✅ Uploaded (drag-drop):", res.data);
      alert("Files uploaded successfully!");
      await fetchFiles();
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert("Error uploading files.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);

  const handleSave = () => {
    alert("Files saved successfully!");
  };

  const handleSaveAndClose = () => {
    alert("Files saved. Redirecting to home...");
    setIsVaultOpen(false);
    setAccessCode("");
    setFiles([]);
  };

  return (
    <div className="vault-wrapper">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: true },
          background: { color: "transparent" },
          fpsLimit: 60,
          particles: {
            color: { value: ["#38bdf8", "#a855f7", "#f59e0b"] },
            move: { enable: true, speed: 1, outModes: { default: "bounce" } },
            number: { value: 60 },
            opacity: { value: 0.6 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 4 } },
          },
          detectRetina: true,
        }}
      />

      {!isVaultOpen ? (
        <motion.div
          className="access-box"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="logo-text neon">
            <FiUnlock className="logo-icon" /> CodedVault
          </h1>
          <p className="tagline">Your encrypted cloud space</p>
          <input
            className="access-input"
            placeholder="Enter unique access code..."
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
          />
          <motion.button
            className="access-btn neon-btn"
            whileHover={{ scale: 1.05 }}
            onClick={handleOpenVault}
          >
            Open Vault
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          className="vault-dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <header className="vault-header">
            <div className="logo-area neon">
              <FiFileText className="header-icon" />
              <h2>CodedVault</h2>
            </div>
            <div className="header-actions">
              <label className="upload-btn neon-btn">
                <FiPlusCircle /> Add Files
                <input
                  type="file"
                  multiple
                  hidden
                  onChange={handleUpload}
                  ref={fileInputRef}
                />
              </label>
              <button
                onClick={() => setIsVaultOpen(false)}
                className="logout-btn neon-btn"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          </header>

          <main
            className={`vault-content ${isDragging ? "dragging" : ""}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {files.length === 0 ? (
              <motion.div
                className="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={() => fileInputRef.current.click()}
              >
                <FiUploadCloud className="upload-icon" />
                <p>
                  Click or drag files here to <br />
                  <strong>Upload your files securely</strong>
                </p>
              </motion.div>
            ) : (
              <div className="files-grid">
                {files.map((file, i) => (
                  <motion.div
                    key={i}
                    className="file-card"
                    whileHover={{ scale: 1.05 }}
                  >
                    <FiFileText className="file-icon" />
                    <p className="file-name">
                      {file.originalname || file.name}
                    </p>

                    <div className="file-actions">
                      <button
                        className="view-btn"
                        onClick={() => handleView(file)}
                      >
                        View
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(file._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </main>

          <footer className="vault-footer">
            <div className="footer-buttons">
              <button className="save-btn neon-btn" onClick={handleSave}>
                <FiSave /> Save
              </button>
              <button
                className="save-close-btn neon-btn"
                onClick={handleSaveAndClose}
              >
                <FiSave /> Save & Close
              </button>
            </div>
          </footer>
        </motion.div>
      )}
    </div>
  );
}
