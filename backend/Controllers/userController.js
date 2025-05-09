import User from "../models/UserSchema.js";
import { uploadImage, deleteImage } from "../utils/imageUpload.js";

export const updateUser = async (req, res) => {
  const id = req.params.id;

  try {
    // Get the current user data
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Handle photo upload if there's a new photo
    if (req.file) {
      // Upload new image to Cloudinary
      const uploadResult = await uploadImage(req.file, "patients");

      // If the user already has a photo, delete the old one from Cloudinary
      if (user.photo && user.photo.includes('cloudinary')) {
        // Extract public_id from the URL
        const publicId = user.photo.split('/').pop().split('.')[0];
        await deleteImage(`medicare/patients/${publicId}`);
      }

      // Update the photo URL in the request body
      req.body.photo = uploadResult.url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update!",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    // Check if the user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Instead of deleting, redirect to deletion request
    return res.status(200).json({
      success: true,
      message: "Please submit a deletion request",
      requiresApproval: true
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to process deletion request!",
      error: error.message
    });
  }
};

export const getSingleUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id).select("-password"); // Query the user by ID

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User Found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "User Found",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user!",
      data: error,
    });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      message: "Users Found",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users!",
      data: error.message, // Corrected error handling
    });
  }
};
