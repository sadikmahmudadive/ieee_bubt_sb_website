import { Schema, model, models } from "mongoose";

export interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  photoUrl: string;
  priority: number;
  affiliation: "main" | "chapter";
  chapter?: string;
  roleKey?: string;
  socials: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    email?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const teamMemberSchema = new Schema<TeamMember>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String },
    photoUrl: { type: String, required: true },
    priority: { type: Number, default: 0 },
    affiliation: { type: String, enum: ["main", "chapter"], default: "main" },
    chapter: { type: String },
    roleKey: { type: String },
    socials: {
      facebook: { type: String },
      instagram: { type: String },
      linkedin: { type: String },
      email: { type: String }
    }
  },
  { timestamps: true }
);

teamMemberSchema.index({ priority: -1, name: 1 });

export const TeamMemberModel = models.TeamMember || model<TeamMember>("TeamMember", teamMemberSchema);
