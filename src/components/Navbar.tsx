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
  { key: "contact", label: "Contact", href: "/#contact" }
];

const portalLink = {
  label: "Portal",
  href: "/#contact"
};

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [chapters, setChapters] = useState<ChapterSummary[]>([]);
  const [chaptersLoading, setChaptersLoading] = useState(true);
  const dropdownTimeoutRef = useRef<number | null>(null);
  const dropdownContainerRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-primary-navy/95 shadow-xl backdrop-blur-lg border-b border-white/10 py-3" : "bg-primary-navy/90 backdrop-blur-md border-b border-white/10 py-4"}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3.5 group" onClick={closeAllMenus}>
          <span className="relative h-11 w-11 overflow-hidden rounded-xl border border-white/20 bg-white p-1 shadow-sm transition-transform duration-300 group-hover:scale-105">
            <Image
              src={siteMetadata.brand?.logo.src ?? "/brand/ieee-bubt-sb-logo.svg"}
              alt={siteMetadata.brand?.logo.alt ?? "IEEE BUBT Student Branch logo"}
              fill
              sizes="44px"
              priority
              className="object-contain"
            />
          </span>
          <span className="hidden text-sm font-bold tracking-wider text-white transition-colors duration-300 group-hover:text-cyan-soft sm:block">
            {siteMetadata.shortTitle}
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <ul className="flex items-center gap-1">
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
                      className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/90 transition-all duration-200 hover:bg-white/10 hover:text-white"
                      aria-expanded={isOpen}
                      onClick={handleDesktopDropdownToggle}
                    >
                      {item.label}
                      <ChevronDownIcon className={`h-3 w-3 transition-transform duration-300 ${isOpen ? "rotate-180 text-cyan-soft" : ""}`} />
                    </button>
                    {isOpen ? (
                      <div className="absolute left-0 top-full z-50 pt-3 animate-fade-in-up">
                        <div className="w-64 overflow-hidden rounded-2xl bg-white p-2 text-slate-900 shadow-2xl ring-1 ring-black/5">
                          {chaptersLoading ? (
                            <p className="px-4 py-3 text-xs font-semibold text-slate-400">
                              Loading societies...
                            </p>
                          ) : chapters.length > 0 ? (
                            <>
                              {chapters.map((chapter) => (
                                <Link
                                  key={chapter.slug}
                                  href={`/chapters/${chapter.slug}`}
                                  className="block rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-100 hover:text-primary"
                                  onClick={closeAllMenus}
                                >
                                  {chapter.name}
                                </Link>
                              ))}
                              <div className="mt-1 border-t border-slate-100 pt-1">
                                <Link
                                  href="/chapters"
                                  className="block rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-primary transition-all duration-200 hover:bg-primary/5"
                                  onClick={closeAllMenus}
                                >
                                  View All Societies →
                                </Link>
                              </div>
                            </>
                          ) : (
                            <p className="px-4 py-3 text-xs font-semibold text-slate-400">
                              Societies coming soon
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
                  <Link
                    href={item.href ?? "#"}
                    className="inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/90 transition-all duration-200 hover:bg-white/10 hover:text-white"
                    onClick={closeAllMenus}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href={portalLink.href}
            className="ml-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-light to-cyan-soft px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            {portalLink.label}
          </Link>
        </div>

        <button
          type="button"
          className="flex items-center justify-center rounded-xl p-2 text-white hover:bg-white/10 lg:hidden"
          aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
          onClick={handleNavToggle}
        >
          {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </nav>

      {isMenuOpen ? (
        <div className="border-t border-white/10 bg-primary-navy px-6 py-6 lg:hidden animate-fade-in">
          <div className="space-y-2">
            {navItems.map((item) => {
              if (item.type === "dropdown") {
                return (
                  <div key={item.key} className="border-b border-white/10 py-2">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between py-2 text-xs font-bold uppercase tracking-wider text-white"
                      aria-expanded={mobileDropdownOpen}
                      onClick={() => setMobileDropdownOpen((prev) => !prev)}
                    >
                      {item.label}
                      <ChevronDownIcon
                        className={`h-4 w-4 transition-transform duration-300 ${mobileDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {mobileDropdownOpen ? (
                      <div className="mt-2 space-y-1 pl-4 pb-2">
                        {chaptersLoading ? (
                          <p className="text-xs text-white/60">Loading societies...</p>
                        ) : chapters.length > 0 ? (
                          chapters.map((chapter) => (
                            <Link
                              key={chapter.slug}
                              href={`/chapters/${chapter.slug}`}
                              className="block py-2 text-xs font-medium text-white/80 transition-all hover:text-white"
                              onClick={closeAllMenus}
                            >
                              {chapter.name}
                            </Link>
                          ))
                        ) : (
                          <p className="text-xs text-white/60">Societies coming soon</p>
                        )}
                        <Link
                          href="/chapters"
                          className="block py-2 text-xs font-bold uppercase tracking-wider text-cyan-soft"
                          onClick={closeAllMenus}
                        >
                          View All Societies →
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
                  className="block border-b border-white/10 py-3 text-xs font-bold uppercase tracking-wider text-white/90 transition-all hover:text-cyan-soft"
                  onClick={closeAllMenus}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-4">
              <Link
                href={portalLink.href}
                className="block w-full rounded-full bg-gradient-to-r from-primary-light to-cyan-soft px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-white shadow-md"
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

