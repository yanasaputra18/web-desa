import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    redirect("/admin/login?error=profile-error");
  }

  if (!profile) {
    redirect("/admin/login?error=profile-not-found");
  }

  if (profile.role !== "admin") {
    redirect("/admin/login?error=not-admin");
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <AdminSidebar fullName={profile.full_name} email={user.email ?? ""} />
      <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
    </div>
  );
}