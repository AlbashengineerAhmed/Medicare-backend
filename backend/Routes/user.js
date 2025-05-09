import express from "express";
import {
  updateUser,
  deleteUser,
  getAllUser,
  getSingleUser,
} from "../Controllers/userController.js";

import { authenticate, restrict } from "../auth/verifyToken.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/:id", authenticate, restrict(["patient"]), getSingleUser); // Protected route
router.get("/", authenticate, restrict(["admin"]), getAllUser); // Admin route
router.put("/:id", authenticate, restrict(["patient"]), upload.single("photo"), updateUser); // Protected route with file upload
router.delete("/:id", authenticate, restrict(["patient"]), deleteUser); // Protected route

export default router;
