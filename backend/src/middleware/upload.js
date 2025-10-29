const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const sharp = require('sharp');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', 'temp'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

/**
 * Process uploaded image - create multiple sizes and optimize
 */
async function processImage(filePath, partId) {
  try {
    const partDir = path.join(__dirname, '..', 'uploads', 'images', 'parts', partId.toString());
    await fs.ensureDir(partDir);

    const image = sharp(filePath);
    const metadata = await image.metadata();

    // Create different sizes
    const sizes = {
      thumbnail: { width: 200, height: 200 },
      medium: { width: 800, height: 600 },
      original: { width: metadata.width, height: metadata.height }
    };

    const processedImages = {};

    for (const [sizeName, dimensions] of Object.entries(sizes)) {
      const outputPath = path.join(partDir, `${sizeName}.webp`);
      
      await image
        .resize(dimensions.width, dimensions.height, { 
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: sizeName === 'original' ? 90 : 80 })
        .toFile(outputPath);

      processedImages[sizeName] = `/uploads/images/parts/${partId}/${sizeName}.webp`;
    }

    // Clean up temp file
    await fs.remove(filePath);

    return processedImages;
  } catch (error) {
    console.error('Image processing error:', error);
    throw error;
  }
}

/**
 * Delete all images associated with a part
 */
async function deletePartImages(partId) {
  try {
    const partDir = path.join(__dirname, '..', 'uploads', 'images', 'parts', partId.toString());
    await fs.remove(partDir);
    return true;
  } catch (error) {
    console.error('Error deleting part images:', error);
    return false;
  }
}

module.exports = {
  upload,
  processImage,
  deletePartImages
};
