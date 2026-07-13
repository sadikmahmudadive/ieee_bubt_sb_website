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
  label: "Portal",
  href: "/#contact"
};

const desktopLinkClasses =
  "inline-flex items-center px-4 py-2.5 text-[13px] font-semibold text-white transition-all duration-300 hover:text-cyan-soft hover:underline hover:underline-offset-8 whitespace-nowrap";

const dropdownLinkClasses =
  "block px-4 py-3 text-[13px] font-medium text-slate-700 transition-all duration-300 hover:bg-slate-100 hover:text-primary";

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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-primary-navy/85 text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3 group" onClick={closeAllMenus}>
          <span className="relative h-12 w-12 overflow-hidden rounded border border-white/15 bg-white p-1 transition-all duration-300">
            <Image
              src={siteMetadata.brand?.logo.src ?? "/brand/ieee-bubt-sb-logo.svg"}
              alt={siteMetadata.brand?.logo.alt ?? "IEEE BUBT Student Branch logo"}
              fill
              sizes="48px"
              priority
              className="object-contain"
            />
          </span>
          <span className="hidden text-sm font-semibold tracking-[0.18em] text-white transition-colors duration-300 md:block">{siteMetadata.shortTitle}</span>
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          <ul className="flex items-center">
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
                      <ChevronDownIcon className={`h-3 w-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen ? (
                      <div className="absolute left-0 top-full z-50 pt-2">
                        <div className="w-64 bg-white py-2 text-slate-900 shadow-xl border border-slate-200">
                          {chaptersLoading ? (
                            <p className="px-4 py-2 text-[12px] font-semibold text-slate-500">
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
                              <div className="mt-2 border-t border-slate-100 pt-2">
                                <Link
                                  href="/chapters"
                                  className="block px-4 py-2 text-[12px] font-semibold text-primary transition-all duration-300 hover:bg-slate-50"
                                  onClick={closeAllMenus}
                                >
                                  View All Chapters →
                                </Link>
                              </div>
                            </>
                          ) : (
                            <p className="px-4 py-2 text-[12px] font-semibold text-slate-500">
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
            className="ml-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white px-5 py-2 text-[13px] font-semibold text-primary transition-all duration-300 hover:bg-cyan-soft hover:text-white"
          >
            {portalLink.label}
          </Link>
        </div>

        <button
          type="button"
          className="flex items-center justify-center p-2 text-white hover:bg-primary-dark lg:hidden"
          aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
          onClick={handleNavToggle}
        >
          {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </nav>

      {isMenuOpen ? (
        <div className="lg:hidden">
          <div className="border-t border-white/10 bg-primary-navy">
            <div className="px-4 py-4">
              {navItems.map((item) => {
                if (item.type === "dropdown") {
                  return (
                    <div key={item.key} className="border-b border-primary-dark py-2">
                    <button
                      type="button"
                        className="flex w-full items-center justify-between py-2 text-sm font-semibold text-white"
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
                            <p className="text-xs text-white/80">Loading chapters...</p>
                          ) : chapters.length > 0 ? (
                            chapters.map((chapter) => (
                              <Link
                                key={chapter.slug}
                                href={`/chapters/${chapter.slug}`}
                                className="block py-2 text-sm font-medium text-white/90 transition-all hover:text-white"
                                onClick={closeAllMenus}
                              >
                                {chapter.name}
                              </Link>
                            ))
                          ) : (
                            <p className="text-xs text-white/80">Chapters coming soon</p>
                          )}
                          <Link
                            href="/chapters"
                            className="block py-2 text-sm font-semibold text-white/90 hover:text-white"
                            onClick={closeAllMenus}
                          >
                            View All Chapters →
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
                    className="block border-b border-white/10 py-3 text-sm font-semibold text-white transition-all hover:bg-white/5 hover:text-cyan-soft"
                    onClick={closeAllMenus}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-4">
                <Link
                  href={portalLink.href}
                  className="block w-full rounded-full border border-white/20 bg-white px-4 py-3 text-center text-sm font-semibold text-primary transition-all hover:bg-cyan-soft hover:text-white"
                  onClick={closeAllMenus}
                >
                  {portalLink.label}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
