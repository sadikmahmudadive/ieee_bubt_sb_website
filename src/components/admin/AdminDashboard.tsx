"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
// import Link from "next/link"; // Not used currently
import { useRouter } from "next/navigation";
import Image from "next/image";
import useSWR from "swr";

import { chapterFallbackName, groupChapterMembers } from "@/utils/teamGrouping";
import type { ChapterGroup } from "@/utils/teamGrouping";

export type AdminDashboardProps = {
  adminUsername: string;
};

type EventRecord = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  eventDate: string;
  location: string;
  coverImage: string;
  tags?: string[];
  featured?: boolean;
  heroTitle?: string;
  heroSubtitle?: string;
};

type EventFormState = {
  title: string;
  slug: string;
  description: string;
  eventDate: string;
  location: string;
  coverImage: string;
  tags: string;
  featured: boolean;
  heroTitle: string;
  heroSubtitle: string;
};

type TeamRecord = {
  _id: string;
  name: string;
  role: string;
  bio?: string;
  photoUrl: string;
  priority?: number;
  affiliation?: "main" | "chapter";
  chapter?: string;
  roleKey?: string;
  socials?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    email?: string;
  };
};

type TeamFormState = {
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  priority: string;
  affiliation: "main" | "chapter";
  chapter: string;
  roleKey: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  email: string;
};

type GalleryRecord = {
  _id: string;
  title: string;
  imageUrl: string;
  publicId: string;
  event?: string;
  uploadedAt?: string;
};

type SubscriptionRecord = {
  _id: string;
  email: string;
  source?: string | null;
  createdAt: string;
};

type NewsRecord = {
  _id: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  category: string;
  slug: string;
  imageUrl?: string;
  published: boolean;
};

type NewsFormState = {
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  slug: string;
  imageUrl: string;
  published: boolean;
};

type AdminTab = "events" | "team" | "chapters" | "gallery" | "subscribers" | "news";

const chapterNameOptions = [
  "IEEE Computer Society Student Branch Chapter",
  "IEEE Robotics and Automation Society Student Branch Chapter",
  "IEEE Photonics Society Student Branch Chapter",
  "IEEE Power and Energy Society Student Branch Chapter",
  "IEEE Systems Council Student Branch Chapter",
  "IEEE Power Electronics Society Student Branch Chapter",
  "IEEE BUBT Women in Engineering Student Branch Affinity Group"
];

const roleKeyOptions = [
  { value: "none", label: "Not spotlighted on homepage" },
  { value: "chief-advisor", label: "Chief Advisor (Main Branch)" },
  { value: "executive-advisor", label: "Executive Advisor (Main Branch)" },
  { value: "advisor", label: "Advisor (Main Branch)" },
  { value: "counselor", label: "Branch Counselor" },
  { value: "chairperson", label: "Chairperson" },
  { value: "vice-chairperson", label: "Vice Chairperson" },
  { value: "general-secretary", label: "General Secretary" },
  { value: "joint-general-secretary", label: "Joint General Secretary" },
  { value: "treasurer", label: "Treasurer" },
  { value: "webmaster", label: "Web Master" },
  { value: "chapter-advisor", label: "Chapter Advisor" },
  { value: "chapter-co-advisor", label: "Chapter Co-Advisor" },
  { value: "chapter-chair", label: "Chapter Chair" },
  { value: "chapter-vice-chair", label: "Chapter Vice Chair" },
  { value: "chapter-secretary", label: "Chapter Secretary" },
  { value: "chapter-joint-secretary", label: "Chapter Joint Secretary" },
  { value: "chapter-treasurer", label: "Chapter Treasurer" },
  { value: "chapter-webmaster", label: "Chapter Web Master" },
  { value: "chapter-committee", label: "Chapter Committee Member" }
];

const roleKeyLabelMap = roleKeyOptions.reduce<Record<string, string>>((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});

const fetcher = async <T,>(url: string): Promise<T> => {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }
  return response.json();
};

type UploadSignaturePayload = {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
};

