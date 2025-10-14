import { Schema, model, models } from "mongoose";

export interface Event {
  title: string;
  slug: string;
  description: string;
  eventDate: Date;
  location: string;
  coverImage: string;
  tags: string[];
  featured: boolean;
  heroTitle?: string;
  heroSubtitle?: string;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<Event>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    eventDate: { type: Date, required: true },
    location: { type: String, required: true },
    coverImage: { type: String, required: true },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
    heroTitle: { type: String },
    heroSubtitle: { type: String }
  },
  { timestamps: true }
);

eventSchema.index({ featured: 1, eventDate: -1 });

export const EventModel = models.Event || model<Event>("Event", eventSchema);
