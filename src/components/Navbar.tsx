"use client";

import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { siteMetadata } from "@/utils/siteMetadata";

const navigation = [
  { name: "Overview", href: "/" },
  { name: "About IEEE BUBT", href: "/#about" },
  { name: "Programs & Events", href: "/#events" },
  { name: "Leadership", href: "/#team" },
  { name: "Gallery", href: "/#gallery" },
  { name: "Research & Journals", href: "/research-journals" },
  { name: "Connect", href: "/#contact" }
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-950/95 via-slate-950/70 to-transparent" />
  <nav className="mx-auto mt-4 flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-white/5 px-8 py-4 shadow-[0_25px_60px_-30px_rgba(15,23,42,0.85)] backdrop-blur-xl lg:px-12">
        <a
          href="/"
          className="heading-font whitespace-nowrap text-sm font-semibold uppercase tracking-[0.5em] text-white transition hover:text-primary-light"
        >
          {siteMetadata.shortTitle}
        </a>
        <div className="hidden items-center gap-6 md:flex">
          <ul className="flex flex-nowrap items-center gap-5">
            {navigation.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="group relative inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-200 transition hover:text-white"
                >
                  <span className="absolute inset-x-2 bottom-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-primary-light to-transparent opacity-0 transition group-hover:scale-x-100 group-hover:opacity-100" aria-hidden />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
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
                  className="block rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-200 transition hover:bg-white/10 hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
