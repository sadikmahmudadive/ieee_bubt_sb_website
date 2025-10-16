import { Schema, model, models } from "mongoose";

export interface Subscription {
  email: string;
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<Subscription>(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    source: { type: String, trim: true }
  },
  { timestamps: true }
);

subscriptionSchema.index({ email: 1 }, { unique: true });

export const SubscriptionModel = models.Subscription || model<Subscription>("Subscription", subscriptionSchema);
