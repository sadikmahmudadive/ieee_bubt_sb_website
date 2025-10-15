"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bars3Icon, ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { siteMetadata } from "@/utils/siteMetadata";

type NavItem = {
  key: string;
  label: string;
  href?: string;
  type?: "dropdown";
};

type ChapterSummary = {
  name: string;
  slug: string;
  memberCount: number;
};

const navItems: NavItem[] = [
  { key: "home", label: "Home", href: "/" },
  { key: "activities", label: "Activities", href: "/#events" },
  { key: "chapters", label: "Societies & AG", type: "dropdown" },
  { key: "members", label: "Members", href: "/leadership" },
  { key: "about", label: "About", href: "/#about" },
  { key: "publications", label: "Publications", href: "/research-journals" },
  { key: "contact", label: "Contact", href: "/#contact" },
  { key: "get-involved", label: "Get Involved", href: "/#contact" }
];

const portalLink = {
  label: "IEEE BUBT SB Portal",
  href: "/#contact"
};

const desktopLinkClasses =
  "inline-flex items-center rounded-md px-2.5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition hover:text-amber-200 whitespace-nowrap";

const dropdownLinkClasses =
  "block px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:bg-slate-100";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [chapters, setChapters] = useState<ChapterSummary[]>([]);
  const [chaptersLoading, setChaptersLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadChapters() {
      try {
        const response = await fetch("/api/chapters", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load chapters");
        }
        const data = (await response.json()) as ChapterSummary[];
        if (isMounted) {
          setChapters(data);
        }
      } catch (error) {
        if (isMounted) {
          setChapters([]);
        }
      } finally {
        if (isMounted) {
          setChaptersLoading(false);
        }
      }
    }

    void loadChapters();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleNavToggle = () => {
    setIsMenuOpen((prev) => !prev);
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  };

  const handleDesktopDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    setMobileDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#052d63]/98 text-white shadow-lg backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-3" onClick={closeAllMenus}>
          <span className="relative h-12 w-12 overflow-hidden">
            <Image
              src={siteMetadata.brand?.logo.src ?? "/brand/ieee-bubt-sb-logo.svg"}
              alt={siteMetadata.brand?.logo.alt ?? "IEEE BUBT Student Branch logo"}
              fill
              sizes="48px"
              priority
              className="object-contain"
            />
          </span>
          <span className="hidden text-xs font-semibold uppercase tracking-[0.3em] md:block">{siteMetadata.shortTitle}</span>
        </Link>

        <div className="hidden items-center gap-5 lg:flex">
          <ul className="flex items-center gap-1.5">
            {navItems.map((item) => {
              if (item.type === "dropdown") {
                const isOpen = isDropdownOpen;

                return (
                  <li
                    key={item.key}
                    className="relative"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <button
                      type="button"
                      className={`${desktopLinkClasses} gap-1`}
                      aria-expanded={isOpen}
                      onClick={handleDesktopDropdownToggle}
                    >
                      {item.label}
                      <ChevronDownIcon className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen ? (
                      <div className="absolute left-0 z-50 mt-3 w-64 rounded-xl bg-white py-2 text-slate-900 shadow-2xl ring-1 ring-black/5">
                        {chaptersLoading ? (
                          <p className="px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                            Loading...
                          </p>
                        ) : chapters.length > 0 ? (
                          <>
                            {chapters.map((chapter) => (
                              <Link
                                key={chapter.slug}
                                href={`/chapters/${chapter.slug}`}
                                className={dropdownLinkClasses}
                                onClick={closeAllMenus}
                              >
                                {chapter.name}
                              </Link>
                            ))}
                            <div className="mt-2 border-t border-slate-200 pt-2">
                              <Link
                                href="/chapters"
                                className="block px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500 transition hover:text-slate-700"
                                onClick={closeAllMenus}
                              >
                                View All Chapters
                              </Link>
                            </div>
                          </>
                        ) : (
                          <p className="px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                            Chapters coming soon
                          </p>
                        )}
                      </div>
                    ) : null}
                  </li>
                );
              }

              return (
                <li key={item.key}>
                  <Link href={item.href ?? "#"} className={desktopLinkClasses} onClick={closeAllMenus}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href={portalLink.href}
            className="inline-flex items-center gap-2 rounded-full bg-[#5bb3ff] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#031a3a] shadow transition hover:bg-white hover:text-[#031a3a]"
          >
            {portalLink.label}
          </Link>
        </div>

        <button
          type="button"
          className="flex items-center justify-center rounded-md border border-white/20 p-2 text-white lg:hidden"
          aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
          onClick={handleNavToggle}
        >
          {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </nav>

      {isMenuOpen ? (
        <div className="lg:hidden">
          <div className="border-t border-white/10 bg-[#042652]">
            <div className="space-y-2 px-4 py-4">
              {navItems.map((item) => {
                if (item.type === "dropdown") {
                  return (
                    <div key={item.key} className="rounded-lg bg-white/5 p-3">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between text-sm font-semibold uppercase tracking-[0.28em] text-white"
                        aria-expanded={mobileDropdownOpen}
                        onClick={() => setMobileDropdownOpen((prev) => !prev)}
                      >
                        {item.label}
                        <ChevronDownIcon
                          className={`h-5 w-5 transition ${mobileDropdownOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {mobileDropdownOpen ? (
                        <div className="mt-3 space-y-2">
                          {chaptersLoading ? (
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Loading...</p>
                          ) : chapters.length > 0 ? (
                            chapters.map((chapter) => (
                              <Link
                                key={chapter.slug}
                                href={`/chapters/${chapter.slug}`}
                                className="block rounded-md bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/90 transition hover:bg-white/15"
                                onClick={closeAllMenus}
                              >
                                {chapter.name}
                              </Link>
                            ))
                          ) : (
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Chapters coming soon</p>
                          )}
                          <Link
                            href="/chapters"
                            className="block rounded-md border border-white/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-white/10"
                            onClick={closeAllMenus}
                          >
                            View All Chapters
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.key}
                    href={item.href ?? "#"}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-white/10"
                    onClick={closeAllMenus}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href={portalLink.href}
                className="mt-2 block rounded-lg border border-[#3aa8ff] px-3 py-2 text-center text-sm font-semibold uppercase tracking-[0.3em] text-[#3aa8ff] transition hover:border-[#63bfff] hover:text-[#63bfff]"
                onClick={closeAllMenus}
              >
                {portalLink.label}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
