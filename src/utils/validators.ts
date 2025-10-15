import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(20),
  eventDate: z.coerce.date(),
  location: z.string().min(3),
  coverImage: z.string().url(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().optional(),
  heroTitle: z.string().min(3).optional(),
  heroSubtitle: z.string().min(10).optional()
});

export const teamMemberSchema = z.object({
  name: z.string().min(3),
  role: z.string().min(2),
  bio: z.string().optional(),
  photoUrl: z.string().url(),
  priority: z.number().int().default(0),
  affiliation: z.enum(["main", "chapter"]).default("main"),
  chapter: z.string().optional(),
  roleKey: z.string().optional(),
  socials: z
    .object({
      facebook: z.string().url().optional(),
      instagram: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      email: z.string().email().optional()
    })
    .partial()
    .default({})
});

export const galleryItemSchema = z.object({
  title: z.string().min(3),
  publicId: z.string().min(3),
  imageUrl: z.string().url(),
  event: z.string().optional(),
  uploadedAt: z.coerce.date().optional()
});
