import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import { adminDb } from "@/lib/firebase-admin";
import { groupChapterMembers } from "@/utils/teamGrouping";

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

const normalizeDate = (value: any): string => {
  if (value && typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }
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

export async function getEvents(): Promise<EventSummary[]> {
  noStore();
  const snapshot = await adminDb.collection("events").orderBy("eventDate", "desc").limit(6).get();
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      _id: doc.id,
      title: data.title,
      slug: data.slug,
      description: data.description,
      eventDate: normalizeDate(data.eventDate),
      location: data.location,
      coverImage: data.coverImage,
      tags: Array.isArray(data.tags) ? data.tags : [],
      featured: Boolean(data.featured),
      heroTitle: data.heroTitle || undefined,
      heroSubtitle: data.heroSubtitle || undefined,
    };
  });
}

export async function getEventBySlug(slug: string): Promise<EventDetail | null> {
  noStore();
  const snapshot = await adminDb.collection("events").where("slug", "==", slug).limit(1).get();
  if (snapshot.empty) {
    return null;
  }
  const doc = snapshot.docs[0];
  const data = doc.data();
  return {
    _id: doc.id,
    title: data.title,
    slug: data.slug,
    description: data.description,
    eventDate: normalizeDate(data.eventDate),
    location: data.location,
    coverImage: data.coverImage,
    tags: Array.isArray(data.tags) ? data.tags : [],
    featured: Boolean(data.featured),
    heroTitle: data.heroTitle || undefined,
    heroSubtitle: data.heroSubtitle || undefined,
    createdAt: normalizeDate(data.createdAt),
    updatedAt: normalizeDate(data.updatedAt)
  };
}

export async function getRecentEvents(limit = 3, excludeSlug?: string): Promise<EventSummary[]> {
  noStore();
  let query: any = adminDb.collection("events").orderBy("eventDate", "desc");
  const snapshot = await query.get();
  
  let events = snapshot.docs.map((doc: any) => {
    const data = doc.data();
    return {
      _id: doc.id,
      title: data.title,
      slug: data.slug,
      description: data.description,
      eventDate: normalizeDate(data.eventDate),
      location: data.location,
      coverImage: data.coverImage,
      tags: Array.isArray(data.tags) ? data.tags : [],
      featured: Boolean(data.featured),
      heroTitle: data.heroTitle || undefined,
      heroSubtitle: data.heroSubtitle || undefined,
    };
  });
  
  if (excludeSlug) {
    events = events.filter((e: any) => e.slug !== excludeSlug);
  }
  return events.slice(0, limit);
}

export async function getFeaturedEvent(): Promise<EventSummary | null> {
  noStore();
  const snapshot = await adminDb.collection("events").where("featured", "==", true).orderBy("eventDate", "desc").limit(1).get();
  if (snapshot.empty) {
    return null;
  }
  const doc = snapshot.docs[0];
  const data = doc.data();
  return {
    _id: doc.id,
    title: data.title,
    slug: data.slug,
    description: data.description,
    eventDate: normalizeDate(data.eventDate),
    location: data.location,
    coverImage: data.coverImage,
    tags: Array.isArray(data.tags) ? data.tags : [],
    featured: Boolean(data.featured),
    heroTitle: data.heroTitle || undefined,
    heroSubtitle: data.heroSubtitle || undefined,
  };
}

export async function getTeamMembers(): Promise<TeamMemberSummary[]> {
  noStore();
  const snapshot = await adminDb.collection("teamMembers").orderBy("priority", "asc").get();
  return snapshot.docs.map((doc): TeamMemberSummary => {
    const data = doc.data();
    return {
      _id: doc.id,
      name: data.name,
      role: data.role,
      bio: data.bio,
      photoUrl: data.photoUrl,
      priority: data.priority ?? 0,
      affiliation: data.affiliation ?? "main",
      chapter: data.chapter ?? undefined,
      roleKey: data.roleKey ?? undefined,
      socials: data.socials ?? {}
    };
  });
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
  const snapshot = await adminDb.collection("galleryItems").orderBy("uploadedAt", "desc").limit(limit).get();
  return snapshot.docs.map((doc): GalleryItemSummary => {
    const data = doc.data();
    return {
      _id: doc.id,
      title: data.title,
      publicId: data.publicId,
      imageUrl: data.imageUrl,
      event: data.event,
      uploadedAt: normalizeDate(data.uploadedAt)
    };
  });
}

export async function getNewsItems(limit = 3): Promise<NewsSummary[]> {
  noStore();
  const snapshot = await adminDb.collection("news").where("published", "==", true).orderBy("date", "desc").limit(limit).get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      excerpt: data.excerpt,
      date: normalizeDate(data.date),
      category: data.category,
      slug: data.slug,
      imageUrl: data.imageUrl ?? undefined
    };
  });
}
