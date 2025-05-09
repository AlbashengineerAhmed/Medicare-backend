import Appointment from "../models/AppointmentSchema.js";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";

// Create a new appointment
export const createAppointment = async (req, res) => {
  const { doctor, appointmentDate, timeSlot, symptoms, medicalHistory } = req.body;
  const patient = req.userId; // From auth middleware

  try {
    // Find doctor to get fee
    const doctorData = await Doctor.findById(doctor);
    if (!doctorData) {
      return res.status(404).json({ 
        success: false, 
        message: "Doctor not found" 
      });
    }

    // Check if the time slot is available
    const existingAppointment = await Appointment.findOne({
      doctor,
      appointmentDate,
      timeSlot,
      status: { $in: ["pending", "confirmed"] }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked"
      });
    }

    // Create new appointment
    const newAppointment = new Appointment({
      doctor,
      patient,
      appointmentDate,
      timeSlot,
      fee: doctorData.ticketPrice,
      symptoms,
      medicalHistory
    });

    // Save appointment
    const savedAppointment = await newAppointment.save();

    // Update doctor's appointments array
    await Doctor.findByIdAndUpdate(doctor, {
      $push: { appointments: savedAppointment._id }
    });

    // Update user's appointments array
    await User.findByIdAndUpdate(patient, {
      $push: { appointments: savedAppointment._id }
    });

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: savedAppointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create appointment",
      error: error.message
    });
  }
};

// Get all appointments for a doctor
export const getDoctorAppointments = async (req, res) => {
  const doctorId = req.params.doctorId;

  try {
    const appointments = await Appointment.find({ doctor: doctorId })
      .populate("patient", "name email phone photo")
      .sort({ appointmentDate: -1 });

    res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
      error: error.message
    });
  }
};

// Get all appointments for a patient
export const getPatientAppointments = async (req, res) => {
  const patientId = req.userId; // From auth middleware

  try {
    const appointments = await Appointment.find({ patient: patientId })
      .populate("doctor", "name email phone photo specialization")
      .sort({ appointmentDate: -1 });

    res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
      error: error.message
    });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      data: updatedAppointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update appointment status",
      error: error.message
    });
  }
};

// Delete appointment
export const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // Remove appointment from doctor's appointments array
    await Doctor.findByIdAndUpdate(appointment.doctor, {
      $pull: { appointments: id }
    });

    // Remove appointment from user's appointments array
    await User.findByIdAndUpdate(appointment.patient, {
      $pull: { appointments: id }
    });

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
