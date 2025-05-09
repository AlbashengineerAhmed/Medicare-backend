import express from "express";
import {
  getAllReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview
} from "../Controllers/reviewController.js";
import { authenticate, restrict } from "./../auth/verifyToken.js";

const router = express.Router({ mergeParams: true });

// Routes for /api/v1/reviews or /api/v1/doctors/:doctorId/reviews
router
  .route("/")
  .get(getAllReviews)
  .post(authenticate, restrict(["patient"]), createReview);

// Routes for /api/v1/reviews/:id or /api/v1/doctors/:doctorId/reviews/:id
router
  .route("/:id")
  .get(getReview)
  .put(authenticate, restrict(["patient"]), updateReview)
  .delete(authenticate, restrict(["patient", "admin"]), deleteReview);

export default router;
