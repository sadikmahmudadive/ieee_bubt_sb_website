"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

type AdminTab = "events" | "team" | "chapters" | "gallery" | "subscribers";

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
    async (file: File, target: "events" | "team" | "gallery") => {
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
      priority: "0",
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

  const [subscriberFeedback, setSubscriberFeedback] = useState<string | null>(null);
  const [subscriberError, setSubscriberError] = useState<string | null>(null);
  const [subscriberDeletingId, setSubscriberDeletingId] = useState<string | null>(null);

  const [eventUploadLoading, setEventUploadLoading] = useState(false);
  const [eventUploadError, setEventUploadError] = useState<string | null>(null);
  const [teamUploadLoading, setTeamUploadLoading] = useState(false);
  const [teamUploadError, setTeamUploadError] = useState<string | null>(null);
  const [galleryUploadLoading, setGalleryUploadLoading] = useState(false);
  const [galleryUploadError, setGalleryUploadError] = useState<string | null>(null);

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
      priority: Number(teamForm.priority) || 0,
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
      priority: String(member.priority ?? 0),
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
    <div className="space-y-10 text-slate-100">
      <header className="flex flex-col gap-4 rounded-3xl border border-white/15 bg-slate-950/70 p-8 shadow-[0_40px_80px_-40px_rgba(15,23,42,0.9)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-primary-light">Admin Console</p>
          <h1 className="heading-font mt-2 text-2xl font-semibold text-white">Welcome back, {adminUsername}</h1>
          <p className="mt-2 text-sm text-slate-300">Manage events, team profiles, and gallery snapshots from a single dashboard.</p>
        </div>
        <button
          onClick={handleLogout}
          className="self-start rounded-full border border-white/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:border-white hover:bg-white/10"
        >
          Log out
        </button>
      </header>

      <nav className="flex flex-wrap gap-3">
        {[
          { key: "events", label: "Events" },
          { key: "team", label: "Team" },
          { key: "chapters", label: "Chapters" },
          { key: "gallery", label: "Gallery" },
          { key: "subscribers", label: "Subscribers" }
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-[0.3em] transition ${
              activeTab === tab.key
                ? "bg-primary-light text-slate-900"
                : "border border-white/20 text-white hover:border-white hover:bg-white/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === "events" ? (
        <section className="space-y-8">
          <div className="rounded-3xl border border-white/15 bg-slate-950/70 p-8 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.8)] backdrop-blur">
            <h2 className="heading-font text-xl font-semibold text-white">{isEditingEvent ? "Edit Event" : "Create Event"}</h2>
            <p className="mt-2 text-sm text-slate-300">
              {isEditingEvent
                ? "Update event details to refresh the public event page and hero section. Uploading a new cover image replaces the existing asset."
                : "Titles, dates, and descriptions power the homepage hero and event listings."}
            </p>
            <form onSubmit={handleSubmitEvent} className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Title
                <input
                  value={eventForm.title}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, title: e.target.value }))}
                  required
                  className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Slug
                <input
                  value={eventForm.slug}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, slug: e.target.value }))}
                  required
                  className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                />
              </label>
              <label className="md:col-span-2 flex flex-col gap-2 text-sm text-slate-200">
                Description
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, description: e.target.value }))}
                  required
                  rows={4}
                  className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                />
              </label>
              <label className="md:col-span-2 flex flex-col gap-2 text-sm text-slate-200">
                Hero Headline (optional)
                <input
                  value={eventForm.heroTitle}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, heroTitle: e.target.value }))}
                  placeholder="Shown on homepage hero when this event is featured"
                  className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                />
              </label>
              <label className="md:col-span-2 flex flex-col gap-2 text-sm text-slate-200">
                Hero Summary (optional)
                <textarea
                  value={eventForm.heroSubtitle}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, heroSubtitle: e.target.value }))}
                  rows={3}
                  placeholder="Provide a short teaser that appears in the hero carousel"
                  className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Event Date
                <input
                  type="date"
                  value={eventForm.eventDate}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, eventDate: e.target.value }))}
                  required
                  className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Location
                <input
                  value={eventForm.location}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, location: e.target.value }))}
                  required
                  className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                />
              </label>
              <div className="md:col-span-2 flex flex-col gap-2 text-sm text-slate-200">
                Cover Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEventImageSelection}
                  className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-primary-light file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-900 focus:border-primary focus:outline-none"
                />
                {eventUploadLoading ? <span className="text-xs text-slate-300">Uploading image...</span> : null}
                {eventUploadError ? <span className="text-xs text-amber-300">{eventUploadError}</span> : null}
                {eventForm.coverImage ? (
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-white/80">Image uploaded</span>
                    <a href={eventForm.coverImage} target="_blank" rel="noreferrer" className="underline transition hover:text-white">
                      Preview
                    </a>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">Upload a JPG or PNG up to 5MB.</span>
                )}
              </div>
              <label className="md:col-span-2 flex flex-col gap-2 text-sm text-slate-200">
                Tags (comma separated)
                <input
                  value={eventForm.tags}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, tags: e.target.value }))}
                  className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                />
              </label>
              <label className="flex items-center gap-3 text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={eventForm.featured}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, featured: e.target.checked }))}
                  className="h-4 w-4"
                />
                Mark as featured (showcase in hero slider)
              </label>
              <div className="md:col-span-2 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={eventSubmitting}
                  className="rounded-full bg-primary-light px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {eventSubmitting ? "Saving..." : isEditingEvent ? "Save Changes" : "Create Event"}
                </button>
                {isEditingEvent ? (
                  <button
                    type="button"
                    onClick={cancelEventEdit}
                    className="rounded-full border border-white/30 px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:border-white/60"
                  >
                    Cancel
                  </button>
                ) : null}
                {eventFeedback ? <span className="text-sm text-emerald-300">{eventFeedback}</span> : null}
                {eventError ? <span className="text-sm text-amber-300">{eventError}</span> : null}
              </div>
            </form>
          </div>

          <div className="rounded-3xl border border-white/15 bg-slate-950/70 p-8 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.8)] backdrop-blur">
            <h3 className="heading-font text-lg font-semibold text-white">Current Events</h3>
            {isEventsLoading ? (
              <p className="mt-4 text-sm text-slate-300">Loading events...</p>
            ) : events && events.length > 0 ? (
              <ul className="mt-6 space-y-4">
                {events.map((event) => (
                  <li key={event._id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="heading-font text-base font-semibold text-white">{event.title}</p>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-300">
                        {new Date(event.eventDate).toLocaleDateString()} • {event.location}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {event.featured ? (
                          <span className="inline-block rounded-full bg-amber-400/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-200">Featured</span>
                        ) : null}
                        {editingEventId === event._id ? (
                          <span className="inline-block rounded-full bg-primary-light/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary-light">Editing</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEventEdit(event)}
                        className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-primary-light hover:text-primary-light"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(event._id, Boolean(event.featured))}
                        className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-amber-300 hover:text-amber-200"
                      >
                        {event.featured ? "Remove Featured" : "Set Featured"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteEvent(event._id)}
                        className="rounded-full border border-red-400/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-red-200 transition hover:border-red-300 hover:text-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-slate-300">No events yet. Create one above.</p>
            )}
          </div>

        </section>
      ) : null}

      {activeTab === "team" ? (
        <section className="space-y-8">
          <div className="rounded-3xl border border-white/15 bg-slate-950/70 p-8 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.8)] backdrop-blur">
            <h2 className="heading-font text-xl font-semibold text-white">{isEditingTeam ? "Edit Team Member" : "Add Team Member"}</h2>
            <p className="mt-2 text-sm text-slate-300">
              {isEditingTeam
                ? "Update the selected leader's profile. Uploading a new photo will replace the existing image."
                : "Profiles surface across the leadership section and event highlights."}
            </p>
            <form onSubmit={handleSubmitTeamMember} className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Name
                <input
                  value={teamForm.name}
                  onChange={(e) => setTeamForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Role
                <input
                  value={teamForm.role}
                  onChange={(e) => setTeamForm((prev) => ({ ...prev, role: e.target.value }))}
                  required
                  className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                />
              </label>
              <label className="md:col-span-2 flex flex-col gap-2 text-sm text-slate-200">
                Bio
                <textarea
                  value={teamForm.bio}
                  onChange={(e) => setTeamForm((prev) => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                  placeholder="Optional short description"
                />
              </label>
              <div className="md:col-span-2 flex flex-col gap-2 text-sm text-slate-200">
                Profile Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleTeamPhotoSelection}
                  className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-primary-light file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-900 focus:border-primary focus:outline-none"
                />
                {teamUploadLoading ? <span className="text-xs text-slate-300">Uploading photo...</span> : null}
                {teamUploadError ? <span className="text-xs text-amber-300">{teamUploadError}</span> : null}
                {teamForm.photoUrl ? (
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-white/80">Photo uploaded</span>
                    <a href={teamForm.photoUrl} target="_blank" rel="noreferrer" className="underline transition hover:text-white">
                      Preview
                    </a>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">Upload a square image for best results.</span>
                )}
              </div>
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Branch Affiliation
                <select
                  value={teamForm.affiliation}
                  onChange={(e) =>
                    setTeamForm((prev) => ({
                      ...prev,
                      affiliation: e.target.value as TeamFormState["affiliation"],
                      chapter: e.target.value === "chapter" ? prev.chapter : ""
                    }))
                  }
                  className="rounded-lg border border-white/20 bg-slate-900/80 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                >
                  <option className="text-slate-900" value="main">
                    IEEE BUBT SB (Main Branch)
                  </option>
                  <option className="text-slate-900" value="chapter">
                    Student Branch Chapter
                  </option>
                </select>
              </label>
              {teamForm.affiliation === "chapter" ? (
                <label className="flex flex-col gap-2 text-sm text-slate-200">
                  Chapter Name
                  <>
                    <input
                      value={teamForm.chapter}
                      onChange={(e) => setTeamForm((prev) => ({ ...prev, chapter: e.target.value }))}
                      list="chapter-name-options"
                      placeholder="Select or enter chapter name"
                      className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                    />
                    <datalist id="chapter-name-options">
                      {chapterNameOptions.map((option) => (
                        <option key={option} value={option} />
                      ))}
                    </datalist>
                  </>
                </label>
              ) : null}
              <label className="md:col-span-2 flex flex-col gap-2 text-sm text-slate-200">
                Homepage Spotlight Role (optional)
                <select
                  value={teamForm.roleKey}
                  onChange={(e) => setTeamForm((prev) => ({ ...prev, roleKey: e.target.value }))}
                  className="rounded-lg border border-white/20 bg-slate-900/80 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                >
                  {roleKeyOptions.map((option) => (
                    <option className="text-slate-900" key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-slate-400">
                  Assign a role to surface this member on the homepage leadership spotlights. Leave the default option for committee or
                  chapter-only members.
                </span>
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Display Priority (higher shows first)
                <input
                  type="number"
                  value={teamForm.priority}
                  onChange={(e) => setTeamForm((prev) => ({ ...prev, priority: e.target.value }))}
                  className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                />
              </label>
              <div className="grid gap-3 text-sm text-slate-200">
                <span>Social Links</span>
                <input
                  placeholder="Facebook URL"
                  value={teamForm.facebook}
                  onChange={(e) => setTeamForm((prev) => ({ ...prev, facebook: e.target.value }))}
                  className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                />
                <input
                  placeholder="Instagram URL"
                  value={teamForm.instagram}
                  onChange={(e) => setTeamForm((prev) => ({ ...prev, instagram: e.target.value }))}
                  className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                />
                <input
                  placeholder="LinkedIn URL"
                  value={teamForm.linkedin}
                  onChange={(e) => setTeamForm((prev) => ({ ...prev, linkedin: e.target.value }))}
                  className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                />
                <input
                  placeholder="Email"
                  value={teamForm.email}
                  onChange={(e) => setTeamForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                />
              </div>
              <div className="md:col-span-2 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={teamSubmitting}
                  className="rounded-full bg-primary-light px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {teamSubmitting ? "Saving..." : isEditingTeam ? "Update Member" : "Add Member"}
                </button>
                {isEditingTeam ? (
                  <button
                    type="button"
                    onClick={cancelTeamEdit}
                    className="rounded-full border border-white/30 px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:border-white/60"
                  >
                    Cancel
                  </button>
                ) : null}
                {teamFeedback ? <span className="text-sm text-emerald-300">{teamFeedback}</span> : null}
                {teamError ? <span className="text-sm text-amber-300">{teamError}</span> : null}
              </div>
            </form>
          </div>

          <div className="rounded-3xl border border-white/15 bg-slate-950/70 p-8 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.8)] backdrop-blur">
            <h3 className="heading-font text-lg font-semibold text-white">Current Team</h3>
            {isTeamLoading ? (
              <p className="mt-4 text-sm text-slate-300">Loading team information...</p>
            ) : team && team.length > 0 ? (
              <ul className="mt-6 space-y-4">
                {team.map((member) => {
                  const affiliation = member.affiliation ?? "main";
                  const roleKey = member.roleKey ?? "none";
                  const roleLabel = roleKeyLabelMap[roleKey] ?? roleKeyLabelMap.none;
                  const isSpotlighted = roleKey !== "none";

                  return (
                    <li key={member._id} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-2">
                        <div>
                          <p className="heading-font text-base font-semibold text-white">{member.name}</p>
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-300">{member.role}</p>
                          {editingTeamId === member._id ? (
                            <span className="mt-1 inline-block rounded-full bg-primary-light/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary-light">
                              Editing
                            </span>
                          ) : null}
                        </div>
                        <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.28em]">
                          <span className="rounded-full border border-white/15 px-3 py-1 text-slate-200">
                            {affiliation === "chapter"
                              ? `Chapter${member.chapter ? `: ${member.chapter}` : " (add chapter name)"}`
                              : "Main Branch"}
                          </span>
                          <span
                            className={`rounded-full border px-3 py-1 ${
                              isSpotlighted
                                ? "border-primary-light/70 text-primary-light"
                                : "border-white/15 text-slate-300"
                            }`}
                          >
                            {isSpotlighted ? `Homepage Spotlight: ${roleLabel}` : roleLabel}
                          </span>
                          <span className="rounded-full border border-white/15 px-3 py-1 text-slate-200">
                            Priority: {typeof member.priority === "number" ? member.priority : 0}
                          </span>
                        </div>
                      </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startTeamEdit(member)}
                        className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-primary-light hover:text-primary-light"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTeamMember(member._id)}
                        className="rounded-full border border-red-400/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-red-200 transition hover:border-red-300 hover:text-red-100"
                      >
                        Delete
                      </button>
                    </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-slate-300">No team members yet. Add one above.</p>
            )}
          </div>
        </section>
      ) : null}

      {activeTab === "chapters" ? (
        <section className="space-y-8">
          <div className="rounded-3xl border border-white/15 bg-slate-950/70 p-8 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.8)] backdrop-blur">
            <h2 className="heading-font text-xl font-semibold text-white">Chapters & Affinity Groups</h2>
            <p className="mt-2 text-sm text-slate-300">
              Review chapter rosters, confirm advisor assignments, and jump into the public pages that showcase each community.
            </p>
            {chapterEntries.length > 0 ? (
              <>
                <div className="mt-6 flex flex-wrap gap-3">
                  {chapterEntries.map((entry) => (
                    <button
                      key={entry.slug}
                      type="button"
                      onClick={() => setSelectedChapter(entry.name)}
                      className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                        selectedChapter === entry.name
                          ? "bg-primary-light text-slate-900"
                          : "border border-white/20 text-white hover:border-white hover:bg-white/10"
                      }`}
                    >
                      {entry.name}
                      <span className="ml-2 rounded-full border border-white/20 px-2 py-0.5 text-[10px] tracking-[0.25em]">
                        {entry.members.length}
                      </span>
                    </button>
                  ))}
                </div>
                {fallbackChapterEntry ? (
                  <p className="mt-4 text-xs text-amber-300">
                    {fallbackChapterEntry.members.length} member
                    {fallbackChapterEntry.members.length === 1 ? "" : "s"} still use the default chapter name. Update their chapter titles for clearer listings.
                  </p>
                ) : null}
              </>
            ) : (
              <p className="mt-4 text-sm text-slate-300">Add chapter or affinity group members in the Team tab to populate this view.</p>
            )}
          </div>

          {selectedChapterEntry ? (
            <div className="space-y-6 rounded-3xl border border-white/15 bg-slate-950/70 p-8 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.8)] backdrop-blur">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="heading-font text-lg font-semibold text-white">{selectedChapterEntry.name}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-300">
                    {selectedChapterEntry.advisors.length} advisor{selectedChapterEntry.advisors.length === 1 ? "" : "s"} ·
                    {" "}
                    {selectedChapterEntry.committee.length} committee member{selectedChapterEntry.committee.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/chapters/${selectedChapterEntry.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white hover:bg-white/10"
                  >
                    View Public Page
                  </Link>
                  <button
                    type="button"
                    onClick={() => setActiveTab("team")}
                    className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-primary-light hover:text-primary-light"
                  >
                    Add or Edit Members
                  </button>
                </div>
              </div>

              {selectedChapterEntry.members.length > 0 ? (
                <ul className="space-y-4">
                  {selectedChapterEntry.members.map((member) => {
                    const roleKey = member.roleKey ?? "none";
                    const roleLabel = roleKeyLabelMap[roleKey] ?? roleKeyLabelMap.none;
                    const isSpotlighted = roleKey !== "none";

                    return (
                      <li
                        key={member._id}
                        className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 lg:flex-row lg:items-center lg:justify-between"
                      >
                        <div className="space-y-2">
                          <p className="heading-font text-base font-semibold text-white">{member.name}</p>
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-300">{member.role}</p>
                          <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.28em]">
                            <span className="rounded-full border border-white/15 px-3 py-1 text-slate-200">
                              {member.chapter?.trim() || chapterFallbackName}
                            </span>
                            <span
                              className={`rounded-full border px-3 py-1 ${
                                isSpotlighted
                                  ? "border-primary-light/70 text-primary-light"
                                  : "border-white/15 text-slate-300"
                              }`}
                            >
                              {isSpotlighted ? `Homepage Spotlight: ${roleLabel}` : roleLabel}
                            </span>
                            <span className="rounded-full border border-white/15 px-3 py-1 text-slate-200">
                              Priority: {typeof member.priority === "number" ? member.priority : 0}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              startTeamEdit(member);
                              setActiveTab("team");
                            }}
                            className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-primary-light hover:text-primary-light"
                          >
                            Edit in Team Tab
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTeamMember(member._id)}
                            className="rounded-full border border-red-400/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-red-200 transition hover:border-red-300 hover:text-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-slate-300">
                  No members are assigned to this chapter yet. Use the Team tab to add faculty or committee members with the appropriate
                  chapter name.
                </p>
              )}
            </div>
          ) : null}
        </section>
      ) : null}

      {activeTab === "gallery" ? (
        <section className="space-y-8">
          <div className="rounded-3xl border border-white/15 bg-slate-950/70 p-8 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.8)] backdrop-blur">
            <h2 className="heading-font text-xl font-semibold text-white">Add Gallery Item</h2>
            <p className="mt-2 text-sm text-slate-300">Feature Cloudinary-hosted photos to refresh the visual storytelling.</p>
            <form onSubmit={handleCreateGalleryItem} className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Title
                <input
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm((prev) => ({ ...prev, title: e.target.value }))}
                  required
                  className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                />
              </label>
              <div className="md:col-span-2 flex flex-col gap-2 text-sm text-slate-200">
                Gallery Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryImageSelection}
                  className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-primary-light file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-900 focus:border-primary focus:outline-none"
                />
                {galleryUploadLoading ? <span className="text-xs text-slate-300">Uploading image...</span> : null}
                {galleryUploadError ? <span className="text-xs text-amber-300">{galleryUploadError}</span> : null}
                {galleryForm.imageUrl ? (
                  <div className="space-y-1 text-xs text-slate-300">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-white/10 px-3 py-1 text-white/80">Image uploaded</span>
                      <a href={galleryForm.imageUrl} target="_blank" rel="noreferrer" className="underline transition hover:text-white">
                        Preview
                      </a>
                    </div>
                    <p className="break-all text-slate-400">Public ID: {galleryForm.publicId}</p>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">Upload a landscape photo to feature in the gallery.</span>
                )}
              </div>
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Related Event (optional)
                <input
                  value={galleryForm.event}
                  onChange={(e) => setGalleryForm((prev) => ({ ...prev, event: e.target.value }))}
                  className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Uploaded Date (optional)
                <input
                  type="date"
                  value={galleryForm.uploadedAt}
                  onChange={(e) => setGalleryForm((prev) => ({ ...prev, uploadedAt: e.target.value }))}
                  className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                />
              </label>
              <div className="md:col-span-2 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={gallerySubmitting}
                  className="rounded-full bg-primary-light px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {gallerySubmitting ? "Saving..." : "Add Item"}
                </button>
                {galleryFeedback ? <span className="text-sm text-emerald-300">{galleryFeedback}</span> : null}
                {galleryError ? <span className="text-sm text-amber-300">{galleryError}</span> : null}
              </div>
            </form>
          </div>

          <div className="rounded-3xl border border-white/15 bg-slate-950/70 p-8 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.8)] backdrop-blur">
            <h3 className="heading-font text-lg font-semibold text-white">Current Gallery</h3>
            {isGalleryLoading ? (
              <p className="mt-4 text-sm text-slate-300">Loading gallery...</p>
            ) : gallery && gallery.length > 0 ? (
              <ul className="mt-6 space-y-4">
                {gallery.map((item) => (
                  <li key={item._id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="heading-font text-base font-semibold text-white">{item.title}</p>
                      {item.event ? (
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-300">{item.event}</p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteGalleryItem(item._id)}
                      className="self-start rounded-full border border-red-400/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-red-200 transition hover:border-red-300 hover:text-red-100"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-slate-300">No gallery items yet. Add one above.</p>
            )}
          </div>
        </section>
      ) : null}

        {activeTab === "subscribers" ? (
          <section className="space-y-8">
            <div className="rounded-3xl border border-white/15 bg-slate-950/70 p-8 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.8)] backdrop-blur">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="heading-font text-xl font-semibold text-white">Newsletter Subscribers</h2>
                  <p className="mt-2 text-sm text-slate-300">
                    Manage the quarterly updates list collected from the public contact page.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCopySubscribers}
                    className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-primary-light hover:text-primary-light"
                  >
                    Copy Emails
                  </button>
                  <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-200">
                    Total: {subscriberCount}
                  </span>
                </div>
              </div>
              {subscriberFeedback ? <p className="mt-4 text-sm text-emerald-300">{subscriberFeedback}</p> : null}
              {subscriberError ? <p className="mt-2 text-sm text-amber-300">{subscriberError}</p> : null}
              <div className="mt-6">
                {isSubscribersLoading ? (
                  <p className="text-sm text-slate-300">Loading subscribers...</p>
                ) : subscribers && subscribers.length > 0 ? (
                  <ul className="space-y-3">
                    {subscribers.map((subscriber) => {
                      const subscribedAt = new Date(subscriber.createdAt);
                      const formattedTimestamp = Number.isNaN(subscribedAt.getTime())
                        ? subscriber.createdAt
                        : subscribedAt.toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short"
                          });

                      return (
                        <li
                          key={subscriber._id}
                          className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="heading-font text-base font-semibold text-white">{subscriber.email}</p>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-300">
                              {formattedTimestamp}
                              {subscriber.source ? ` • ${subscriber.source}` : ""}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteSubscriber(subscriber._id)}
                            disabled={subscriberDeletingId === subscriber._id}
                            className="self-start rounded-full border border-red-400/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-red-200 transition hover:border-red-300 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {subscriberDeletingId === subscriber._id ? "Removing..." : "Delete"}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-300">
                    No subscribers yet. Once visitors join the list from the contact page, emails will appear here.
                  </p>
                )}
              </div>
            </div>
          </section>
        ) : null}
    </div>
  );
}
