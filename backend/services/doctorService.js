import Doctor from "../models/DoctorSchema.js";
import { uploadImage } from "../utils/imageUpload.js";

/**
 * Get all doctors
 * @param {Object} query - Query parameters
 * @returns {Promise<Object>} - Doctors data
 */
export const getAllDoctors = async (query = {}) => {
  try {
    const { search, specialization, sort, limit } = query;
    
    // Build filter
    const filter = { isApproved: "approved" };
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } }
      ];
    }
    
    if (specialization) {
      filter.specialization = { $regex: specialization, $options: "i" };
    }
    
    // Build sort
    let sortOptions = {};
    if (sort) {
      if (sort === "rating") {
        sortOptions = { averageRating: -1 };
      } else if (sort === "-rating") {
        sortOptions = { averageRating: 1 };
      } else if (sort === "price") {
        sortOptions = { ticketPrice: 1 };
      } else if (sort === "-price") {
        sortOptions = { ticketPrice: -1 };
      } else if (sort === "-averageRating") {
        sortOptions = { averageRating: -1 };
      }
    } else {
      // Default sort by average rating
      sortOptions = { averageRating: -1 };
    }
    
    // Build query
    let doctorQuery = Doctor.find(filter)
      .select("-password")
      .sort(sortOptions);
    
    // Apply limit if provided
    if (limit) {
      doctorQuery = doctorQuery.limit(parseInt(limit));
    }
    
    // Execute query
    const doctors = await doctorQuery;
    
    return {
      success: true,
      message: "Doctors retrieved successfully",
      data: doctors,
      statusCode: 200
    };
  } catch (error) {
    console.error("Get all doctors error:", error);
    return {
      success: false,
      message: "Failed to retrieve doctors",
      error: error.message,
      statusCode: 500
    };
  }
};

/**
 * Get a doctor by ID
 * @param {string} id - Doctor ID
 * @returns {Promise<Object>} - Doctor data
 */
export const getDoctorById = async (id) => {
  try {
    const doctor = await Doctor.findById(id)
      .populate("reviews")
      .select("-password");
    
    if (!doctor) {
      return {
        success: false,
        message: "Doctor not found",
        statusCode: 404
      };
    }
    
    return {
      success: true,
      message: "Doctor retrieved successfully",
      data: doctor,
      statusCode: 200
    };
  } catch (error) {
    console.error("Get doctor by ID error:", error);
    return {
      success: false,
      message: "Failed to retrieve doctor",
      error: error.message,
      statusCode: 500
    };
  }
};

/**
 * Update a doctor
 * @param {string} id - Doctor ID
 * @param {Object} doctorData - Doctor data
 * @param {File} photo - Doctor photo
 * @returns {Promise<Object>} - Update result
 */
export const updateDoctor = async (id, doctorData, photo) => {
  try {
    // Check if doctor exists
    const doctor = await Doctor.findById(id);
    
    if (!doctor) {
      return {
        success: false,
        message: "Doctor not found",
        statusCode: 404
      };
    }
    
    // Upload photo if provided
    if (photo) {
      const uploadResult = await uploadImage(photo);
      doctorData.photo = uploadResult.url;
    }
    
    // Parse arrays if they are strings
    if (doctorData.qualifications && typeof doctorData.qualifications === "string") {
      doctorData.qualifications = JSON.parse(doctorData.qualifications);
    }
    
    if (doctorData.experiences && typeof doctorData.experiences === "string") {
      doctorData.experiences = JSON.parse(doctorData.experiences);
    }
    
    if (doctorData.timeSlots && typeof doctorData.timeSlots === "string") {
      doctorData.timeSlots = JSON.parse(doctorData.timeSlots);
    }
    
    // Update doctor
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: doctorData },
      { new: true }
    ).select("-password");
    
    return {
      success: true,
      message: "Doctor updated successfully",
      data: updatedDoctor,
      statusCode: 200
    };
  } catch (error) {
    console.error("Update doctor error:", error);
    return {
      success: false,
      message: "Failed to update doctor",
      error: error.message,
      statusCode: 500
    };
  }
};
