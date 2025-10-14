import Link from "next/link";
import type { Metadata } from "next";

import { CallToAction } from "@/components/CallToAction";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SectionHeading } from "@/components/SectionHeading";
import { siteMetadata } from "@/utils/siteMetadata";

const researchTracks = [
  {
    title: "Emerging Communication Systems",
    summary: "Applied research exploring resilient wireless infrastructures and intelligent spectrum management across campus and industry deployments.",
    topics: ["5G and 6G network design", "Software-defined radio experimentation", "IoT security hardening"]
  },
  {
    title: "Power and Sustainable Energy",
    summary: "Projects centered on renewable integration, smart grids, and energy-aware architectures for Bangladesh's rapidly growing cities.",
    topics: ["Microgrid optimization", "Energy storage analytics", "Low-cost photovoltaic innovations"]
  },
  {
    title: "Computational Intelligence",
    summary: "Interdisciplinary work combining AI, biomedical informatics, and data-driven automation to support local communities.",
    topics: ["Machine learning for health tech", "Robotics and embedded automation", "Responsible AI frameworks"]
  }
];

const journalSupports = [
  {
    title: "Ideation Clinics",
    description: "Monthly roundtables where faculty mentors and senior members stress-test your research hypothesis and methodology.",
    deliverables: ["Research framing map", "Mentor pairing", "Initial literature matrix"]
  },
  {
    title: "Writing Sprints",
    description: "Two-week intensive sessions focused on drafting publishable manuscripts with editorial reviews from IEEE authors.",
    deliverables: ["Section-by-section guidance", "Citation quality review", "Visual abstract polish"]
  },
  {
    title: "Publication Launchpad",
    description: "Submission support covering journal selection, formatting, and response strategies for reviewer feedback.",
    deliverables: ["Target journal shortlist", "Compliance checklist", "Rebuttal rehearsal"]
  }
];

const submissionTimeline = [
  {
    phase: "Concept Brief",
    window: "January – March",
    focus: "Share a one-page overview outlining your problem statement, expected contribution, and required lab resources."
  },
  {
    phase: "Prototype & Data",
    window: "April – July",
    focus: "Validate your approach with experiments or simulations, capture datasets, and document reproducibility standards."
  },
  {
    phase: "Manuscript Submission",
    window: "August – October",
    focus: "Finalize figures, complete peer edits, and submit to an IEEE journal, conference, or partner publication."
  },
  {
    phase: "Showcase & Impact",
    window: "November – December",
    focus: "Present accepted work to the branch community, publish insights on campus channels, and plan follow-up collaborations."
  }
];

const partnerResources = [
  {
    name: "IEEE Xplore Digital Library",
    href: "https://ieeexplore.ieee.org/",
    description: "Access full-text technical literature across IEEE journals, conferences, and standards with branch credentials."
  },
  {
    name: "Bangladesh Section Research Grants",
    href: "https://ieeebd.net/",
    description: "Apply for seed funding that supports prototype development, lab consumables, and field studies."
  },
  {
    name: "Cloud Computing Sandbox",
    href: "https://cloud.google.com/edu",
    description: "Spin up GPU-accelerated environments for modeling, simulation, and data pipelines with sponsored credits."
  }
];

export const metadata: Metadata = {
  title: `Research & Journals | ${siteMetadata.title}`,
  description:
    "Explore IEEE BUBT SB research tracks, publication support programs, and resources that help student teams publish with impact."
};

