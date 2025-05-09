import express from "express";
import {
  createAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  updateAppointmentStatus,
  deleteAppointment
} from "../Controllers/appointmentController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router();

// Create a new appointment
router.post(
  "/",
  authenticate,
  restrict(["patient"]),
  createAppointment
);

// Get all appointments for a doctor
router.get(
  "/doctor/:doctorId",
  authenticate,
  restrict(["doctor"]),
  getDoctorAppointments
);

// Get all appointments for a patient
router.get(
  "/patient",
  authenticate,
  restrict(["patient"]),
  getPatientAppointments
);

// Update appointment status
router.put(
  "/:id/status",
  authenticate,
  restrict(["doctor", "admin"]),
  updateAppointmentStatus
);

// Delete appointment
router.delete(
  "/:id",
  authenticate,
  restrict(["patient", "doctor", "admin"]),
  deleteAppointment
);

export default router;
