import { Schema, model, models } from "mongoose";

export interface INews {
  _id: string;
  title: string;
  excerpt: string;
  content?: string;
  date: Date;
  category: string;
  slug: string;
  imageUrl?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema = new Schema<INews>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    excerpt: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      trim: true
    },
    date: {
      type: Date,
      required: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    imageUrl: {
      type: String,
      trim: true
    },
    published: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const News = models?.News || model<INews>("News", NewsSchema);
