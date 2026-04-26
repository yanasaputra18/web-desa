"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("abcdefghijklmnop")) {
      document.cookie = "mock_admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } else {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
    >
      Logout
    </button>
  );
}
