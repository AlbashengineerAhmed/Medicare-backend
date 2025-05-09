import express from "express";
import {
  getAllDoctors,
  updateDoctorStatus,
  getDashboardStats,
  getAllUsers,
  getAllAppointments,
  updateAppointmentStatus,
  deleteUser,
  deleteDoctor,
  deleteAppointment
} from "../Controllers/adminController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router();

// Get dashboard statistics
router.get(
  "/dashboard",
  authenticate,
  restrict(["admin"]),
  getDashboardStats
);

// Doctor routes
router.get(
  "/doctors",
  authenticate,
  restrict(["admin"]),
  getAllDoctors
);

router.put(
  "/doctors/:id/status",
  authenticate,
  restrict(["admin"]),
  updateDoctorStatus
);

router.delete(
  "/doctors/:id",
  authenticate,
  restrict(["admin"]),
  deleteDoctor
);

// User routes
router.get(
  "/users",
  authenticate,
  restrict(["admin"]),
  getAllUsers
);

router.delete(
  "/users/:id",
  authenticate,
  restrict(["admin"]),
  deleteUser
);

// Appointment routes
router.get(
  "/appointments",
  authenticate,
  restrict(["admin"]),
  getAllAppointments
);

router.put(
  "/appointments/:id/status",
  authenticate,
  restrict(["admin"]),
  updateAppointmentStatus
);

router.delete(
  "/appointments/:id",
  authenticate,
  restrict(["admin"]),
  deleteAppointment
);

export default router;
