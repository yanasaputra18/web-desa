import Link from "next/link";
import LogoutButton from "./LogoutButton";

type Props = {
  fullName?: string | null;
  email?: string | null;
};

export default function AdminSidebar({ fullName, email }: Props) {
  return (
    <aside className="w-full border-b border-slate-200 bg-white lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="p-6">
        <div className="rounded-3xl bg-emerald-600 p-5 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-100">
            Admin Panel
          </p>
          <h2 className="mt-2 text-xl font-bold">Web Desa</h2>
          <p className="mt-2 text-sm text-emerald-50">
            {fullName || "Admin Desa"}
          </p>
          <p className="text-xs text-emerald-100">{email || "-"}</p>
        </div>

        <nav className="mt-6 flex flex-col gap-2">
          <Link
            href="/admin/dashboard"
            className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Dashboard CRUD
          </Link>
          <Link
            href="/"
            className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Kembali ke website
          </Link>
        </nav>

        <div className="mt-6">
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}
