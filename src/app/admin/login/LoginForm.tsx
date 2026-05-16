"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, getIdToken } from "firebase/auth";
import { FaGoogle } from "react-icons/fa";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const showPostLogoutActions = useMemo(() => searchParams?.get("from") === "logout", [searchParams]);

  async function handleLogin(idToken: string) {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ idToken })
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: "Login failed." }));
      throw new Error(payload.error ?? "Login failed.");
    }

    router.push("/admin");
    router.refresh();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      
      const idToken = await getIdToken(userCredential.user);
      await handleLogin(idToken);
    } catch (loginError: any) {
      setError(loginError.message || (isSignUp ? "Unable to create account." : "Unable to login."));
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setIsSubmitting(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const idToken = await getIdToken(userCredential.user);
      await handleLogin(idToken);
    } catch (loginError: any) {
      setError(loginError.message || "Unable to login with Google.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl shadow-slate-950/40 backdrop-blur">
      <h1 className="heading-font text-2xl font-semibold text-white">Admin Portal</h1>
      <p className="mt-3 text-sm text-slate-300">Access the dashboard to manage homepage content and media.</p>
      {showPostLogoutActions ? (
        <div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-sm text-slate-200">
          <p>You have been signed out.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:border-white hover:bg-white/10"
            >
              Back to Home
            </button>
            <button
              type="button"
              onClick={() => router.replace("/admin/login")}
              className="inline-flex items-center justify-center rounded-full border border-primary-light/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-primary-light transition hover:border-primary-light hover:text-white"
            >
              Sign in Again
            </button>
          </div>
        </div>
      ) : null}
      
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-3 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <FaGoogle /> Sign in with Google
      </button>

      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-white/10"></div>
        <span className="mx-4 flex-shrink-0 text-xs text-white/40 uppercase">Or email</span>
        <div className="flex-grow border-t border-white/10"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-primary focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-primary focus:outline-none"
          />
        </div>
        {error ? <p className="text-sm text-amber-300">{error}</p> : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-primary to-primary-light px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Processing..." : isSignUp ? "Create Account" : "Sign in"}
        </button>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="text-xs text-white/70 hover:text-white transition"
          >
            {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
          </button>
        </div>
      </form>
    </div>
  );
}
