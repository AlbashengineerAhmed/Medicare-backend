import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import { uploadImage } from "../utils/imageUpload.js";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "15d",
    }
  );
};


// register controller
export const register = async (req, res) => {
  const { email, password, name, role, gender } = req.body;
  let { photo } = req.body;

  try {
    // Process registration request

    let user = null;

    // check the user role
    if (role === "patient") {
      user = await User.findOne({ email });
    } else if (role === "doctor") {
      user = await Doctor.findOne({ email });
    }

    // check if user exist
    if (user) {
      return res.status(400).json({ success: false, message: "User already exist" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Upload photo to Cloudinary if provided
    let photoUrl = "";
    if (req.file) {
      try {
        const uploadResult = await uploadImage(req.file, role === "doctor" ? "doctors" : "patients");
        photoUrl = uploadResult.url;
      } catch (uploadError) {
        // Continue without photo if upload fails
      }
    } else if (photo) {
      photoUrl = photo;
    }

    if (role === "patient") {
      user = new User({
        name,
        email,
        password: hashPassword,
        photo: photoUrl,
        gender,
        role,
      });
    }
    if (role === "doctor") {
      user = new Doctor({
        name,
        email,
        password: hashPassword,
        photo: photoUrl,
        gender,
        role,
      });
    }
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "User successfully created" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Registration failed. Please try again.",
        error: error.message
      });
  }
};

// login controller
export const login = async(req, res) => {

    const {
        email
    } = req.body

    try {

        let user = null
        const patient = await User.findOne({email})
        const doctor = await Doctor.findOne({email})

        if(patient){
            user = patient
        }
        if(doctor){
            user = doctor
        }

        // check if user exist or not
        if(!user){
            return res.status(404).json({ message: 'User Not Found' })
        }

        // compare password
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password)

        if(!isPasswordMatch){
            return res.status(400).json({ status: false, message: 'Invalid Credentials' });
        }

        // get token
        const token = generateToken(user);
        const { password, role, appointments, ...rest } = user._doc

        res
            .status(200)
            .json({status: true, message: 'Successfully Login', token, data:{...rest}, role});

    } catch (error) {
        res.status(500).json({ status: false, message: 'Failed To Login' });
    }
  }

