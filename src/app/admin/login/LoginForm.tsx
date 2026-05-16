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
    <div className="mx-auto w-full max-w-md space-y-6 border border-slate-200 bg-white p-10 shadow-lg">
      <h1 className="heading-font text-2xl font-semibold text-slate-900">Admin Portal</h1>
      <p className="mt-3 text-sm text-slate-600">Access the dashboard to manage homepage content and media.</p>
      {showPostLogoutActions ? (
        <div className="border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p>You have been signed out.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="inline-flex items-center justify-center rounded-none border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-700 transition hover:border-primary hover:text-primary hover:bg-white"
            >
              Back to Home
            </button>
            <button
              type="button"
              onClick={() => router.replace("/admin/login")}
              className="inline-flex items-center justify-center rounded-none border border-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary transition hover:bg-primary hover:text-white"
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
        className="flex w-full items-center justify-center gap-3 rounded-none border border-slate-300 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wider text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <FaGoogle className="text-primary" /> Sign in with Google
      </button>

      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="mx-4 flex-shrink-0 text-xs text-slate-400 uppercase">Or email</span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-none border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-none border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        {error ? <p className="text-sm text-red-600 font-medium">{error}</p> : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-3 rounded-none bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
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
            className="text-xs text-slate-500 hover:text-primary transition font-medium"
          >
            {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
          </button>
        </div>
      </form>
    </div>
  );
}
