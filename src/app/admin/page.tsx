import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAdminSessionFromCookies } from "@/lib/auth";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard | IEEE BUBT SB",
  description: "Manage IEEE BUBT SB events, team profiles, and gallery assets."
};

export default async function AdminPage() {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <AdminDashboard adminUsername={session.username} />
      </div>
    </div>
  );
}