export function AdminDashboard({ adminUsername }: AdminDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("events");

  const uploadImage = useCallback(
    async (file: File, target: "events" | "team" | "gallery" | "news") => {
      const signatureResponse = await fetch("/api/uploads/signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: target })
      });

      if (!signatureResponse.ok) {
        const body = await signatureResponse.json().catch(() => ({ error: "Unable to request upload signature." }));
        throw new Error(body.error ?? "Unable to request upload signature.");
      }

      const payload = (await signatureResponse.json()) as UploadSignaturePayload;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("timestamp", String(payload.timestamp));
      formData.append("signature", payload.signature);
      formData.append("api_key", payload.apiKey);
      formData.append("folder", payload.folder);

      const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${payload.cloudName}/auto/upload`, {
        method: "POST",
        body: formData
      });

      if (!uploadResponse.ok) {
        const errorBody = await uploadResponse.json().catch(() => ({ error: "Cloudinary upload failed." }));
        throw new Error(errorBody.error ?? "Cloudinary upload failed.");
      }

      const uploadJson = await uploadResponse.json();
      return {
        secureUrl: uploadJson.secure_url as string,
        publicId: uploadJson.public_id as string
      };
    },
    []
  );

  const {
    data: events,
    isLoading: isEventsLoading,
    mutate: mutateEvents
  } = useSWR<EventRecord[]>("/api/events", fetcher, { revalidateOnFocus: false });

  const {
    data: team,
    isLoading: isTeamLoading,
    mutate: mutateTeam
  } = useSWR<TeamRecord[]>("/api/team", fetcher, { revalidateOnFocus: false });

  const chapterEntries = useMemo<ChapterGroup<TeamRecord>[]>(() => {
    if (!team || team.length === 0) {
      return [];
    }
    return groupChapterMembers<TeamRecord>(team);
  }, [team]);

  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  useEffect(() => {
    if (chapterEntries.length === 0) {
      setSelectedChapter(null);
      return;
    }
    setSelectedChapter((previous) => {
      if (previous && chapterEntries.some((entry) => entry.name === previous)) {
        return previous;
      }
      return chapterEntries[0].name;
    });
  }, [chapterEntries]);

  const selectedChapterEntry = selectedChapter
    ? chapterEntries.find((entry) => entry.name === selectedChapter) ?? null
    : null;
  const fallbackChapterEntry = chapterEntries.find((entry) => entry.name === chapterFallbackName) ?? null;

  const {
    data: gallery,
    isLoading: isGalleryLoading,
    mutate: mutateGallery
  } = useSWR<GalleryRecord[]>("/api/gallery", fetcher, { revalidateOnFocus: false });

  const {
    data: subscribers,
    isLoading: isSubscribersLoading,
    mutate: mutateSubscribers
  } = useSWR<SubscriptionRecord[]>("/api/subscriptions", fetcher, { revalidateOnFocus: false });

  const {
    data: news,
    isLoading: isNewsLoading,
    mutate: mutateNews
  } = useSWR<NewsRecord[]>("/api/news", fetcher, { revalidateOnFocus: false });

  function createInitialEventForm(): EventFormState {
    return {
      title: "",
      slug: "",
      description: "",
      eventDate: "",
      location: "",
      coverImage: "",
      tags: "",
      featured: false,
      heroTitle: "",
      heroSubtitle: ""
    };
  }

  const [eventForm, setEventForm] = useState<EventFormState>(createInitialEventForm);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const isEditingEvent = Boolean(editingEventId);
  const [eventFeedback, setEventFeedback] = useState<string | null>(null);
  const [eventError, setEventError] = useState<string | null>(null);
  const [eventSubmitting, setEventSubmitting] = useState(false);

  function createInitialTeamForm(): TeamFormState {
    return {
      name: "",
      role: "",
      bio: "",
      photoUrl: "",
      priority: "999",
      affiliation: "main",
      chapter: "",
      roleKey: "none",
      facebook: "",
      instagram: "",
      linkedin: "",
      email: ""
    };
  }

  const [teamForm, setTeamForm] = useState<TeamFormState>(createInitialTeamForm());
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const isEditingTeam = Boolean(editingTeamId);
  const [teamFeedback, setTeamFeedback] = useState<string | null>(null);
  const [teamError, setTeamError] = useState<string | null>(null);
  const [teamSubmitting, setTeamSubmitting] = useState(false);

  const [galleryForm, setGalleryForm] = useState({
    title: "",
    publicId: "",
    imageUrl: "",
    event: "",
    uploadedAt: ""
  });
  const [galleryFeedback, setGalleryFeedback] = useState<string | null>(null);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [gallerySubmitting, setGallerySubmitting] = useState(false);

  function createInitialNewsForm(): NewsFormState {
    return {
      title: "",
      excerpt: "",
      content: "",
      date: "",
      category: "",
      slug: "",
      imageUrl: "",
      published: false
    };
  }

  const [newsForm, setNewsForm] = useState<NewsFormState>(createInitialNewsForm());
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const isEditingNews = Boolean(editingNewsId);
  const [newsFeedback, setNewsFeedback] = useState<string | null>(null);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [newsSubmitting, setNewsSubmitting] = useState(false);

  const [subscriberFeedback, setSubscriberFeedback] = useState<string | null>(null);
  const [subscriberError, setSubscriberError] = useState<string | null>(null);
  const [subscriberDeletingId, setSubscriberDeletingId] = useState<string | null>(null);

  const [eventUploadLoading, setEventUploadLoading] = useState(false);
  const [eventUploadError, setEventUploadError] = useState<string | null>(null);
  const [teamUploadLoading, setTeamUploadLoading] = useState(false);
  const [teamUploadError, setTeamUploadError] = useState<string | null>(null);
  const [galleryUploadLoading, setGalleryUploadLoading] = useState(false);
  const [galleryUploadError, setGalleryUploadError] = useState<string | null>(null);
  const [newsUploadLoading, setNewsUploadLoading] = useState(false);
  const [newsUploadError, setNewsUploadError] = useState<string | null>(null);

  const toInputDate = (value: string): string => {
    if (!value) {
      return "";
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return "";
    }
    return parsed.toISOString().slice(0, 10);
  };

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login?from=logout");
    router.refresh();
  }

  async function handleEventImageSelection(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setEventUploadLoading(true);
    setEventUploadError(null);
    try {
      const upload = await uploadImage(file, "events");
      setEventForm((prev) => ({ ...prev, coverImage: upload.secureUrl }));
    } catch (error) {
      setEventUploadError(error instanceof Error ? error.message : "Failed to upload cover image.");
    } finally {
      setEventUploadLoading(false);
      event.target.value = "";
    }
  }

  async function handleTeamPhotoSelection(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setTeamUploadLoading(true);
    setTeamUploadError(null);
    try {
      const upload = await uploadImage(file, "team");
      setTeamForm((prev) => ({ ...prev, photoUrl: upload.secureUrl }));
    } catch (error) {
      setTeamUploadError(error instanceof Error ? error.message : "Failed to upload team photo.");
    } finally {
      setTeamUploadLoading(false);
      event.target.value = "";
    }
  }

  async function handleGalleryImageSelection(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setGalleryUploadLoading(true);
    setGalleryUploadError(null);
    try {
      const upload = await uploadImage(file, "gallery");
      setGalleryForm((prev) => ({ ...prev, imageUrl: upload.secureUrl, publicId: upload.publicId }));
    } catch (error) {
      setGalleryUploadError(error instanceof Error ? error.message : "Failed to upload gallery image.");
    } finally {
      setGalleryUploadLoading(false);
      event.target.value = "";
    }
  }

  async function handleNewsImageSelection(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setNewsUploadLoading(true);
    setNewsUploadError(null);
    try {
      const upload = await uploadImage(file, "news");
      setNewsForm((prev) => ({ ...prev, imageUrl: upload.secureUrl }));
    } catch (error) {
      setNewsUploadError(error instanceof Error ? error.message : "Failed to upload news image.");
    } finally {
      setNewsUploadLoading(false);
      event.target.value = "";
    }
  }

  async function handleSubmitEvent(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    setEventSubmitting(true);
    setEventFeedback(null);
    setEventError(null);

    if (!eventForm.coverImage) {
      setEventError("Upload a cover image before saving the event.");
      setEventSubmitting(false);
      return;
    }

    const heroTitle = eventForm.heroTitle.trim();
    const heroSubtitle = eventForm.heroSubtitle.trim();

    const payload = {
      title: eventForm.title,
      slug: eventForm.slug,
      description: eventForm.description,
      eventDate: eventForm.eventDate,
      location: eventForm.location,
      coverImage: eventForm.coverImage,
      tags: eventForm.tags
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      featured: eventForm.featured,
      heroTitle: heroTitle || undefined,
      heroSubtitle: heroSubtitle || undefined
    };

    const isEdit = Boolean(editingEventId);
    const endpoint = isEdit ? `/api/events/${editingEventId}` : "/api/events";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: isEdit ? "Failed to update event." : "Failed to create event." }));
        throw new Error(body.error ?? (isEdit ? "Failed to update event." : "Failed to create event."));
      }

      setEventFeedback(isEdit ? "Event updated successfully." : "Event created successfully.");
      setEventForm(createInitialEventForm());
      setEditingEventId(null);
      setEventUploadError(null);
      setEventUploadLoading(false);
      await mutateEvents();
    } catch (error) {
      setEventError(
        error instanceof Error
          ? error.message
          : isEdit
            ? "Unable to update event."
            : "Unable to create event."
      );
    } finally {
      setEventSubmitting(false);
    }
  }

  function startEventEdit(record: EventRecord) {
    setEditingEventId(record._id);
    setEventForm({
      title: record.title,
      slug: record.slug,
      description: record.description,
      eventDate: toInputDate(record.eventDate),
      location: record.location,
      coverImage: record.coverImage,
      tags: record.tags?.join(", ") ?? "",
      featured: Boolean(record.featured),
      heroTitle: record.heroTitle ?? "",
      heroSubtitle: record.heroSubtitle ?? ""
    });
    setEventFeedback(null);
    setEventError(null);
    setEventUploadError(null);
  }

  function cancelEventEdit() {
    setEditingEventId(null);
    setEventForm(createInitialEventForm());
    setEventFeedback(null);
    setEventError(null);
    setEventUploadError(null);
    setEventUploadLoading(false);
  }

  async function handleDeleteEvent(id: string) {
    try {
      const response = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Failed to delete event." }));
        throw new Error(body.error ?? "Failed to delete event.");
      }
      if (editingEventId === id) {
        cancelEventEdit();
      }
      setEventFeedback("Event deleted.");
      await mutateEvents();
    } catch (error) {
      setEventError(error instanceof Error ? error.message : "Unable to delete event.");
    }
  }

  async function handleToggleFeatured(id: string, current: boolean) {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !current })
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Failed to update event." }));
        throw new Error(body.error ?? "Failed to update event.");
      }
      if (editingEventId === id) {
        setEventForm((prev) => ({ ...prev, featured: !current }));
      }
      await mutateEvents();
    } catch (error) {
      setEventError(error instanceof Error ? error.message : "Unable to update event.");
    }
  }

  async function handleSubmitTeamMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTeamSubmitting(true);
    setTeamFeedback(null);
    setTeamError(null);

    if (!teamForm.photoUrl) {
      setTeamError("Upload a profile photo before saving the team member.");
      setTeamSubmitting(false);
      return;
    }

    const payload = {
      name: teamForm.name,
      role: teamForm.role,
      bio: teamForm.bio || undefined,
      photoUrl: teamForm.photoUrl,
      priority: teamForm.priority ? Number(teamForm.priority) : 9999,
      affiliation: teamForm.affiliation,
      chapter:
        teamForm.affiliation === "chapter" ? teamForm.chapter.trim() || undefined : undefined,
      roleKey: teamForm.roleKey !== "none" ? teamForm.roleKey : undefined,
      socials: {
        facebook: teamForm.facebook || undefined,
        instagram: teamForm.instagram || undefined,
        linkedin: teamForm.linkedin || undefined,
        email: teamForm.email || undefined
      }
    };

    try {
      const endpoint = editingTeamId ? `/api/team/${editingTeamId}` : "/api/team";
      const method = editingTeamId ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Failed to save team member." }));
        throw new Error(body.error ?? "Failed to save team member.");
      }

      setTeamFeedback(editingTeamId ? "Team member updated." : "Team member added.");
      setTeamForm(createInitialTeamForm());
      setEditingTeamId(null);
      setTeamUploadError(null);
      setTeamUploadLoading(false);
      await mutateTeam();
    } catch (error) {
      setTeamError(error instanceof Error ? error.message : "Unable to save team member.");
    } finally {
      setTeamSubmitting(false);
    }
  }

  function startTeamEdit(member: TeamRecord) {
    setEditingTeamId(member._id);
    setTeamForm({
      name: member.name,
      role: member.role,
      bio: member.bio ?? "",
      photoUrl: member.photoUrl,
      priority: String(member.priority ?? 9999),
      affiliation: member.affiliation ?? "main",
      chapter: member.chapter ?? "",
      roleKey: member.roleKey ?? "none",
      facebook: member.socials?.facebook ?? "",
      instagram: member.socials?.instagram ?? "",
      linkedin: member.socials?.linkedin ?? "",
      email: member.socials?.email ?? ""
    });
    setTeamFeedback(null);
    setTeamError(null);
  }

  function cancelTeamEdit() {
    setEditingTeamId(null);
    setTeamForm(createInitialTeamForm());
    setTeamFeedback(null);
    setTeamError(null);
    setTeamUploadError(null);
    setTeamUploadLoading(false);
  }

  async function handleDeleteTeamMember(id: string) {
    try {
      const response = await fetch(`/api/team/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Failed to delete team member." }));
        throw new Error(body.error ?? "Failed to delete team member.");
      }
      await mutateTeam();
    } catch (error) {
      setTeamError(error instanceof Error ? error.message : "Unable to delete team member.");
    }
  }

  async function handleCreateGalleryItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGallerySubmitting(true);
    setGalleryFeedback(null);
    setGalleryError(null);

    if (!galleryForm.imageUrl || !galleryForm.publicId) {
      setGalleryError("Upload an image before adding to the gallery.");
      setGallerySubmitting(false);
      return;
    }

    const payload = {
      title: galleryForm.title,
      publicId: galleryForm.publicId,
      imageUrl: galleryForm.imageUrl,
      event: galleryForm.event || undefined,
      uploadedAt: galleryForm.uploadedAt || undefined
    };

    try {
      const response = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Failed to create gallery item." }));
        throw new Error(body.error ?? "Failed to create gallery item.");
      }

      setGalleryFeedback("Gallery item added.");
      setGalleryForm({ title: "", publicId: "", imageUrl: "", event: "", uploadedAt: "" });
      await mutateGallery();
    } catch (error) {
      setGalleryError(error instanceof Error ? error.message : "Unable to create gallery item.");
    } finally {
      setGallerySubmitting(false);
    }
  }

  async function handleDeleteGalleryItem(id: string) {
    try {
      const response = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Failed to delete gallery item." }));
        throw new Error(body.error ?? "Failed to delete gallery item.");
      }
      await mutateGallery();
    } catch (error) {
      setGalleryError(error instanceof Error ? error.message : "Unable to delete gallery item.");
    }
  }

  async function handleSubmitNews(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    setNewsSubmitting(true);
    setNewsFeedback(null);
    setNewsError(null);

    const payload = {
      title: newsForm.title,
      excerpt: newsForm.excerpt,
      content: newsForm.content || undefined,
      date: newsForm.date,
      category: newsForm.category,
      slug: newsForm.slug,
      imageUrl: newsForm.imageUrl || undefined,
      published: newsForm.published
    };

    const isEdit = Boolean(editingNewsId);
    const endpoint = isEdit ? `/api/news/${editingNewsId}` : "/api/news";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: isEdit ? "Failed to update news." : "Failed to create news." }));
        throw new Error(body.error ?? (isEdit ? "Failed to update news." : "Failed to create news."));
      }

      setNewsFeedback(isEdit ? "News updated successfully." : "News created successfully.");
      setNewsForm(createInitialNewsForm());
      setEditingNewsId(null);
      setNewsUploadError(null);
      setNewsUploadLoading(false);
      await mutateNews();
    } catch (error) {
      setNewsError(
        error instanceof Error
          ? error.message
          : isEdit
            ? "Unable to update news."
            : "Unable to create news."
      );
    } finally {
      setNewsSubmitting(false);
    }
  }

  function startNewsEdit(record: NewsRecord) {
    setEditingNewsId(record._id);
    setNewsForm({
      title: record.title,
      excerpt: record.excerpt,
      content: record.content ?? "",
      date: toInputDate(record.date),
      category: record.category,
      slug: record.slug,
      imageUrl: record.imageUrl ?? "",
      published: Boolean(record.published)
    });
    setNewsFeedback(null);
    setNewsError(null);
    setNewsUploadError(null);
  }

  function cancelNewsEdit() {
    setEditingNewsId(null);
    setNewsForm(createInitialNewsForm());
    setNewsFeedback(null);
    setNewsError(null);
    setNewsUploadError(null);
    setNewsUploadLoading(false);
  }

  async function handleDeleteNews(id: string) {
    try {
      const response = await fetch(`/api/news/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Failed to delete news." }));
        throw new Error(body.error ?? "Failed to delete news.");
      }
      if (editingNewsId === id) {
        cancelNewsEdit();
      }
      setNewsFeedback("News deleted.");
      await mutateNews();
    } catch (error) {
      setNewsError(error instanceof Error ? error.message : "Unable to delete news.");
    }
  }

  async function handleTogglePublished(id: string, current: boolean) {
    try {
      const response = await fetch(`/api/news/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !current })
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Failed to update news." }));
        throw new Error(body.error ?? "Failed to update news.");
      }
      if (editingNewsId === id) {
        setNewsForm((prev) => ({ ...prev, published: !current }));
      }
      await mutateNews();
    } catch (error) {
      setNewsError(error instanceof Error ? error.message : "Unable to update news.");
    }
  }

  async function handleDeleteSubscriber(id: string) {
    setSubscriberFeedback(null);
    setSubscriberError(null);
    setSubscriberDeletingId(id);
    try {
      const response = await fetch(`/api/subscriptions/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: "Failed to delete subscriber." }));
        throw new Error(body.error ?? "Failed to delete subscriber.");
      }
      await mutateSubscribers();
      setSubscriberFeedback("Subscriber removed.");
    } catch (error) {
      setSubscriberError(error instanceof Error ? error.message : "Unable to delete subscriber.");
    } finally {
      setSubscriberDeletingId(null);
    }
  }

  async function handleCopySubscribers() {
    setSubscriberFeedback(null);
    setSubscriberError(null);
    if (!subscribers || subscribers.length === 0) {
      setSubscriberFeedback("No subscribers to copy yet.");
      return;
    }

    const emailList = subscribers.map((entry) => entry.email).join(", ");

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(emailList);
      } else if (typeof document !== "undefined") {
        const textarea = document.createElement("textarea");
        textarea.value = emailList;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      } else {
        throw new Error("Clipboard API unavailable.");
      }

      setSubscriberFeedback("Subscriber emails copied to clipboard.");
    } catch (error) {
      console.error(error);
      setSubscriberError("Clipboard copy failed. Select the list and copy manually.");
    }
  }

  const subscriberCount = subscribers?.length ?? 0;

  return (
    <div className="space-y-10 text-slate-900">
      <header className="flex flex-col gap-4 border border-slate-200 bg-white p-8 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-primary">Admin Console</p>
          <h1 className="heading-font mt-2 text-2xl font-semibold text-slate-900">Welcome back, {adminUsername}</h1>
          <p className="mt-2 text-sm text-slate-600">Manage events, team profiles, and gallery snapshots from a single dashboard.</p>
        </div>
        <button
          onClick={handleLogout}
          className="self-start border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-700 transition hover:border-primary hover:text-primary hover:bg-slate-50"
        >
          Log out
        </button>
      </header>

      <nav className="flex flex-wrap gap-2">
        {[
          { key: "events", label: "Events" },
          { key: "team", label: "Team" },
          { key: "chapters", label: "Chapters" },
          { key: "gallery", label: "Gallery" },
          { key: "news", label: "News" },
          { key: "subscribers", label: "Subscribers" }
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`border px-5 py-2 text-sm font-semibold uppercase tracking-wider transition ${
              activeTab === tab.key
                ? "border-primary bg-primary text-white"
                : "border-slate-300 bg-white text-slate-600 hover:border-primary hover:text-primary hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === "events" ? (
        <section className="space-y-8">
          <div className="border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="heading-font text-xl font-semibold text-slate-900">{isEditingEvent ? "Edit Event" : "Create Event"}</h2>
            <p className="mt-2 text-sm text-slate-600">
              {isEditingEvent
                ? "Update event details to refresh the public event page and hero section. Uploading a new cover image replaces the existing asset."
                : "Titles, dates, and descriptions power the homepage hero and event listings."}
            </p>
            <form onSubmit={handleSubmitEvent} className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Title
                <input
                  value={eventForm.title}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, title: e.target.value }))}
                  required
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Slug
                <input
                  value={eventForm.slug}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, slug: e.target.value }))}
                  required
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </label>
              <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700">
                Description
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, description: e.target.value }))}
                  required
                  rows={4}
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </label>
              <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700">
                Hero Headline (optional)
                <input
                  value={eventForm.heroTitle}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, heroTitle: e.target.value }))}
                  placeholder="Shown on homepage hero when this event is featured"
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </label>
              <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700">
                Hero Summary (optional)
                <textarea
                  value={eventForm.heroSubtitle}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, heroSubtitle: e.target.value }))}
                  rows={3}
                  placeholder="Provide a short teaser that appears in the hero carousel"
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Event Date
                <input
                  type="date"
                  value={eventForm.eventDate}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, eventDate: e.target.value }))}
                  required
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Location
                <input
                  value={eventForm.location}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, location: e.target.value }))}
                  required
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Tags (comma-separated)
                <input
                  value={eventForm.tags}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, tags: e.target.value }))}
                  placeholder="e.g., workshop, seminar, networking"
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </label>
              <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700">
                Cover Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEventImageSelection}
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {eventForm.coverImage && (
                  <Image
                    src={eventForm.coverImage}
                    alt="Cover preview"
                    width={128}
                    height={80}
                    className="mt-2 object-cover border border-slate-200"
                  />
                )}
                {eventUploadLoading && <p className="text-sm text-slate-500">Uploading...</p>}
                {eventUploadError && <p className="text-sm text-red-600 font-medium">{eventUploadError}</p>}
              </label>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={eventForm.featured}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, featured: e.target.checked }))}
                  className="border border-slate-300 text-primary focus:ring-primary"
                />
                <label>Featured</label>
              </div>

              <div className="md:col-span-2 flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={eventSubmitting}
                  className="border border-primary bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-50"
                >
                  {eventSubmitting ? "Saving..." : isEditingEvent ? "Update Event" : "Create Event"}
                </button>
                {isEditingEvent && (
                  <button
                    type="button"
                    onClick={cancelEventEdit}
                    className="border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                )}
              </div>

            </form>

            {eventFeedback && (
              <p className="mt-4 text-sm text-green-600 font-medium">{eventFeedback}</p>
            )}
            {eventError && (
              <p className="mt-4 text-sm text-red-600 font-medium">{eventError}</p>
            )}

            <div className="mt-12 pt-10 border-t border-slate-200">
              <h3 className="heading-font text-lg font-semibold text-slate-900">Existing Events</h3>
              <p className="mt-2 text-sm text-slate-600">Click on an event to edit it, or toggle featured status.</p>
              {isEventsLoading ? (
                <p className="mt-4 text-sm text-slate-500">Loading events...</p>
              ) : events && events.length > 0 ? (
                <ul className="mt-6 divide-y divide-slate-100 border border-slate-200">
                  {events.map((event) => (
                    <li key={event._id} className="flex items-center justify-between bg-white p-4 transition hover:bg-slate-50">
                      <div className="flex items-center gap-4">
                        <Image
                          src={event.coverImage}
                          alt={event.title}
                          width={64}
                          height={64}
                          className="h-16 w-16 rounded object-cover"
                        />
                        <div>
                          <h4 className="font-semibold text-slate-900">{event.title}</h4>
                          <p className="text-sm text-slate-600">{event.location} • {new Date(event.eventDate).toLocaleDateString()}</p>
                          {event.tags && event.tags.length > 0 && (
                            <p className="text-xs text-slate-500">{event.tags.join(", ")}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleFeatured(event._id, Boolean(event.featured))}
                          className={`px-2 py-1 text-xs font-semibold border ${event.featured ? "bg-primary border-primary text-white" : "border-slate-300 text-slate-600 hover:border-primary hover:text-primary hover:bg-slate-50"}`}
                        >
                          {event.featured ? "Featured" : "Not Featured"}
                        </button>
                        <button
                          onClick={() => startEventEdit(event)}
                          className="border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600 hover:border-primary hover:text-primary hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          className="border border-red-200 px-2 py-1 text-xs font-semibold text-red-600 hover:border-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-slate-500">No events found.</p>
              )}
            </div>
          </div>
        </section>

      ) : activeTab === "team" ? (
        <section className="space-y-8">
          <div className="border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="heading-font text-xl font-semibold text-slate-900">{isEditingTeam ? "Edit Team Member" : "Add Team Member"}</h2>
            <p className="mt-2 text-sm text-slate-600">
              {isEditingTeam
                ? "Update team member details. Uploading a new photo replaces the existing asset."
                : "Add new team members to display on the leadership page."}
            </p>
            <form onSubmit={handleSubmitTeamMember} className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Name
                <input
                  value={teamForm.name}
                  onChange={(e) => setTeamForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Role
                <input
                  value={teamForm.role}
                  onChange={(e) => setTeamForm((prev) => ({ ...prev, role: e.target.value }))}
                  required
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </label>
              <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700">
                Bio (optional)
                <textarea
                  value={teamForm.bio}
                  onChange={(e) => setTeamForm((prev) => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Priority
                <input
                  type="number"
                  value={teamForm.priority}
                  onChange={(e) => setTeamForm((prev) => ({ ...prev, priority: e.target.value }))}
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Affiliation
                <select
                  value={teamForm.affiliation}
                  onChange={(e) => setTeamForm((prev) => ({ ...prev, affiliation: e.target.value as "main" | "chapter" }))}
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="main">Main Branch</option>
                  <option value="chapter">Chapter</option>
                </select>
              </label>
              {teamForm.affiliation === "chapter" && (
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  Chapter
                  <select
                    value={teamForm.chapter}
                    onChange={(e) => setTeamForm((prev) => ({ ...prev, chapter: e.target.value }))}
                    className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {chapterNameOptions.map((chapter) => (
                      <option key={chapter} value={chapter}>
                        {chapter}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Role Key
                <select
                  value={teamForm.roleKey}
                  onChange={(e) => setTeamForm((prev) => ({ ...prev, roleKey: e.target.value }))}
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {roleKeyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Facebook (optional)
                <input
                  value={teamForm.facebook}
                  onChange={(e) => setTeamForm((prev) => ({ ...prev, facebook: e.target.value }))}
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Instagram (optional)
                <input
                  value={teamForm.instagram}
                  onChange={(e) => setTeamForm((prev) => ({ ...prev, instagram: e.target.value }))}
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                LinkedIn (optional)
                <input
                  value={teamForm.linkedin}
                  onChange={(e) => setTeamForm((prev) => ({ ...prev, linkedin: e.target.value }))}
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Email (optional)
                <input
                  type="email"
                  value={teamForm.email}
                  onChange={(e) => setTeamForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </label>
              <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700">
                Profile Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleTeamPhotoSelection}
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {teamForm.photoUrl && (
                  <Image
                    src={teamForm.photoUrl}
                    alt="Member preview"
                    width={80}
                    height={80}
                    className="mt-2 rounded-full object-cover border border-slate-200"
                  />
                )}
                {teamUploadLoading && <p className="text-sm text-slate-500">Uploading...</p>}
                {teamUploadError && <p className="text-sm text-red-600 font-medium">{teamUploadError}</p>}
              </label>

              <div className="md:col-span-2 flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={teamSubmitting}
                  className="border border-primary bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-50"
                >
                  {teamSubmitting ? "Saving..." : isEditingTeam ? "Update Member" : "Add Member"}
                </button>
                {isEditingTeam && (
                  <button
                    type="button"
                    onClick={cancelTeamEdit}
                    className="border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {teamFeedback && (
              <p className="mt-4 text-sm text-green-600 font-medium">{teamFeedback}</p>
            )}
            {teamError && (
              <p className="mt-4 text-sm text-red-600 font-medium">{teamError}</p>
            )}

            <div className="mt-12 pt-10 border-t border-slate-200">
              <h3 className="heading-font text-lg font-semibold text-slate-900">Existing Team Members</h3>
              <p className="mt-2 text-sm text-slate-600">Click on a member to edit their details.</p>
              {isTeamLoading ? (
                <p className="mt-4 text-sm text-slate-500">Loading team members...</p>
              ) : team && team.length > 0 ? (
                <ul className="mt-6 divide-y divide-slate-100 border border-slate-200">
                  {team.map((member) => (
                    <li key={member._id} className="flex items-center justify-between bg-white p-4 transition hover:bg-slate-50">
                      <div className="flex items-center gap-4">
                        <Image
                          src={member.photoUrl}
                          alt={member.name}
                          width={64}
                          height={64}
                          className="rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold text-slate-900">{member.name}</h4>
                          <p className="text-sm text-slate-600">{member.role}</p>
                          {member.roleKey && member.roleKey !== "none" && (
                            <p className="text-xs text-slate-500">{roleKeyLabelMap[member.roleKey]}</p>
                          )}
                          {member.affiliation === "chapter" && member.chapter && (
                            <p className="text-xs text-slate-500">{member.chapter}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startTeamEdit(member)}
                          className="border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600 hover:border-primary hover:text-primary hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTeamMember(member._id)}
                          className="border border-red-200 px-2 py-1 text-xs font-semibold text-red-600 hover:border-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-slate-500">No team members found.</p>
              )}
            </div>
          </div>
        </section>

      ) : activeTab === "chapters" ? (
        <section className="space-y-8">
          <div className="border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="heading-font text-xl font-semibold text-slate-900">Chapter Management</h2>
            <p className="mt-2 text-sm text-slate-600">View and manage team members by chapter.</p>

            <div className="mt-6">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Select Chapter
                <select
                  value={selectedChapter || ""}
                  onChange={(e) => setSelectedChapter(e.target.value || null)}
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">All Chapters</option>
                  {chapterEntries.map((entry) => (
                    <option key={entry.name} value={entry.name}>
                      {entry.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-12 pt-10 border-t border-slate-200">
              <h3 className="heading-font text-lg font-semibold text-slate-900">
                {selectedChapter ? `${selectedChapter} Members` : "All Chapter Members"}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {selectedChapter
                  ? `Showing members of ${selectedChapter}.`
                  : "Showing all chapter members. Select a chapter to filter."}
              </p>
              {isTeamLoading ? (
                <p className="mt-4 text-sm text-slate-500">Loading team members...</p>
              ) : selectedChapterEntry ? (
                <ul className="mt-6 divide-y divide-slate-100 border border-slate-200">
                  {selectedChapterEntry.members.map((member) => (
                    <li key={member._id} className="flex items-center justify-between bg-white p-4 transition hover:bg-slate-50">
                      <div className="flex items-center gap-4">
                        <Image
                          src={member.photoUrl}
                          alt={member.name}
                          width={64}
                          height={64}
                          className="rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold text-slate-900">{member.name}</h4>
                          <p className="text-sm text-slate-600">{member.role}</p>
                          {member.roleKey && member.roleKey !== "none" && (
                            <p className="text-xs text-slate-500">{roleKeyLabelMap[member.roleKey]}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startTeamEdit(member)}
                          className="border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600 hover:border-primary hover:text-primary hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTeamMember(member._id)}
                          className="border border-red-200 px-2 py-1 text-xs font-semibold text-red-600 hover:border-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : fallbackChapterEntry ? (
                <ul className="mt-6 divide-y divide-slate-100 border border-slate-200">
                  {fallbackChapterEntry.members.map((member) => (
                    <li key={member._id} className="flex items-center justify-between bg-white p-4 transition hover:bg-slate-50">
                      <div className="flex items-center gap-4">
                        <Image
                          src={member.photoUrl}
                          alt={member.name}
                          width={64}
                          height={64}
                          className="rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold text-slate-900">{member.name}</h4>
                          <p className="text-sm text-slate-600">{member.role}</p>
                          {member.roleKey && member.roleKey !== "none" && (
                            <p className="text-xs text-slate-500">{roleKeyLabelMap[member.roleKey]}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startTeamEdit(member)}
                          className="border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600 hover:border-primary hover:text-primary hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTeamMember(member._id)}
                          className="border border-red-200 px-2 py-1 text-xs font-semibold text-red-600 hover:border-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-slate-500">No chapter members found.</p>
              )}
            </div>
          </div>
        </section>

      ) : activeTab === "gallery" ? (
        <section className="space-y-8">
          <div className="border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="heading-font text-xl font-semibold text-slate-900">Add Gallery Item</h2>
            <p className="mt-2 text-sm text-slate-600">Upload images to the gallery for display on the website.</p>
            <form onSubmit={handleCreateGalleryItem} className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Title
                <input
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm((prev) => ({ ...prev, title: e.target.value }))}
                  required
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Associated Event (optional)
                <input
                  value={galleryForm.event}
                  onChange={(e) => setGalleryForm((prev) => ({ ...prev, event: e.target.value }))}
                  placeholder="e.g., Annual Tech Fest 2023"
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </label>
              <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700">
                Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryImageSelection}
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {galleryUploadLoading && <p className="text-sm text-slate-500">Uploading...</p>}
                {galleryUploadError && <p className="text-sm text-red-600 font-medium">{galleryUploadError}</p>}
                {galleryForm.imageUrl && (
                  <Image src={galleryForm.imageUrl} alt="Preview" width={160} height={96} className="mt-2 rounded-none object-cover border border-slate-200" />
                )}
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Uploaded At (optional)
                <input
                  type="date"
                  value={galleryForm.uploadedAt}
                  onChange={(e) => setGalleryForm((prev) => ({ ...prev, uploadedAt: e.target.value }))}
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </label>

              <div className="md:col-span-2 flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={gallerySubmitting}
                  className="border border-primary bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-50"
                >
                  {gallerySubmitting ? "Adding..." : "Add to Gallery"}
                </button>
                <button
                  type="button"
                  onClick={() => setGalleryForm({ title: "", publicId: "", imageUrl: "", event: "", uploadedAt: "" })}
                  className="border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary hover:bg-slate-50"
                >
                  Reset
                </button>
              </div>
            </form>

            {galleryFeedback && <p className="mt-4 text-sm text-green-600 font-medium">{galleryFeedback}</p>}
            {galleryError && <p className="mt-4 text-sm text-red-600 font-medium">{galleryError}</p>}

            <div className="mt-12 pt-10 border-t border-slate-200">
              <h3 className="heading-font text-lg font-semibold text-slate-900">Existing Gallery</h3>
              {isGalleryLoading ? (
                <p className="mt-4 text-sm text-slate-500">Loading gallery...</p>
              ) : gallery && gallery.length > 0 ? (
                <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {gallery.map((item) => (
                    <li key={item._id} className="border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md">
                      <Image src={item.imageUrl} alt={item.title} width={400} height={160} className="w-full object-cover" />
                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{item.title}</p>
                          {item.event && <p className="text-xs text-slate-500">{item.event}</p>}
                        </div>
                        <button
                          onClick={() => handleDeleteGalleryItem(item._id)}
                          className="border border-red-200 px-2 py-1 text-xs font-semibold text-red-600 hover:border-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-slate-400">No gallery items yet.</p>
              )}
            </div>
          </div>
        </section>

      ) : activeTab === "news" ? (
        <section className="space-y-8">
          <div className="border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="heading-font text-xl font-semibold text-slate-900">{isEditingNews ? "Edit News" : "Create News"}</h2>
            <p className="mt-2 text-sm text-slate-600">Publish updates and announcements.</p>
            <form onSubmit={handleSubmitNews} className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Title
                <input
                  value={newsForm.title}
                  onChange={(e) => setNewsForm((p) => ({ ...p, title: e.target.value }))}
                  required
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Slug
                <input
                  value={newsForm.slug}
                  onChange={(e) => setNewsForm((p) => ({ ...p, slug: e.target.value }))}
                  required
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Category
                <input
                  value={newsForm.category}
                  onChange={(e) => setNewsForm((p) => ({ ...p, category: e.target.value }))}
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Date
                <input
                  type="date"
                  value={newsForm.date}
                  onChange={(e) => setNewsForm((p) => ({ ...p, date: e.target.value }))}
                  required
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </label>
              <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700">
                Excerpt
                <input
                  value={newsForm.excerpt}
                  onChange={(e) => setNewsForm((p) => ({ ...p, excerpt: e.target.value }))}
                  required
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </label>
              <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700">
                Content (optional)
                <textarea
                  value={newsForm.content}
                  onChange={(e) => setNewsForm((p) => ({ ...p, content: e.target.value }))}
                  rows={6}
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </label>
              <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700">
                Image (optional)
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleNewsImageSelection}
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {newsUploadLoading && <p className="text-sm text-slate-500">Uploading...</p>}
                {newsUploadError && <p className="text-sm text-red-600 font-medium">{newsUploadError}</p>}
                {newsForm.imageUrl && (
                  <Image src={newsForm.imageUrl} alt="News preview" width={160} height={96} className="mt-2 object-cover border border-slate-200" />
                )}
              </label>

              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={newsForm.published}
                  onChange={(e) => setNewsForm((p) => ({ ...p, published: e.target.checked }))}
                  className="border border-slate-300 text-primary focus:ring-primary"
                />
                <label>Published</label>
              </div>

              <div className="md:col-span-2 flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={newsSubmitting}
                  className="border border-primary bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-50"
                >
                  {newsSubmitting ? "Saving..." : isEditingNews ? "Update News" : "Create News"}
                </button>
                {isEditingNews && (
                  <button
                    type="button"
                    onClick={cancelNewsEdit}
                    className="border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {newsFeedback && <p className="mt-4 text-sm text-green-600 font-medium">{newsFeedback}</p>}
            {newsError && <p className="mt-4 text-sm text-red-600 font-medium">{newsError}</p>}

            <div className="mt-12 pt-10 border-t border-slate-200">
              <h3 className="heading-font text-lg font-semibold text-slate-900">Existing News</h3>
              {isNewsLoading ? (
                <p className="mt-4 text-sm text-slate-500">Loading news...</p>
              ) : news && news.length > 0 ? (
                <ul className="mt-6 divide-y divide-slate-100 border border-slate-200">
                  {news.map((item) => (
                    <li key={item._id} className="flex items-center justify-between bg-white p-4 transition hover:bg-slate-50">
                      <div>
                        <p className="font-semibold text-slate-900">{item.title}</p>
                        <p className="text-sm text-slate-600">{new Date(item.date).toLocaleDateString()} • {item.category}</p>
                        <p className="text-xs text-slate-500 font-mono">/{item.slug}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startNewsEdit(item)}
                          className="border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600 hover:border-primary hover:text-primary hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleTogglePublished(item._id, item.published)}
                          className={`px-2 py-1 text-xs font-semibold border ${item.published ? "bg-primary border-primary text-white" : "border-slate-300 text-slate-600 hover:border-primary hover:text-primary hover:bg-slate-50"}`}
                        >
                          {item.published ? "Published" : "Draft"}
                        </button>
                        <button
                          onClick={() => handleDeleteNews(item._id)}
                          className="border border-red-200 px-2 py-1 text-xs font-semibold text-red-600 hover:border-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-slate-500">No news yet.</p>
              )}
            </div>
          </div>
        </section>

      ) : activeTab === "subscribers" ? (
        <section className="space-y-8">
          <div className="border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="heading-font text-xl font-semibold text-slate-900">Subscribers</h2>
            <p className="mt-2 text-sm text-slate-600">Manage newsletter subscribers captured from the site.</p>

            <div className="mt-4 flex gap-4 items-center">
              <button
                type="button"
                onClick={handleCopySubscribers}
                className="border border-primary bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-50"
              >
                Copy Emails
              </button>
              {subscriberFeedback && <p className="text-sm text-green-600 font-medium">{subscriberFeedback}</p>}
              {subscriberError && <p className="text-sm text-red-600 font-medium">{subscriberError}</p>}
            </div>

            <div className="mt-12 pt-10 border-t border-slate-200">
              {isSubscribersLoading ? (
                <p className="mt-4 text-sm text-slate-500">Loading subscribers...</p>
              ) : subscribers && subscribers.length > 0 ? (
                <ul className="mt-6 divide-y divide-slate-100 border border-slate-200">
                  {subscribers.map((s) => (
                    <li key={s._id} className="flex items-center justify-between bg-white p-4 transition hover:bg-slate-50">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{s.email}</p>
                        <p className="text-xs text-slate-500">{new Date(s.createdAt).toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteSubscriber(s._id)}
                        disabled={subscriberDeletingId === s._id}
                        className="border border-red-200 px-2 py-1 text-xs font-semibold text-red-600 hover:border-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {subscriberDeletingId === s._id ? "Deleting..." : "Delete"}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-slate-500">No subscribers yet.</p>
              )}
            </div>
          </div>
        </section>

      ) : null}
    </div>

  );

}
