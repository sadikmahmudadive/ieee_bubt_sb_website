import { Schema, model, models } from "mongoose";

export interface GalleryItem {
  title: string;
  publicId: string;
  imageUrl: string;
  event?: string;
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const galleryItemSchema = new Schema<GalleryItem>(
  {
    title: { type: String, required: true },
    publicId: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
    event: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

galleryItemSchema.index({ uploadedAt: -1 });

galleryItemSchema.virtual("cloudinaryTransformations").get(function (this: GalleryItem) {
  return {
    thumbnail: `${this.imageUrl}?c_fill,w_400,h_300,q_auto,f_auto`,
    full: `${this.imageUrl}?c_fill,w_1600,q_auto,f_auto`
  };
});

export const GalleryItemModel = models.GalleryItem || model<GalleryItem>("GalleryItem", galleryItemSchema);
