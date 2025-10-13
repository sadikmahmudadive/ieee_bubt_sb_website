"use client";

import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { siteMetadata } from "@/utils/siteMetadata";

const navigation = [
  { name: "Home", href: "#top" },
  { name: "About", href: "#about" },
  { name: "Events", href: "#events" },
  { name: "Team", href: "#team" },
  { name: "Gallery", href: "#gallery" },
  { name: "Contact", href: "#contact" }
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-950/95 via-slate-950/70 to-transparent" />
      <nav className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-slate-950/70 px-6 py-4 shadow-lg shadow-slate-950/40 backdrop-blur-xl">
        <a
          href="#top"
          className="heading-font text-sm font-semibold uppercase tracking-[0.5em] text-white transition hover:text-primary-light"
        >
          {siteMetadata.shortTitle}
        </a>
        <div className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-300 transition hover:text-white"
            >
              {item.name}
            </a>
          ))}
          <a
            href="#join"
            className="rounded-full bg-gradient-to-r from-primary to-primary-light px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.4em] text-white shadow-glow transition hover:shadow-lg hover:shadow-primary/30"
          >
            Join IEEE
          </a>
        </div>
        <button
          className="md:hidden text-slate-200"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Close navigation" : "Open navigation"}
        >
          {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </nav>
      {open ? (
        <div className="md:hidden">
          <div className="mx-auto mt-3 w-[92%] rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-slate-950/40 backdrop-blur-xl">
            <div className="space-y-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block text-xs font-semibold uppercase tracking-[0.35em] text-slate-200"
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <a
                href="#join"
                className="block rounded-full bg-gradient-to-r from-primary to-primary-light px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.4em] text-white"
                onClick={() => setOpen(false)}
              >
                Join IEEE
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
