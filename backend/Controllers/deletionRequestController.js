import DeletionRequest from "../models/DeletionRequestSchema.js";
import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";

// Create a deletion request
export const createDeletionRequest = async (req, res) => {
  const { reason } = req.body;
  const userId = req.userId;
  const userRole = req.role;

  try {
    // Check if there's already a pending request
    const existingRequest = await DeletionRequest.findOne({
      user: userId,
      status: "pending"
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending deletion request"
      });
    }

    // Determine the user model based on role
    const userModel = userRole === "doctor" ? "Doctor" : "User";

    // Create a new deletion request
    const deletionRequest = new DeletionRequest({
      user: userId,
      userModel,
      reason
    });

    await deletionRequest.save();

    res.status(201).json({
      success: true,
      message: "Deletion request submitted successfully",
      data: deletionRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit deletion request",
      error: error.message
    });
  }
};

// Get deletion request status for a user
export const getDeletionRequestStatus = async (req, res) => {
  const userId = req.userId;

  try {
    const deletionRequest = await DeletionRequest.findOne({
      user: userId
    }).sort({ createdAt: -1 });

    if (!deletionRequest) {
      return res.status(404).json({
        success: false,
        message: "No deletion request found"
      });
    }

    res.status(200).json({
      success: true,
      data: deletionRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get deletion request status",
      error: error.message
    });
  }
};

// Admin: Get all deletion requests
export const getAllDeletionRequests = async (req, res) => {
  try {
    const deletionRequests = await DeletionRequest.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "name email photo role"
      });

    res.status(200).json({
      success: true,
      data: deletionRequests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get deletion requests",
      error: error.message
    });
  }
};

// Admin: Process a deletion request (approve or reject)
export const processDeletionRequest = async (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;
  const adminId = req.userId;

  try {
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    const deletionRequest = await DeletionRequest.findById(id);

    if (!deletionRequest) {
      return res.status(404).json({
        success: false,
        message: "Deletion request not found"
      });
    }

    if (deletionRequest.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `This request has already been ${deletionRequest.status}`
      });
    }

    // Update the deletion request
    deletionRequest.status = status;
    deletionRequest.adminNotes = adminNotes;
    deletionRequest.resolvedBy = adminId;
    deletionRequest.resolvedAt = new Date();

    await deletionRequest.save();

    // If approved, actually delete the user
    if (status === "approved") {
      const Model = deletionRequest.userModel === "Doctor" ? Doctor : User;
      await Model.findByIdAndDelete(deletionRequest.user);
    }

    res.status(200).json({
      success: true,
      message: `Deletion request ${status}`,
      data: deletionRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to process deletion request",
      error: error.message
    });
  }
};
