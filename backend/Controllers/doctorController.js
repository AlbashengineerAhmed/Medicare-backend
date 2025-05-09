import Doctor from "../models/DoctorSchema.js"; // Import the Doctor model
import { uploadImage, deleteImage } from "../utils/imageUpload.js";

export const updateDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    // Get the current doctor data
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    // Handle photo upload if there's a new photo
    if (req.file) {
      // Upload new image to Cloudinary
      const uploadResult = await uploadImage(req.file, "doctors");

      // If the doctor already has a photo, delete the old one from Cloudinary
      if (doctor.photo && doctor.photo.includes('cloudinary')) {
        // Extract public_id from the URL
        const publicId = doctor.photo.split('/').pop().split('.')[0];
        await deleteImage(`medicare/doctors/${publicId}`);
      }

      // Update the photo URL in the request body
      req.body.photo = uploadResult.url;
    }

    // Parse JSON strings for array fields
    const updatedData = { ...req.body };

    // Parse timeSlots if it exists and is a string
    if (updatedData.timeSlots && typeof updatedData.timeSlots === 'string') {
      try {
        updatedData.timeSlots = JSON.parse(updatedData.timeSlots);
      } catch (e) {
        console.error('Error parsing timeSlots:', e);
      }
    }

    // Parse qualifications if it exists and is a string
    if (updatedData.qualifications && typeof updatedData.qualifications === 'string') {
      try {
        updatedData.qualifications = JSON.parse(updatedData.qualifications);
      } catch (e) {
        console.error('Error parsing qualifications:', e);
      }
    }

    // Parse experiences if it exists and is a string
    if (updatedData.experiences && typeof updatedData.experiences === 'string') {
      try {
        updatedData.experiences = JSON.parse(updatedData.experiences);
      } catch (e) {
        console.error('Error parsing experiences:', e);
      }
    }

    // Update the doctor with the new data
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedDoctor,
    });
  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update!",
      error: error.message,
    });
  }
};

export const deleteDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    // Check if the doctor exists
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
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

export const getSingleDoctor = async (req, res) => {
  // Rename the function to getSingleDoctor
  const id = req.params.id;

  try {
    const doctor = await Doctor.findById(id)
      .populate("reviews")
      .select("-password"); // Use the Doctor model

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "No Doctor Found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor Found",
      data: doctor, // Use doctor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve doctor!",
      data: error,
    });
  }
};

export const getAllDoctor = async (req, res) => {
  // Rename the function to getAllDoctors
  try {
    const { query } = req.query;
    let doctors;

    if (query) {
      doctors = await Doctor.find({
        isApproved: "approved",
        $or: [
          { name: { $regex: query, $options: "i" } },
          { specialization: { $regex: query, $options: "i" } },
        ],
      }).select("-password");
    } else {
      doctors = await Doctor.find({ isApproved: "approved" }).select(
        "-password"
      ); // Use the Doctor model
    }

    res.status(200).json({
      success: true,
      message: "Doctors Found",
      data: doctors, // Use doctors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve doctors!",
      data: error.message,
    });
  }
};
