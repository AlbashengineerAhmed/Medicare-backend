import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import { uploadImage } from "../utils/imageUpload.js";

/**
 * Generate JWT token
 * @param {Object} user - User object
 * @returns {string} - JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "15d",
    }
  );
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {File} photo - User photo
 * @returns {Promise<Object>} - Registration result
 */
export const register = async (userData, photo) => {
  try {
    const { email, password, name, role, gender } = userData;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    const doctorExists = await Doctor.findOne({ email });
    
    if (userExists || doctorExists) {
      return {
        success: false,
        message: "User already exists",
        statusCode: 400
      };
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    
    // Upload photo if provided
    let photoUrl = null;
    if (photo) {
      const uploadResult = await uploadImage(photo);
      photoUrl = uploadResult.url;
    }
    
    // Create user based on role
    let user;
    if (role === "patient") {
      user = new User({
        name,
        email,
        password: hashPassword,
        photo: photoUrl,
        gender,
        role,
      });
    } else if (role === "doctor") {
      user = new Doctor({
        name,
        email,
        password: hashPassword,
        photo: photoUrl,
        gender,
        role,
      });
    } else {
      return {
        success: false,
        message: "Invalid role",
        statusCode: 400
      };
    }
    
    // Save user
    await user.save();
    
    return {
      success: true,
      message: "User successfully created",
      statusCode: 201
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Registration failed. Please try again.",
      error: error.message,
      statusCode: 500
    };
  }
};

/**
 * Login a user
 * @param {Object} credentials - User login credentials
 * @returns {Promise<Object>} - Login result
 */
export const login = async (credentials) => {
  try {
    const { email, password } = credentials;
    
    // Find user
    let user = null;
    const patient = await User.findOne({ email });
    const doctor = await Doctor.findOne({ email });
    
    if (patient) {
      user = patient;
    } else if (doctor) {
      user = doctor;
    } else {
      return {
        success: false,
        message: "User not found",
        statusCode: 404
      };
    }
    
    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    
    if (!isPasswordMatch) {
      return {
        success: false,
        message: "Invalid credentials",
        statusCode: 400
      };
    }
    
    // Generate token
    const token = generateToken(user);
    
    // Remove sensitive data
    const { password: pwd, role, appointments, ...rest } = user._doc;
    
    return {
      success: true,
      message: "Login successful",
      token,
      data: rest,
      role: user.role,
      statusCode: 200
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Login failed. Please try again.",
      error: error.message,
      statusCode: 500
    };
  }
};
