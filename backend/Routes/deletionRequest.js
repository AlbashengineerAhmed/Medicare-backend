import express from "express";
import {
  createDeletionRequest,
  getDeletionRequestStatus,
  getAllDeletionRequests,
  processDeletionRequest
} from "../Controllers/deletionRequestController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router();

// Create a deletion request
router.post(
  "/",
  authenticate,
  restrict(["patient", "doctor"]),
  createDeletionRequest
);

// Get deletion request status for a user
router.get(
  "/status",
  authenticate,
  restrict(["patient", "doctor"]),
  getDeletionRequestStatus
);

// Admin: Get all deletion requests
router.get(
  "/",
  authenticate,
  restrict(["admin"]),
  getAllDeletionRequests
);

// Admin: Process a deletion request (approve or reject)
router.put(
  "/:id",
  authenticate,
  restrict(["admin"]),
  processDeletionRequest
);

export default router;
