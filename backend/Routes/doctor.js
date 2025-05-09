import express from "express";
import {
  updateDoctor,
  deleteDoctor,
  getAllDoctor,
  getSingleDoctor,
} from "../Controllers/doctorController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";
import upload from "../middleware/uploadMiddleware.js";
import { cacheMiddleware, clearCacheMiddleware } from "../middleware/cacheMiddleware.js";

import reviewRouter from "./review.js";

const router = express.Router();

router.use("/:doctorId/reviews", reviewRouter);

// Cache doctor details for 5 minutes
router.get("/:id", cacheMiddleware(300), getSingleDoctor);

// Cache all doctors list for 10 minutes
router.get("/", cacheMiddleware(600), getAllDoctor);

// Clear cache when doctor is updated
router.put("/:id",
  authenticate,
  restrict(["doctor"]),
  upload.single("photo"),
  clearCacheMiddleware("/"), // Clear all doctors cache
  updateDoctor
);

// Clear cache when doctor is deleted
router.delete("/:id",
  authenticate,
  restrict(["doctor"]),
  clearCacheMiddleware("/"), // Clear all doctors cache
  deleteDoctor
);

export default router;
