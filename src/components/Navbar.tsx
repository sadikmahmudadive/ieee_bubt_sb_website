"use client";

import { useEffect, useRef, useState } from "react";
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
  "inline-flex items-center rounded-md px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-100 transition hover:text-primary-light whitespace-nowrap";

const dropdownLinkClasses =
  "block px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-700 transition hover:bg-slate-100";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [chapters, setChapters] = useState<ChapterSummary[]>([]);
  const [chaptersLoading, setChaptersLoading] = useState(true);
  const dropdownTimeoutRef = useRef<number | null>(null);
  const dropdownContainerRef = useRef<HTMLLIElement | null>(null);

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
    if (dropdownTimeoutRef.current) {
      window.clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setIsDropdownOpen((prev) => !prev);
  };

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    setMobileDropdownOpen(false);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        window.clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isDropdownOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 text-white backdrop-blur-xl">
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
          <span className="hidden text-xs font-medium uppercase tracking-[0.25em] text-slate-200 md:block">{siteMetadata.shortTitle}</span>
        </Link>

        <div className="hidden items-center gap-5 lg:flex">
          <ul className="flex items-center gap-1.5">
            {navItems.map((item) => {
              if (item.type === "dropdown") {
                const isOpen = isDropdownOpen;

                return (
                  <li
                    key={item.key}
                    ref={dropdownContainerRef}
                    className="relative"
                    onMouseEnter={() => {
                      if (dropdownTimeoutRef.current) {
                        window.clearTimeout(dropdownTimeoutRef.current);
                        dropdownTimeoutRef.current = null;
                      }
                      setIsDropdownOpen(true);
                    }}
                    onMouseLeave={() => {
                      if (dropdownTimeoutRef.current) {
                        window.clearTimeout(dropdownTimeoutRef.current);
                      }
                      dropdownTimeoutRef.current = window.setTimeout(() => {
                        setIsDropdownOpen(false);
                      }, 150);
                    }}
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
                      <div className="absolute left-0 top-full z-50 pt-3">
                        <div className="w-64 rounded-xl bg-white py-2 text-slate-900 shadow-2xl ring-1 ring-black/5">
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
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition hover:border-primary-light hover:bg-primary-light/10"
          >
            {portalLink.label}
          </Link>
        </div>

        <button
          type="button"
          className="flex items-center justify-center rounded-md border border-white/15 p-2 text-white lg:hidden"
          aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
          onClick={handleNavToggle}
        >
          {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </nav>

      {isMenuOpen ? (
        <div className="lg:hidden">
          <div className="border-t border-white/10 bg-slate-950/95 backdrop-blur">
            <div className="space-y-2 px-4 py-4">
              {navItems.map((item) => {
                if (item.type === "dropdown") {
                  return (
                    <div key={item.key} className="rounded-lg bg-white/5 p-3">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between text-sm font-medium uppercase tracking-[0.24em] text-white"
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
                                className="block rounded-md bg-white/5 px-3 py-2 text-xs font-medium uppercase tracking-[0.24em] text-white/90 transition hover:bg-white/10"
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
                            className="block rounded-md border border-white/15 px-3 py-2 text-xs font-medium uppercase tracking-[0.24em] text-white transition hover:bg-white/10"
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
                    className="block rounded-lg px-3 py-2 text-sm font-medium uppercase tracking-[0.24em] text-white transition hover:bg-white/10"
                    onClick={closeAllMenus}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href={portalLink.href}
                className="mt-2 block rounded-lg border border-white/15 px-3 py-2 text-center text-sm font-medium uppercase tracking-[0.24em] text-white transition hover:bg-white/10"
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
