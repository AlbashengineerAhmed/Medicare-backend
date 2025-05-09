import Review from "../models/ReviewSchema.js";
import Doctor from "../models/DoctorSchema.js";

/**
 * Get all reviews for a doctor
 * @param {string} doctorId - Doctor ID
 * @returns {Promise<Object>} - Reviews data
 */
export const getDoctorReviews = async (doctorId) => {
  try {
    const reviews = await Review.find({ doctor: doctorId });
    
    return {
      success: true,
      message: "Reviews retrieved successfully",
      data: reviews,
      statusCode: 200
    };
  } catch (error) {
    console.error("Get doctor reviews error:", error);
    return {
      success: false,
      message: "Failed to retrieve reviews",
      error: error.message,
      statusCode: 500
    };
  }
};

/**
 * Get a review by ID
 * @param {string} id - Review ID
 * @returns {Promise<Object>} - Review data
 */
export const getReviewById = async (id) => {
  try {
    const review = await Review.findById(id);
    
    if (!review) {
      return {
        success: false,
        message: "Review not found",
        statusCode: 404
      };
    }
    
    return {
      success: true,
      message: "Review retrieved successfully",
      data: review,
      statusCode: 200
    };
  } catch (error) {
    console.error("Get review by ID error:", error);
    return {
      success: false,
      message: "Failed to retrieve review",
      error: error.message,
      statusCode: 500
    };
  }
};

/**
 * Create a review
 * @param {Object} reviewData - Review data
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Creation result
 */
export const createReview = async (reviewData, userId) => {
  try {
    const { doctor, rating, reviewText } = reviewData;
    
    // Check if doctor exists
    const doctorExists = await Doctor.findById(doctor);
    
    if (!doctorExists) {
      return {
        success: false,
        message: "Doctor not found",
        statusCode: 404
      };
    }
    
    // Check if user already reviewed this doctor
    const existingReview = await Review.findOne({
      doctor,
      user: userId
    });
    
    if (existingReview) {
      return {
        success: false,
        message: "You have already reviewed this doctor",
        statusCode: 400
      };
    }
    
    // Create review
    const newReview = new Review({
      doctor,
      user: userId,
      rating,
      reviewText
    });
    
    // Save review
    const savedReview = await newReview.save();
    
    // Update doctor's reviews array
    await Doctor.findByIdAndUpdate(doctor, {
      $push: { reviews: savedReview._id }
    });
    
    return {
      success: true,
      message: "Review created successfully",
      data: savedReview,
      statusCode: 201
    };
  } catch (error) {
    console.error("Create review error:", error);
    return {
      success: false,
      message: "Failed to create review",
      error: error.message,
      statusCode: 500
    };
  }
};

/**
 * Update a review
 * @param {string} id - Review ID
 * @param {Object} reviewData - Review data
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Update result
 */
export const updateReview = async (id, reviewData, userId) => {
  try {
    // Check if review exists
    const review = await Review.findById(id);
    
    if (!review) {
      return {
        success: false,
        message: "Review not found",
        statusCode: 404
      };
    }
    
    // Check if user is the owner of the review
    if (review.user.toString() !== userId) {
      return {
        success: false,
        message: "You are not authorized to update this review",
        statusCode: 403
      };
    }
    
    // Update review
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { $set: reviewData },
      { new: true }
    );
    
    return {
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
      statusCode: 200
    };
  } catch (error) {
    console.error("Update review error:", error);
    return {
      success: false,
      message: "Failed to update review",
      error: error.message,
      statusCode: 500
    };
  }
};

/**
 * Delete a review
 * @param {string} id - Review ID
 * @param {string} userId - User ID
 * @param {string} userRole - User role
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteReview = async (id, userId, userRole) => {
  try {
    // Check if review exists
    const review = await Review.findById(id);
    
    if (!review) {
      return {
        success: false,
        message: "Review not found",
        statusCode: 404
      };
    }
    
    // Check if user is the owner of the review or an admin
    if (review.user.toString() !== userId && userRole !== "admin") {
      return {
        success: false,
        message: "You are not authorized to delete this review",
        statusCode: 403
      };
    }
    
    // Get doctor ID before deleting review
    const doctorId = review.doctor;
    
    // Delete review
    await Review.findByIdAndDelete(id);
    
    // Remove review from doctor's reviews array
    await Doctor.findByIdAndUpdate(doctorId, {
      $pull: { reviews: id }
    });
    
    return {
      success: true,
      message: "Review deleted successfully",
      statusCode: 200
    };
  } catch (error) {
    console.error("Delete review error:", error);
    return {
      success: false,
      message: "Failed to delete review",
      error: error.message,
      statusCode: 500
    };
  }
};
