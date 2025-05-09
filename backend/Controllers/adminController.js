import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";
import Appointment from "../models/AppointmentSchema.js";
import DeletionRequest from "../models/DeletionRequestSchema.js";
import Review from "../models/ReviewSchema.js";

// Get all doctors (including pending approval)
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().select("-password");

    res.status(200).json({
      success: true,
      message: "All doctors retrieved successfully",
      data: doctors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve doctors",
      error: error.message
    });
  }
};

// Approve or reject a doctor
export const updateDoctorStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (!["pending", "approved", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { isApproved: status },
      { new: true }
    ).select("-password");

    if (!updatedDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    res.status(200).json({
      success: true,
      message: `Doctor ${status === "approved" ? "approved" : status === "cancelled" ? "rejected" : "status updated"}`,
      data: updatedDoctor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update doctor status",
      error: error.message
    });
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Count total users (patients)
    const totalPatients = await User.countDocuments({ role: "patient" });

    // Count total doctors
    const totalDoctors = await Doctor.countDocuments();

    // Count approved doctors
    const approvedDoctors = await Doctor.countDocuments({ isApproved: "approved" });

    // Count pending doctors
    const pendingDoctors = await Doctor.countDocuments({ isApproved: "pending" });

    // Count total appointments
    const totalAppointments = await Appointment.countDocuments();

    // Count appointments by status
    const pendingAppointments = await Appointment.countDocuments({ status: "pending" });
    const confirmedAppointments = await Appointment.countDocuments({ status: "confirmed" });
    const completedAppointments = await Appointment.countDocuments({ status: "completed" });
    const cancelledAppointments = await Appointment.countDocuments({ status: "cancelled" });

    // Get recent appointments
    const recentAppointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("doctor", "name photo specialization")
      .populate("patient", "name photo");

    // Count pending deletion requests
    const pendingDeletionRequests = await DeletionRequest.countDocuments({ status: "pending" });

    res.status(200).json({
      success: true,
      data: {
        totalPatients,
        totalDoctors,
        approvedDoctors,
        pendingDoctors,
        totalAppointments,
        appointmentStats: {
          pending: pendingAppointments,
          confirmed: confirmedAppointments,
          completed: completedAppointments,
          cancelled: cancelledAppointments
        },
        pendingDeletionRequests,
        recentAppointments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get dashboard statistics",
      error: error.message
    });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "patient" }).select("-password");

    res.status(200).json({
      success: true,
      message: "All users retrieved successfully",
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
      error: error.message
    });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Delete user's appointments
    await Appointment.deleteMany({ patient: id });

    // Delete user's reviews
    await Review.deleteMany({ user: id });

    // Delete user's deletion requests
    await DeletionRequest.deleteMany({ user: id, userModel: "User" });

    // Delete the user
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message
    });
  }
};

// Delete a doctor
export const deleteDoctor = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if doctor exists
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    // Delete doctor's appointments
    await Appointment.deleteMany({ doctor: id });

    // Delete doctor's reviews
    await Review.deleteMany({ doctor: id });

    // Delete doctor's deletion requests
    await DeletionRequest.deleteMany({ user: id, userModel: "Doctor" });

    // Delete the doctor
    await Doctor.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete doctor",
      error: error.message
    });
  }
};

// Get all appointments
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .populate("doctor", "name photo specialization")
      .populate("patient", "name photo");

    res.status(200).json({
      success: true,
      message: "All appointments retrieved successfully",
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve appointments",
      error: error.message
    });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Check if appointment exists
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // Update appointment status
    appointment.status = status;
    await appointment.save();

    res.status(200).json({
      success: true,
      message: `Appointment status updated to ${status}`,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update appointment status",
      error: error.message
    });
  }
};

// Delete an appointment
export const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if appointment exists
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // Delete the appointment
    await Appointment.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete appointment",
      error: error.message
    });
  }
};