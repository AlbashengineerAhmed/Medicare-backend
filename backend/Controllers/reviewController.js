import Review from "../models/ReviewSchema.js";
import Doctor from "../models/DoctorSchema.js";
import mongoose from "mongoose";

export const getAllReviews = async (req, res) => {
  try {
    // Check if doctorId is provided in the route params
    const doctorId = req.params.doctorId;
    let reviews;

    if (doctorId) {
      // If doctorId is provided, filter reviews by doctor
      console.log('Fetching reviews for doctor:', doctorId);
      reviews = await Review.find({ doctor: doctorId })
        .populate({
          path: 'user',
          select: 'name photo'
        });

      // Log user photos for debugging
      reviews.forEach((review, index) => {
        console.log(`Review ${index} user:`, review.user);
        if (review.user) {
          console.log(`Review ${index} user photo:`, review.user.photo);
        }
      });
    } else {
      // If no doctorId, return all reviews (for admin purposes)
      console.log('Fetching all reviews (no doctor filter)');
      reviews = await Review.find({})
        .populate({
          path: 'user',
          select: 'name photo'
        });
    }

    res
      .status(200)
      .json({ success: true, message: "Successful", data: reviews });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(404).json({ success: false, message: "Not found" });
  }
};

export const createReview = async (req, res) => {
  if (!req.body.doctor) req.body.doctor = req.params.doctorId;
  if (!req.body.user) req.body.user = req.userId;

  const newReview = new Review(req.body);

  try {
    const savedReview = await newReview.save();

    await Doctor.findByIdAndUpdate(req.body.doctor, {
      $push: { reviews: savedReview._id },
    });

    // Populate the user data before returning
    const populatedReview = await Review.findById(savedReview._id)
      .populate({
        path: 'user',
        select: 'name photo'
      });

    console.log('Created review with user data:', populatedReview);

    res
      .status(200)
      .json({ success: true, message: "Review submitted", data: populatedReview });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get a single review by ID
export const getReview = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Review found",
      data: review
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  const { id } = req.params;
  const { reviewText, rating } = req.body;

  try {
    // Check if review exists
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    // Check if the user is the author of the review
    console.log('Review user ID:', review.user);
    console.log('Request user ID:', req.userId);
    console.log('User IDs match?', review.user.toString() === req.userId);
    console.log('Review doctor ID:', review.doctor);

    if (review.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this review"
      });
    }

    // Update the review (preserve the doctor ID)
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      {
        reviewText,
        rating,
        doctor: review.doctor // Ensure the doctor ID is preserved
      },
      { new: true }
    ).populate('user', 'name photo');

    // Recalculate average ratings for the doctor
    await Review.calcAverageRatings(review.doctor);

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if review exists
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    // Check if the user is the author of the review or an admin
    console.log('Delete - Review user ID:', review.user);
    console.log('Delete - Request user ID:', req.userId);
    console.log('Delete - User role:', req.role);
    console.log('Delete - User IDs match?', review.user.toString() === req.userId);

    if (review.user.toString() !== req.userId && req.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this review"
      });
    }

    const doctorId = review.doctor;

    // Remove the review from the doctor's reviews array
    await Doctor.findByIdAndUpdate(doctorId, {
      $pull: { reviews: id }
    });

    // Delete the review
    await Review.findByIdAndDelete(id);

    // Recalculate average ratings for the doctor
    // If there are no more reviews, set defaults
    const remainingReviews = await Review.find({ doctor: doctorId });

    if (remainingReviews.length > 0) {
      await Review.calcAverageRatings(doctorId);
    } else {
      await Doctor.findByIdAndUpdate(doctorId, {
        totalRating: 0,
        averageRating: 0
      });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
