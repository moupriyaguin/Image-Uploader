import React, { useEffect, useState } from "react";
import axios from "axios";

const Gallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios
      .get("http://3.108.250.8:5000/images")
      .then((res) => setImages(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Uploaded Images</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img) => (
          <img
            key={img._id}
            src={img.url}
            alt={img.key}
            className="rounded shadow object-cover h-48 w-full"
          />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
