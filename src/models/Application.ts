import mongoose, { Schema, models, model } from "mongoose";

export type ApplicationDocument = {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  studentId: string;
  preference?: string;
  motivation?: string;
  agree: boolean;
  createdAt: Date;
};

const ApplicationSchema = new Schema<ApplicationDocument>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    department: { type: String, required: true },
    studentId: { type: String, required: true },
    preference: { type: String },
    motivation: { type: String },
    agree: { type: Boolean, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Application = models.Application || model("Application", ApplicationSchema);
