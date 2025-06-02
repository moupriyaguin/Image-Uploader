const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload()); // Middleware to handle file uploads

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// MongoDB model
const Image = mongoose.model('Image', new mongoose.Schema({
  key: String,
  url: String,
  uploadedAt: { type: Date, default: Date.now }
}));

// AWS S3 client config
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

// Upload route
app.post('/upload', async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.files.image;
    const fileKey = `${Date.now()}_${file.name}`;

    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      Body: file.data,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    await s3.send(new PutObjectCommand(uploadParams));

    const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    const image = new Image({ key: fileKey, url: imageUrl });
    await image.save();

    res.status(200).json({ message: 'Upload successful', data: image });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Get all images
app.get('/images', async (req, res) => {
  try {
    const images = await Image.find().sort({ uploadedAt: -1 });
    res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
