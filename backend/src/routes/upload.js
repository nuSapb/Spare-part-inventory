const express = require('express');
const router = express.Router();
const { upload, processImage } = require('../middleware/upload');
const { getConnection } = require('../../config/database');

/**
 * Upload single image for a part
 */
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { partId } = req.body;
    if (!partId) {
      return res.status(400).json({ error: 'Part ID is required' });
    }

    // Process the uploaded image
    const processedImages = await processImage(req.file.path, partId);

    // Update the part's image URL in database
    const pool = await getConnection();
    try {
      const result = await pool.request()
        .input('partId', partId)
        .input('imageUrl', processedImages.medium)
        .query(`
          UPDATE Parts 
          SET image_url = @imageUrl
          WHERE part_id = @partId
        `);

      res.json({
        success: true,
        message: 'Image uploaded successfully',
        images: processedImages
      });
    } catch (dbError) {
      console.error('Database update error:', dbError);
      res.status(500).json({ error: 'Failed to update part with image URL' });
    } finally {
      await pool.close();
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

/**
 * Delete images for a part
 */
router.delete('/image/:partId', async (req, res) => {
  try {
    const { partId } = req.params;
    
    // Delete images from filesystem
    const { deletePartImages } = require('../middleware/upload');
    const deleted = await deletePartImages(partId);

    if (deleted) {
      // Remove image URL from database
      const pool = await getConnection();
      try {
        await pool.request()
          .input('partId', partId)
          .query(`
            UPDATE Parts 
            SET image_url = NULL
            WHERE part_id = @partId
          `);

        res.json({
          success: true,
          message: 'Image deleted successfully'
        });
      } catch (dbError) {
        console.error('Database update error:', dbError);
        res.status(500).json({ error: 'Failed to remove image URL from database' });
      } finally {
        await pool.close();
      }
    } else {
      res.status(500).json({ error: 'Failed to delete images' });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Image deletion failed' });
  }
});

/**
 * Get image info for a part
 */
router.get('/image/:partId', async (req, res) => {
  try {
    const { partId } = req.params;
    
    const pool = await getConnection();
    try {
      const result = await pool.request()
        .input('partId', partId)
        .query(`
          SELECT image_url 
          FROM Parts 
          WHERE part_id = @partId
        `);

      res.json({
        success: true,
        imageUrl: result.recordset[0]?.image_url || null
      });
    } catch (dbError) {
      console.error('Database query error:', dbError);
      res.status(500).json({ error: 'Failed to get image info' });
    } finally {
      await pool.close();
    }
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({ error: 'Failed to get image info' });
  }
});

module.exports = router;
