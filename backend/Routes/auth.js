import express from 'express';
import upload from '../middleware/uploadMiddleware.js';

import { register, login } from '../Controllers/authController.js';

const router = express.Router();

// Register route with file upload middleware
router.post('/register', (req, res, next) => {
  // Check if the request has a Content-Type header that includes multipart/form-data
  const contentType = req.headers['content-type'] || '';

  if (contentType.includes('multipart/form-data')) {
    // If it's a multipart form, use the upload middleware
    console.log('Processing multipart form data registration');
    upload.single('photo')(req, res, (err) => {
      if (err) {
        console.error('Upload middleware error:', err);
        return res.status(400).json({
          success: false,
          message: 'File upload failed',
          error: err.message
        });
      }
      next();
    });
  } else {
    // If it's not a multipart form, just proceed to the controller
    console.log('Processing JSON registration without file');
    next();
  }
}, register);

router.post('/login', login);

export default router;