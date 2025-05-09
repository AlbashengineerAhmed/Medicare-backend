import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    fee: { 
      type: Number, 
      required: true 
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    symptoms: {
      type: String,
    },
    medicalHistory: {
      type: String,
    },
    prescription: {
      type: String,
    },
    notes: {
      type: String,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "insurance"],
      default: "cash",
    },
    paymentId: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
