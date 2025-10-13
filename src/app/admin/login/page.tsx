import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAdminSessionFromCookies } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Login | IEEE BUBT SB",
  description: "Secure access to the IEEE BUBT SB content management console."
};

export default async function AdminLoginPage() {
  const session = await getAdminSessionFromCookies();
  if (session) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-24">
      <LoginForm />
    </div>
  );
}