export default function ResearchAndJournalsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="space-y-24 pb-24">
        <section className="relative isolate overflow-hidden border-b border-white/5 py-24 sm:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-slate-900 to-slate-950" aria-hidden />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/40 via-transparent to-transparent blur-3xl" aria-hidden />
          <div className="relative mx-auto max-w-5xl px-6 text-center sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-light">Research & Journals</p>
            <h1 className="mt-6 text-4xl font-bold text-white sm:text-5xl">Publish ideas that move industry and society forward</h1>
            <p className="mt-6 text-base text-slate-200 sm:text-lg">
              From ideation clinics to final submission, IEEE BUBT Student Branch mentors guide you through the entire lifecycle of
              scholarly publishing. Join collaborative labs, access tooling, and share your results with global audiences.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-primary transition hover:bg-slate-100"
              >
                Pitch a Proposal
              </Link>
              <Link
                href="/#events"
                className="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition hover:border-white hover:bg-white/10"
              >
                Browse Project Showcases
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto flex max-w-6xl flex-col gap-16 px-6 sm:px-8">
          <SectionHeading
            eyebrow="Focus Tracks"
            title="Research domains supported by IEEE BUBT SB"
            subtitle="Co-create experiments, code, and hardware deployments that address national challenges and global IEEE priorities."
          />
          <div className="grid gap-8 md:grid-cols-3">
            {researchTracks.map((track) => (
              <article key={track.title} className="group relative flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-lg shadow-slate-950/40 transition hover:-translate-y-1 hover:border-primary/40 hover:bg-white/[0.06]">
                <div className="absolute inset-x-10 -top-1 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition group-hover:opacity-100" aria-hidden />
                <h3 className="heading-font text-lg font-semibold text-white">{track.title}</h3>
                <p className="mt-4 text-sm text-slate-300">{track.summary}</p>
                <ul className="mt-6 space-y-2 text-sm text-slate-200">
                  {track.topics.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-primary-light" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto flex max-w-6xl flex-col gap-16 px-6 sm:px-8">
          <SectionHeading
            eyebrow="Publishing Support"
            title="Structured programs to transform drafts into publications"
            subtitle="Every cohort moves through curated workshops and editorial checkpoints designed with IEEE authors and industry mentors."
          />
          <div className="grid gap-8 md:grid-cols-3">
            {journalSupports.map((program) => (
              <article key={program.title} className="flex h-full flex-col rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950/80 via-slate-900/70 to-slate-950/90 p-6">
                <h3 className="heading-font text-lg font-semibold text-white">{program.title}</h3>
                <p className="mt-4 text-sm text-slate-300">{program.description}</p>
                <ul className="mt-6 space-y-2 text-sm text-slate-200">
                  {program.deliverables.map((deliverable) => (
                    <li key={deliverable} className="flex items-start gap-2">
                      <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-primary-light" aria-hidden />
                      <span>{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto flex max-w-6xl flex-col gap-16 px-6 sm:px-8">
          <SectionHeading
            eyebrow="Annual Cycle"
            title="Milestones for the research and publication journey"
            subtitle="Plan your submissions with our academic calendar, ensuring lab access, mentor reviews, and funding align with deadlines."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {submissionTimeline.map((entry) => (
              <article key={entry.phase} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-light">{entry.window}</p>
                <h3 className="mt-4 text-lg font-semibold text-white">{entry.phase}</h3>
                <p className="mt-3 text-sm text-slate-300">{entry.focus}</p>
              </article>
            ))}
          </div>
          <div className="rounded-3xl border border-primary/30 bg-primary/10 p-8 text-sm text-primary-light">
            <p>
              Need timeline flexibility? Let us know during ideation clinics so we can align lab availability and reviewer cohorts with your
              project scope.
            </p>
          </div>
        </section>

        <section className="mx-auto flex max-w-6xl flex-col gap-12 px-6 sm:px-8">
          <SectionHeading
            eyebrow="Resources"
            title="Partner platforms and funding avenues"
            subtitle="Tap into IEEE catalogs, research grants, and cloud tooling curated for student researchers."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {partnerResources.map((resource) => (
              <article key={resource.name} className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/70 p-6">
                <div>
                  <h3 className="heading-font text-lg font-semibold text-white">{resource.name}</h3>
                  <p className="mt-4 text-sm text-slate-300">{resource.description}</p>
                </div>
                <Link
                  href={resource.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-primary-light transition hover:text-white"
                >
                  Explore
                  <span aria-hidden>→</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 sm:px-8">
          <div className="rounded-[3rem] border border-white/10 bg-slate-900/70 p-10 text-center shadow-[0_40px_80px_-60px_rgba(15,23,42,0.9)]">
            <h2 className="heading-font text-3xl font-semibold text-white sm:text-4xl">Ready to launch your manuscript?</h2>
            <p className="mt-5 text-base text-slate-300">
              Submit a concept brief or request a mentor pairing and the IEEE BUBT SB research desk will follow up with timelines, lab
              bookings, and documentation templates.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={`mailto:${siteMetadata.social.email}`}
                className="inline-flex items-center justify-center rounded-full bg-primary-light px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-900 transition hover:-translate-y-0.5"
              >
                Email Research Desk
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition hover:border-white hover:bg-white/10"
              >
                Schedule a Clinic
              </Link>
            </div>
          </div>
        </section>

        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
