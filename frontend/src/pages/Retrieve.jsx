import { useState, useEffect } from "react";
import axios from "axios";

const Retrieve = ({ code }) => {
  const [files, setFiles] = useState([]);

  // Fetch all uploaded files for the entered code
  useEffect(() => {
    if (!code) return;
    axios
      .get(`https://codedvault.onrender.com/api/files/${code}`)
      .then((res) => setFiles(res.data))
      .catch((err) => console.error("Error fetching files:", err));
  }, [code]);

  // Handle delete confirmation + API call
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this file?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://codedvault.onrender.com/api/files/${code}/${id}`);
      setFiles((prev) => prev.filter((file) => file._id !== id));
      alert("File deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete the file.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">📁 Uploaded Files</h2>

      {files.length === 0 ? (
        <p className="text-gray-500 text-center">No files uploaded yet for this code.</p>
      ) : (
        <div className="space-y-4">
          {files.map((file) => (
            <div
              key={file._id}
              className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="truncate text-gray-700 font-medium">
                {file.originalname}
              </div>

              <div className="flex gap-3">
                {/* VIEW BUTTON */}
                <a
                  href={`https://codedvault.onrender.com/uploads/${file.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md transition"
                >
                  View
                </a>

                {/* DELETE BUTTON */}
                <button
                  onClick={() => handleDelete(file._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Retrieve;
