"use client";

import { useState, type FormEvent } from "react";

type SubmitStatus = "idle" | "loading" | "success" | "duplicate" | "error";

function getStatusMessage(status: SubmitStatus, message: string | null) {
  if (message) {
    return message;
  }

  switch (status) {
    case "success":
      return "Thanks for subscribing! We'll be in touch soon.";
    case "duplicate":
      return "You're already on our quarterly list.";
    case "error":
      return "Something went wrong. Try again in a moment.";
    default:
      return null;
  }
}

export function NewsletterSignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const isLoading = status === "loading";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setStatus("error");
      setMessage("Enter your email to subscribe.");
      return;
    }

    setStatus("loading");
    setMessage(null);

    try {
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, source: "contact-section" })
      });

      const body = await response.json().catch(() => ({}));

      if (response.status === 201) {
        setEmail("");
        setStatus("success");
        setMessage(typeof body.message === "string" ? body.message : null);
        return;
      }

      if (response.status === 200) {
        setStatus("duplicate");
        setMessage(typeof body.message === "string" ? body.message : null);
        return;
      }

      setStatus("error");
      setMessage(typeof body.error === "string" ? body.error : null);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("We couldn't reach the server. Please try again shortly.");
    }
  }

  const hint = getStatusMessage(status, message);
  const hintColor = status === "success" || status === "duplicate" ? "text-emerald-600" : "text-amber-600";

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
      <input
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Your email"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          if (status !== "idle") {
            setStatus("idle");
            setMessage(null);
          }
        }}
        className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none"
        aria-label="Email address"
      />
      <button
        type="submit"
        className="w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.32em] text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isLoading}
      >
        {isLoading ? "Subscribing..." : "Subscribe"}
      </button>
      <p className="text-xs text-slate-500">We respect your privacy. Unsubscribe anytime.</p>
      {hint ? (
        <p className={`text-sm ${hintColor}`} aria-live="polite">
          {hint}
        </p>
      ) : null}
    </form>
  );
}
