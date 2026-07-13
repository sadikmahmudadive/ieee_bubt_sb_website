import Link from "next/link";
import type { Metadata } from "next";

import { CallToAction } from "@/components/CallToAction";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal, RevealList } from "@/components/Reveal";
import { ResearchTimeline } from "@/components/ResearchTimeline";
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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="space-y-20 pb-24">
        <section className="relative isolate overflow-hidden border-b border-white/10 py-20 sm:py-28">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-navy via-primary-dark to-primary" aria-hidden />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,174,239,0.18),transparent_35%)]" aria-hidden />
          <div className="relative mx-auto max-w-5xl px-6 text-center sm:px-8">
            <Reveal y={-20}>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-soft">Research & Journals</p>
              <h1 className="mt-6 text-4xl font-light text-white sm:text-[2.75rem]">Publish ideas that move industry and society forward</h1>
              <p className="mt-6 text-base text-white/80 sm:text-lg">
                From ideation clinics to final submission, IEEE BUBT Student Branch mentors guide you through the entire lifecycle of
                scholarly publishing. Join collaborative labs, access tooling, and share your results with global audiences.
              </p>
            </Reveal>
            <Reveal y={20} delay={0.2}>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-primary-dark"
                >
                  Pitch a Proposal
                </Link>
                <Link
                  href="/#events"
                  className="inline-flex items-center justify-center rounded-full border-2 border-white/40 bg-transparent px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:border-white hover:bg-white hover:text-primary"
                >
                  Browse Project Showcases
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto flex max-w-6xl flex-col gap-16 px-6 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Focus Tracks"
              title="Research domains supported by IEEE BUBT SB"
              subtitle="Co-create experiments, code, and hardware deployments that address national challenges and global IEEE priorities."
              tone="light"
            />
          </Reveal>
          <div className="grid gap-8 md:grid-cols-3">
            <RevealList interval={0.15}>
              {researchTracks.map((track) => (
                <article key={track.title} className="group relative flex h-full flex-col border border-border bg-white p-6 shadow-[0_2px_4px_rgba(0,0,0,0.08)] transition hover:-translate-y-1 hover:border-cyan-soft hover:shadow-[0_0_2px_2px_rgba(204,204,204,1)]">
                  <div className="absolute inset-x-10 -top-1 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition group-hover:opacity-100" aria-hidden />
                  <h3 className="heading-font text-lg font-light text-slate-900">{track.title}</h3>
                  <p className="mt-4 text-sm text-slate-600">{track.summary}</p>
                  <ul className="mt-6 space-y-2 text-sm text-slate-700">
                    {track.topics.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </RevealList>
          </div>
        </section>

        <section className="mx-auto flex max-w-6xl flex-col gap-16 px-6 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Publishing Support"
              title="Structured programs to transform drafts into publications"
              subtitle="Every cohort moves through curated workshops and editorial checkpoints designed with IEEE authors and industry mentors."
              tone="light"
            />
          </Reveal>
          <div className="grid gap-8 md:grid-cols-3">
            <RevealList interval={0.15}>
              {journalSupports.map((program) => (
                <article key={program.title} className="flex h-full flex-col border border-border bg-white p-6 shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
                  <h3 className="heading-font text-lg font-light text-slate-900">{program.title}</h3>
                  <p className="mt-4 text-sm text-slate-600">{program.description}</p>
                  <ul className="mt-6 space-y-2 text-sm text-slate-700">
                    {program.deliverables.map((deliverable) => (
                      <li key={deliverable} className="flex items-start gap-2">
                        <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                        <span>{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </RevealList>
          </div>
        </section>

        <section className="mx-auto flex max-w-6xl flex-col gap-16 px-6 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Annual Cycle"
              title="Milestones for the research and publication journey"
              subtitle="Plan your submissions with our academic calendar, ensuring lab access, mentor reviews, and funding align with deadlines."
              tone="light"
            />
          </Reveal>
          <div className="mt-12 w-full">
            <ResearchTimeline timeline={submissionTimeline} />
          </div>
          <Reveal y={10} delay={0.4}>
            <div className="border border-cyan-soft bg-cyan/5 p-8 text-sm text-slate-700 shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
              <p>
                Need timeline flexibility? Let us know during ideation clinics so we can align lab availability and reviewer cohorts with your
                project scope.
              </p>
            </div>
          </Reveal>
        </section>

        <section className="mx-auto flex max-w-6xl flex-col gap-12 px-6 sm:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Resources"
              title="Partner platforms and funding avenues"
              subtitle="Tap into IEEE catalogs, research grants, and cloud tooling curated for student researchers."
              tone="light"
            />
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            <RevealList interval={0.15}>
              {partnerResources.map((resource) => (
                <article key={resource.name} className="flex h-full flex-col justify-between border border-border bg-white p-6 shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
                  <div>
                    <h3 className="heading-font text-lg font-light text-slate-900">{resource.name}</h3>
                    <p className="mt-4 text-sm text-slate-600">{resource.description}</p>
                  </div>
                  <Link
                    href={resource.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary transition hover:text-primary-dark hover:underline hover:underline-offset-8"
                  >
                    Explore
                    <span aria-hidden>→</span>
                  </Link>
                </article>
              ))}
            </RevealList>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 sm:px-8">
          <Reveal scale={0.95} duration={0.8}>
            <div className="border border-border bg-white p-10 text-center shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
              <h2 className="heading-font text-3xl font-light text-slate-900 sm:text-[2.35rem]">Ready to launch your manuscript?</h2>
              <p className="mt-5 text-base text-slate-600">
                Submit a concept brief or request a mentor pairing and the IEEE BUBT SB research desk will follow up with timelines, lab
                bookings, and documentation templates.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href={`mailto:${siteMetadata.social.email}`}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-primary-dark"
                >
                  Email Research Desk
                </Link>
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center rounded-full border border-border bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wider text-slate-700 transition hover:border-primary hover:text-primary"
                >
                  Schedule a Clinic
                </Link>
              </div>
            </div>
          </Reveal>
        </section>

        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
