import { z } from "zod";

const optionalDate = z.union([z.coerce.date(), z.null()]).optional();

const eventBaseSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(20),
  eventDate: z.coerce.date(),
  eventEndDate: optionalDate,
  location: z.string().min(3),
  coverImage: z.string().url(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().optional(),
  heroTitle: z.string().min(3).optional(),
  heroSubtitle: z.string().min(10).optional()
});

const validateEventDateRange = (
  data: z.infer<typeof eventBaseSchema>,
  ctx: z.RefinementCtx
) => {
  if (data.eventEndDate && data.eventEndDate < data.eventDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["eventEndDate"],
      message: "The end date must be on or after the start date."
    });
  }
};

const validatePartialEventDateRange = (
  data: z.infer<ReturnType<typeof eventBaseSchema.partial>>,
  ctx: z.RefinementCtx
) => {
  if (data.eventDate && data.eventEndDate && data.eventEndDate < data.eventDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["eventEndDate"],
      message: "The end date must be on or after the start date."
    });
  }
};

export const eventSchema = eventBaseSchema.superRefine(validateEventDateRange);
export const eventUpdateSchema = eventBaseSchema.partial().superRefine(validatePartialEventDateRange);

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
    .default({}),
  tenure: z.string().optional()
});

export const galleryItemSchema = z.object({
  title: z.string().min(3),
  publicId: z.string().min(3),
  imageUrl: z.string().url(),
  event: z.string().optional(),
  uploadedAt: z.coerce.date().optional()
});

export const newsletterSubscriptionSchema = z.object({
  email: z.string().email(),
  source: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .optional()
});
