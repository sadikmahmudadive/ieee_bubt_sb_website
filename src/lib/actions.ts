import "server-only";

import { Types } from "mongoose";
import { unstable_noStore as noStore } from "next/cache";

import { connectToDatabase } from "@/lib/db";
import { EventModel } from "@/models/Event";
import { GalleryItemModel } from "@/models/GalleryItem";
import { TeamMemberModel } from "@/models/TeamMember";
import { News } from "@/models/News";
import { groupChapterMembers } from "@/utils/teamGrouping";

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
  heroTitle?: string;
  heroSubtitle?: string;
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
  affiliation: "main" | "chapter";
  chapter?: string;
  roleKey?: string;
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

export type NewsSummary = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  slug: string;
  imageUrl?: string;
};

export type ChapterSummary = {
  name: string;
  slug: string;
  memberCount: number;
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
  featured: Boolean(event.featured),
  heroTitle: typeof event.heroTitle === "string" && event.heroTitle.trim() ? event.heroTitle : undefined,
  heroSubtitle: typeof event.heroSubtitle === "string" && event.heroSubtitle.trim() ? event.heroSubtitle : undefined
});

const mapEventDetail = (event: EventLean): EventDetail => ({
  ...mapEventSummary(event),
  createdAt: normalizeDate(event.createdAt),
  updatedAt: normalizeDate(event.updatedAt)
});

// News lean type to satisfy TS when using .lean() with Mongoose
type NewsLean = {
  _id: Types.ObjectId;
  title: string;
  excerpt: string;
  content?: string;
  date: LeanDateLike;
  category: string;
  slug: string;
  imageUrl?: string;
  published: boolean;
  createdAt: LeanDateLike;
  updatedAt: LeanDateLike;
};

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
    affiliation: member.affiliation ?? "main",
    chapter: member.chapter ?? undefined,
    roleKey: member.roleKey ?? undefined,
    socials: member.socials ?? {}
  }));
}

export async function getChapterSummaries(): Promise<ChapterSummary[]> {
  const members = await getTeamMembers();
  const groups = groupChapterMembers(members);
  return groups.map((group) => ({
    name: group.name,
    slug: group.slug,
    memberCount: group.members.length
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

export async function getNewsItems(limit = 3): Promise<NewsSummary[]> {
  noStore();
  await connectToDatabase();
  const items = await News.find({ published: true })
    .sort({ date: -1, createdAt: -1 })
    .limit(limit)
    .lean<NewsLean[]>();

  return items.map((n) => ({
    id: n._id.toString(),
    title: n.title,
    excerpt: n.excerpt,
    date: normalizeDate(n.date),
    category: n.category,
    slug: n.slug,
    imageUrl: n.imageUrl ?? undefined
  }));
}
