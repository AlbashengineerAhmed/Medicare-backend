import express from "express";
import { updatePassword } from "../Controllers/passwordController.js";
import { authenticate } from "../auth/verifyToken.js";

const router = express.Router();

// Update password route
router.put("/", authenticate, updatePassword);

export default router;
