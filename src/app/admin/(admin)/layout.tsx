import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

import { cookies } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMock = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("abcdefghijklmnop");
  const cookieStore = await cookies();
  const hasMockSession = cookieStore.get("mock_admin_session")?.value === "true";

  let profile = null;
  let user = null;

  if (isMock) {
    if (!hasMockSession) {
      redirect("/admin/login");
    }
    user = { email: "admin@desa.com", id: "mock_id" };
    profile = { full_name: "Admin Desa (Bypass Mode)", role: "admin" };
  } else {
    const supabase = await createClient();

    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();

    if (!supabaseUser) {
      redirect("/admin/login");
    }

    const { data: supabaseProfile } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", supabaseUser.id)
      .maybeSingle();

    if (!supabaseProfile || supabaseProfile.role !== "admin") {
      redirect("/");
    }

    user = supabaseUser;
    profile = supabaseProfile;
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <AdminSidebar fullName={profile.full_name} email={user.email} />
      <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
    </div>
  );
}
