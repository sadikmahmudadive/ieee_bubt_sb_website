import "server-only";

import { connectToDatabase } from "@/lib/db";
import { EventModel } from "@/models/Event";
import { GalleryItemModel } from "@/models/GalleryItem";
import { TeamMemberModel } from "@/models/TeamMember";

export type EventSummary = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  eventDate: string;
  location: string;
  coverImage: string;
  tags: string[];
  featured: boolean;
};

export type EventDetail = EventSummary & {
  createdAt: string;
  updatedAt: string;
};

export type TeamMemberSummary = {
  _id: string;
  name: string;
  role: string;
  bio?: string;
  photoUrl: string;
  priority: number;
  socials: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    email?: string;
  };
};

export type GalleryItemSummary = {
  _id: string;
  title: string;
  publicId: string;
  imageUrl: string;
  event?: string;
  uploadedAt: string;
};

export async function getEvents(): Promise<EventSummary[]> {
  await connectToDatabase();
  const events = await EventModel.find().sort({ eventDate: -1 }).limit(6).exec();
  return events.map((event): EventSummary => ({
    _id: event._id.toString(),
    title: event.title,
    slug: event.slug,
    description: event.description,
    eventDate: event.eventDate instanceof Date ? event.eventDate.toISOString() : String(event.eventDate),
    location: event.location,
    coverImage: event.coverImage,
    tags: event.tags ?? [],
    featured: Boolean(event.featured)
  }));
}

export async function getEventBySlug(slug: string): Promise<EventDetail | null> {
  await connectToDatabase();
  const event = await EventModel.findOne({ slug }).lean();
  if (!event) {
    return null;
  }

  const normalizeDate = (value: unknown): string => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (typeof value === "string" || typeof value === "number") {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) {
        return date.toISOString();
      }
    }
    return new Date().toISOString();
  };

  return {
    _id: event._id.toString(),
    title: event.title,
    slug: event.slug,
    description: event.description,
    eventDate: normalizeDate(event.eventDate),
    location: event.location,
    coverImage: event.coverImage,
    tags: event.tags ?? [],
    featured: Boolean(event.featured),
    createdAt: normalizeDate(event.createdAt),
    updatedAt: normalizeDate(event.updatedAt)
  };
}

export async function getRecentEvents(limit = 3, excludeSlug?: string): Promise<EventSummary[]> {
  await connectToDatabase();
  const query = excludeSlug ? { slug: { $ne: excludeSlug } } : {};
  const events = await EventModel.find(query).sort({ eventDate: -1 }).limit(limit).exec();
  return events.map((event): EventSummary => ({
    _id: event._id.toString(),
    title: event.title,
    slug: event.slug,
    description: event.description,
    eventDate: event.eventDate instanceof Date ? event.eventDate.toISOString() : String(event.eventDate),
    location: event.location,
    coverImage: event.coverImage,
    tags: event.tags ?? [],
    featured: Boolean(event.featured)
  }));
}

export async function getFeaturedEvent(): Promise<EventSummary | null> {
  await connectToDatabase();
  const event = await EventModel.findOne({ featured: true }).sort({ eventDate: -1 }).exec();
  if (!event) {
    return null;
  }
  return {
    _id: event._id.toString(),
    title: event.title,
    slug: event.slug,
    description: event.description,
    eventDate: event.eventDate instanceof Date ? event.eventDate.toISOString() : String(event.eventDate),
    location: event.location,
    coverImage: event.coverImage,
    tags: event.tags ?? [],
    featured: Boolean(event.featured)
  };
}

export async function getTeamMembers(): Promise<TeamMemberSummary[]> {
  await connectToDatabase();
  const members = await TeamMemberModel.find().sort({ priority: -1 }).exec();
  return members.map((member): TeamMemberSummary => ({
    _id: member._id.toString(),
    name: member.name,
    role: member.role,
    bio: member.bio,
    photoUrl: member.photoUrl,
    priority: member.priority ?? 0,
    socials: member.socials ?? {}
  }));
}

export async function getGalleryItems(limit = 12): Promise<GalleryItemSummary[]> {
  await connectToDatabase();
  const items = await GalleryItemModel.find().sort({ uploadedAt: -1 }).limit(limit).exec();
  return items.map((item): GalleryItemSummary => ({
    _id: item._id.toString(),
    title: item.title,
    publicId: item.publicId,
    imageUrl: item.imageUrl,
    event: item.event,
    uploadedAt: item.uploadedAt instanceof Date ? item.uploadedAt.toISOString() : String(item.uploadedAt)
  }));
}
