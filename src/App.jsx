import React from "react";
import UploadForm from "./UploadForm";
import Gallery from "./Gallery";

function App() {
  return (
    <div className="min-h-screen p-6 bg-gray-100 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">Image Uploader</h1>
      <UploadForm />
      <Gallery />
    </div>
  );
}

export default App;
