import React, { useState } from "react";
import axios from "axios";

const UploadForm = () => {
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      setStatus("Uploading...");
      const res = await axios.post("http://3.108.250.8:5000/upload", formData);
      setStatus("Upload Successful ✅");
      setImage(null);
    } catch (err) {
      console.error(err);
      setStatus("Upload Failed ❌");
    }
  };

  return (
    <div className="bg-white p-4 shadow rounded mb-6">
      <form onSubmit={handleUpload} className="flex items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Upload
        </button>
      </form>
      <p className="mt-2">{status}</p>
    </div>
  );
};

export default UploadForm;
