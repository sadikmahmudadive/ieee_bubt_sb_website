import "server-only";

import { Types } from "mongoose";
import { unstable_noStore as noStore } from "next/cache";

import { connectToDatabase } from "@/lib/db";
import { EventModel } from "@/models/Event";
import { GalleryItemModel } from "@/models/GalleryItem";
import { TeamMemberModel } from "@/models/TeamMember";

import type { Event } from "@/models/Event";

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

type LeanDateLike = Date | string | number | undefined | null;

type EventLean = Omit<Event, "eventDate" | "createdAt" | "updatedAt"> & {
  _id: Types.ObjectId;
  eventDate: LeanDateLike;
  createdAt: LeanDateLike;
  updatedAt: LeanDateLike;
};

const normalizeDate = (value: LeanDateLike): string => {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  return new Date().toISOString();
};

const mapEventSummary = (event: EventLean): EventSummary => ({
  _id: event._id.toString(),
  title: event.title,
  slug: event.slug,
  description: event.description,
  eventDate: normalizeDate(event.eventDate),
  location: event.location,
  coverImage: event.coverImage,
  tags: Array.isArray(event.tags) ? event.tags : [],
  featured: Boolean(event.featured)
});

const mapEventDetail = (event: EventLean): EventDetail => ({
  ...mapEventSummary(event),
  createdAt: normalizeDate(event.createdAt),
  updatedAt: normalizeDate(event.updatedAt)
});

export async function getEvents(): Promise<EventSummary[]> {
  noStore();
  await connectToDatabase();
  const events = await EventModel.find().sort({ eventDate: -1 }).limit(6).lean<EventLean[]>();
  return events.map(mapEventSummary);
}

export async function getEventBySlug(slug: string): Promise<EventDetail | null> {
  noStore();
  await connectToDatabase();
  const event = await EventModel.findOne({ slug }).lean<EventLean | null>();
  if (!event) {
    return null;
  }

  return mapEventDetail(event);
}

export async function getRecentEvents(limit = 3, excludeSlug?: string): Promise<EventSummary[]> {
  noStore();
  await connectToDatabase();
  const query = excludeSlug ? { slug: { $ne: excludeSlug } } : {};
  const events = await EventModel.find(query).sort({ eventDate: -1 }).limit(limit).lean<EventLean[]>();
  return events.map(mapEventSummary);
}

export async function getFeaturedEvent(): Promise<EventSummary | null> {
  noStore();
  await connectToDatabase();
  const event = await EventModel.findOne({ featured: true }).sort({ eventDate: -1 }).lean<EventLean | null>();
  if (!event) {
    return null;
  }
  return mapEventSummary(event);
}

export async function getTeamMembers(): Promise<TeamMemberSummary[]> {
  noStore();
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
  noStore();
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
