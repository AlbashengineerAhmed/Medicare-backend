import mongoose from "mongoose";

const DeletionRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      refPath: 'userModel',
      required: true
    },
    userModel: {
      type: String,
      required: true,
      enum: ['User', 'Doctor']
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    reason: {
      type: String,
      required: true
    },
    adminNotes: {
      type: String
    },
    resolvedBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model("DeletionRequest", DeletionRequestSchema);
