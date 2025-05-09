import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure Cloudinary with hardcoded values for now
cloudinary.config({
  cloud_name: 'dotzclh4n',
  api_key: '753189813864945',
  api_secret: 'ikraAHt9hzskTqhwLwriLz0rURY'
});

/**
 * Upload an image to Cloudinary
 * @param {Object} file - The file to upload
 * @param {String} folder - The folder to upload to (optional)
 * @returns {Promise} - The upload result
 */
export const uploadImage = async (file, folder = 'medicare') => {
  try {
    // If file is already a string URL, return it
    if (typeof file === 'string' && file.includes('cloudinary')) {
      return { url: file };
    }

    // Check if file exists and has a path or is a buffer
    if (!file) {
      throw new Error('No file provided for upload');
    }

    let uploadResult;

    try {
      // Handle different file formats
      if (file.path) {
        // If file has a path (from multer disk storage)
        uploadResult = await cloudinary.uploader.upload(file.path, {
          folder: folder,
          resource_type: 'auto'
        });
      } else if (file.buffer) {
        // If file is a buffer (from multer memory storage)
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        uploadResult = await cloudinary.uploader.upload(dataURI, {
          folder: folder,
          resource_type: 'auto'
        });
      } else if (file.tempFilePath) {
        // If using express-fileupload
        uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: folder,
          resource_type: 'auto'
        });
      } else {
        // If we have a file object but none of the above properties, try to use it directly
        uploadResult = await cloudinary.uploader.upload(file, {
          folder: folder,
          resource_type: 'auto'
        });
      }
    } catch (uploadError) {
      // Fallback to a default image URL
      return {
        url: 'https://res.cloudinary.com/dotzclh4n/image/upload/v1625123456/medicare/default-user_abcdef.jpg',
        public_id: 'medicare/default-user_abcdef'
      };
    }

    return {
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id
    };
  } catch (error) {
    throw new Error('Image upload failed');
  }
};

/**
 * Delete an image from Cloudinary
 * @param {String} publicId - The public ID of the image to delete
 * @returns {Promise} - The deletion result
 */
export const deleteImage = async (publicId) => {
  try {
    if (!publicId) return { result: 'No image to delete' };

    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error('Image deletion failed');
  }
};
