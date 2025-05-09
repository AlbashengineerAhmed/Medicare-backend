import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import bcrypt from "bcryptjs";

// Update password for any user type (patient or doctor)
export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.userId; // From auth middleware
  const userRole = req.role; // From auth middleware

  try {
    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required"
      });
    }

    // Find the user based on role
    let user;
    if (userRole === "patient") {
      user = await User.findById(userId);
    } else if (userRole === "doctor") {
      user = await Doctor.findById(userId);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid user role"
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Verify current password
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    if (userRole === "patient") {
      await User.findByIdAndUpdate(userId, { password: hashedPassword });
    } else if (userRole === "doctor") {
      await Doctor.findByIdAndUpdate(userId, { password: hashedPassword });
    }

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update password",
      error: error.message
    });
  }
};
