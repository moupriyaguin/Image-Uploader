const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Define a basic schema
const Image = mongoose.model('Image', new mongoose.Schema({
  key: String,
  url: String,
  uploadedAt: { type: Date, default: Date.now }
}));

// Configure AWS S3
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Set up multer-s3 for image upload
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    }
  })
});

// POST route to upload image
app.post('/upload', upload.single('image'), async (req, res) => {
  const image = new Image({
    key: req.file.key,
    url: req.file.location
  });
  await image.save();
  res.status(200).json({ message: 'Upload successful', data: image });
});

// GET route to fetch images
app.get('/images', async (req, res) => {
  const images = await Image.find().sort({ uploadedAt: -1 });
  res.status(200).json(images);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
