"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_url: string | null;
  is_published: boolean;
};

type Service = {
  id: number;
  name: string;
  description: string | null;
  requirements: string | null;
  sort_order: number;
  is_active: boolean;
};

type GalleryItem = {
  id: number;
  title: string;
  image_url: string;
  description: string | null;
};

type SiteSettings = {
  id: number;
  village_name: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  google_maps_url: string;
  district: string;
  regency: string;
  province: string;
  profile_image_url: string;
};

type Official = {
  id: number;
  name: string;
  position: string;
  photo_url: string;
  sort_order: number;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function DashboardClient() {
  const supabase = createClient();

  const [tab, setTab] = useState<
    "posts" | "services" | "gallery" | "settings" | "officials"
  >("posts");
  const [loading, setLoading] = useState(true);

  const [posts, setPosts] = useState<Post[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [officials, setOfficials] = useState<Official[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const [postForm, setPostForm] = useState({
    id: 0,
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_url: "",
    is_published: true,
  });

  const [serviceForm, setServiceForm] = useState({
    id: 0,
    name: "",
    description: "",
    requirements: "",
    sort_order: 1,
    is_active: true,
  });

  const [galleryForm, setGalleryForm] = useState({
    id: 0,
    title: "",
    image_url: "",
    description: "",
  });

  const [settingsForm, setSettingsForm] = useState({
    village_name: "",
    hero_title: "",
    hero_subtitle: "",
    hero_image_url: "",
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    google_maps_url: "",
    district: "",
    regency: "",
    province: "",
    profile_image_url: "",
  });

  const [officialForm, setOfficialForm] = useState({
    id: 0,
    name: "",
    position: "",
    photo_url: "",
    sort_order: 1,
  });

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);

    try {
      const [postsRes, servicesRes, galleryRes, settingsRes, officialsRes] =
        await Promise.all([
          supabase
            .from("posts")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from("services")
            .select("*")
            .order("sort_order", { ascending: true }),
          supabase
            .from("gallery_items")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase.from("site_settings").select("*").limit(1).maybeSingle(),
          supabase
            .from("officials")
            .select("*")
            .order("sort_order", { ascending: true }),
        ]);

      setPosts((postsRes.data as Post[]) ?? []);
      setServices((servicesRes.data as Service[]) ?? []);
      setGalleryItems((galleryRes.data as GalleryItem[]) ?? []);
      setOfficials((officialsRes.data as Official[]) ?? []);

      if (settingsRes.data) {
        setSettings(settingsRes.data as SiteSettings);
        setSettingsForm({
          village_name: settingsRes.data.village_name || "",
          hero_title: settingsRes.data.hero_title || "",
          hero_subtitle: settingsRes.data.hero_subtitle || "",
          hero_image_url: settingsRes.data.hero_image_url || "",
          email: settingsRes.data.email || "",
          phone: settingsRes.data.phone || "",
          whatsapp: settingsRes.data.whatsapp || "",
          address: settingsRes.data.address || "",
          google_maps_url: settingsRes.data.google_maps_url || "",
          district: settingsRes.data.district || "",
          regency: settingsRes.data.regency || "",
          province: settingsRes.data.province || "",
          profile_image_url: settingsRes.data.profile_image_url || "",
        });
      }
    } catch (error) {
      console.error("Load error:", error);
      alert("Gagal memuat data. Cek koneksi Supabase Anda.");
    } finally {
      setLoading(false);
    }
  }

  async function savePost(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      title: postForm.title,
      slug: postForm.slug || slugify(postForm.title),
      excerpt: postForm.excerpt,
      content: postForm.content,
      cover_url: postForm.cover_url,
      is_published: postForm.is_published,
      published_at: postForm.is_published ? new Date().toISOString() : null,
    };

    try {
      if (postForm.id) {
        const { error } = await supabase
          .from("posts")
          .update(payload)
          .eq("id", postForm.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("posts").insert(payload);
        if (error) throw error;
      }

      alert("Berita berhasil disimpan!");
      setPostForm({
        id: 0,
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        cover_url: "",
        is_published: true,
      });

      loadAll();
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  }

  async function saveService(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      name: serviceForm.name,
      description: serviceForm.description,
      requirements: serviceForm.requirements,
      sort_order: Number(serviceForm.sort_order),
      is_active: serviceForm.is_active,
    };

    try {
      if (serviceForm.id) {
        const { error } = await supabase
          .from("services")
          .update(payload)
          .eq("id", serviceForm.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("services").insert(payload);
        if (error) throw error;
      }

      alert("Layanan berhasil disimpan!");
      setServiceForm({
        id: 0,
        name: "",
        description: "",
        requirements: "",
        sort_order: 1,
        is_active: true,
      });

      loadAll();
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  }

  async function saveGallery(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      title: galleryForm.title,
      image_url: galleryForm.image_url,
      description: galleryForm.description,
    };

    try {
      if (galleryForm.id) {
        const { error } = await supabase
          .from("gallery_items")
          .update(payload)
          .eq("id", galleryForm.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("gallery_items").insert(payload);
        if (error) throw error;
      }

      alert("Galeri berhasil disimpan!");
      setGalleryForm({
        id: 0,
        title: "",
        image_url: "",
        description: "",
      });

      loadAll();
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from("site_settings")
        .update(settingsForm)
        .eq("id", 1);
      if (error) throw error;

      alert("Pengaturan berhasil disimpan!");
      loadAll();
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  }

  async function saveOfficial(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      name: officialForm.name,
      position: officialForm.position,
      photo_url: officialForm.photo_url,
      sort_order: Number(officialForm.sort_order),
    };

    try {
      if (officialForm.id) {
        const { error } = await supabase
          .from("officials")
          .update(payload)
          .eq("id", officialForm.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("officials").insert(payload);
        if (error) throw error;
      }

      alert("Aparatur berhasil disimpan!");
      setOfficialForm({
        id: 0,
        name: "",
        position: "",
        photo_url: "",
        sort_order: 1,
      });

      loadAll();
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  }

  async function deleteRow(table: string, id: number) {
    const ok = window.confirm("Yakin mau hapus data ini?");
    if (!ok) return;

    try {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      alert("Data berhasil dihapus!");
      loadAll();
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard CRUD</h1>
        <p className="mt-2 text-slate-600">
          Kelola berita, layanan, dan galeri desa dari satu tempat.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {[
          { key: "posts", label: "Berita" },
          { key: "services", label: "Layanan" },
          { key: "gallery", label: "Galeri" },
          { key: "settings", label: "Pengaturan" },
          { key: "officials", label: "Aparatur" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key as any)}
            className={`rounded-full px-5 py-3 text-sm font-semibold ${
              tab === item.key
                ? "bg-emerald-600 text-white"
                : "border border-slate-200 bg-white text-slate-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-[2rem] bg-white p-6 shadow-sm text-slate-600">
          Memuat data...
        </div>
      ) : null}

      {tab === "posts" && (
        <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <form
            onSubmit={savePost}
            className="rounded-[2rem] bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold text-slate-900">
              {postForm.id ? "Edit Berita" : "Tambah Berita"}
            </h2>

            <div className="mt-5 space-y-4">
              <input
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                placeholder="Judul"
                value={postForm.title}
                onChange={(e) =>
                  setPostForm((s) => ({
                    ...s,
                    title: e.target.value,
                    slug: slugify(e.target.value),
                  }))
                }
                required
              />
              <input
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                placeholder="Slug"
                value={postForm.slug}
                onChange={(e) =>
                  setPostForm((s) => ({ ...s, slug: e.target.value }))
                }
                required
              />
              <input
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                placeholder="Cover URL"
                value={postForm.cover_url}
                onChange={(e) =>
                  setPostForm((s) => ({ ...s, cover_url: e.target.value }))
                }
              />
              <textarea
                className="min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3"
                placeholder="Excerpt"
                value={postForm.excerpt}
                onChange={(e) =>
                  setPostForm((s) => ({ ...s, excerpt: e.target.value }))
                }
              />
              <textarea
                className="min-h-40 w-full rounded-2xl border border-slate-200 px-4 py-3"
                placeholder="Isi berita"
                value={postForm.content}
                onChange={(e) =>
                  setPostForm((s) => ({ ...s, content: e.target.value }))
                }
              />
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={postForm.is_published}
                  onChange={(e) =>
                    setPostForm((s) => ({
                      ...s,
                      is_published: e.target.checked,
                    }))
                  }
                />
                Publish sekarang
              </label>

              <button className="w-full rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white">
                Simpan Berita
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {posts.map((item) => (
              <div
                key={item.id}
                className="rounded-[2rem] bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-emerald-700">
                      {item.is_published ? "Published" : "Draft"}
                    </p>
                    <h3 className="mt-2 text-xl font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {item.excerpt}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setPostForm({
                          id: item.id,
                          title: item.title,
                          slug: item.slug,
                          excerpt: item.excerpt || "",
                          content: item.content || "",
                          cover_url: item.cover_url || "",
                          is_published: item.is_published,
                        })
                      }
                      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteRow("posts", item.id)}
                      className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "services" && (
        <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <form
            onSubmit={saveService}
            className="rounded-[2rem] bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold text-slate-900">
              {serviceForm.id ? "Edit Layanan" : "Tambah Layanan"}
            </h2>

            <div className="mt-5 space-y-4">
              <input
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                placeholder="Nama layanan"
                value={serviceForm.name}
                onChange={(e) =>
                  setServiceForm((s) => ({ ...s, name: e.target.value }))
                }
                required
              />
              <textarea
                className="min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3"
                placeholder="Deskripsi"
                value={serviceForm.description}
                onChange={(e) =>
                  setServiceForm((s) => ({ ...s, description: e.target.value }))
                }
              />
              <textarea
                className="min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3"
                placeholder="Syarat"
                value={serviceForm.requirements}
                onChange={(e) =>
                  setServiceForm((s) => ({
                    ...s,
                    requirements: e.target.value,
                  }))
                }
              />
              <input
                type="number"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                placeholder="Urutan"
                value={serviceForm.sort_order}
                onChange={(e) =>
                  setServiceForm((s) => ({
                    ...s,
                    sort_order: Number(e.target.value),
                  }))
                }
              />
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={serviceForm.is_active}
                  onChange={(e) =>
                    setServiceForm((s) => ({
                      ...s,
                      is_active: e.target.checked,
                    }))
                  }
                />
                Aktif
              </label>

              <button className="w-full rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white">
                Simpan Layanan
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {services.map((item) => (
              <div
                key={item.id}
                className="rounded-[2rem] bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {item.description}
                    </p>
                    <p className="mt-2 text-sm text-emerald-700">
                      Syarat: {item.requirements}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setServiceForm({
                          id: item.id,
                          name: item.name,
                          description: item.description || "",
                          requirements: item.requirements || "",
                          sort_order: item.sort_order,
                          is_active: item.is_active,
                        })
                      }
                      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteRow("services", item.id)}
                      className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "gallery" && (
        <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <form
            onSubmit={saveGallery}
            className="rounded-[2rem] bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold text-slate-900">
              {galleryForm.id ? "Edit Galeri" : "Tambah Galeri"}
            </h2>

            <div className="mt-5 space-y-4">
              <input
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                placeholder="Judul galeri"
                value={galleryForm.title}
                onChange={(e) =>
                  setGalleryForm((s) => ({ ...s, title: e.target.value }))
                }
                required
              />
              <input
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                placeholder="Image URL"
                value={galleryForm.image_url}
                onChange={(e) =>
                  setGalleryForm((s) => ({ ...s, image_url: e.target.value }))
                }
                required
              />
              <textarea
                className="min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3"
                placeholder="Deskripsi"
                value={galleryForm.description}
                onChange={(e) =>
                  setGalleryForm((s) => ({ ...s, description: e.target.value }))
                }
              />

              <button className="w-full rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white">
                Simpan Galeri
              </button>
            </div>
          </form>

          <div className="grid gap-4 md:grid-cols-2">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="rounded-[2rem] bg-white p-6 shadow-sm"
              >
                <h3 className="text-xl font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 break-all text-sm text-slate-500">
                  {item.image_url}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {item.description}
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() =>
                      setGalleryForm({
                        id: item.id,
                        title: item.title,
                        image_url: item.image_url,
                        description: item.description || "",
                      })
                    }
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteRow("gallery_items", item.id)}
                    className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "settings" && (
        <form
          onSubmit={saveSettings}
          className="rounded-[2rem] bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-slate-900">
            Pengaturan Website
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Kelola nama desa, judul hero, dan informasi kontak.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Nama Desa
                </label>
                <input
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3"
                  value={settingsForm.village_name}
                  onChange={(e) =>
                    setSettingsForm((s) => ({
                      ...s,
                      village_name: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Judul Hero (Besar)
                </label>
                <input
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3"
                  value={settingsForm.hero_title}
                  onChange={(e) =>
                    setSettingsForm((s) => ({
                      ...s,
                      hero_title: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Sub-judul Hero
                </label>
                <textarea
                  className="mt-1 min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3"
                  value={settingsForm.hero_subtitle}
                  onChange={(e) =>
                    setSettingsForm((s) => ({
                      ...s,
                      hero_subtitle: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Hero Image URL
                  </label>
                  <input
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3"
                    value={settingsForm.hero_image_url}
                    onChange={(e) =>
                      setSettingsForm((s) => ({
                        ...s,
                        hero_image_url: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Profile Image URL (Halaman Profil)
                  </label>
                  <input
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3"
                    value={settingsForm.profile_image_url}
                    onChange={(e) =>
                      setSettingsForm((s) => ({
                        ...s,
                        profile_image_url: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Kecamatan
                  </label>
                  <input
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3"
                    value={settingsForm.district}
                    onChange={(e) =>
                      setSettingsForm((s) => ({
                        ...s,
                        district: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Kabupaten
                  </label>
                  <input
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3"
                    value={settingsForm.regency}
                    onChange={(e) =>
                      setSettingsForm((s) => ({
                        ...s,
                        regency: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Provinsi
                  </label>
                  <input
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3"
                    value={settingsForm.province}
                    onChange={(e) =>
                      setSettingsForm((s) => ({
                        ...s,
                        province: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Email Kontak
                </label>
                <input
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3"
                  value={settingsForm.email}
                  onChange={(e) =>
                    setSettingsForm((s) => ({
                      ...s,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    No. Telepon
                  </label>
                  <input
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3"
                    value={settingsForm.phone}
                    onChange={(e) =>
                      setSettingsForm((s) => ({
                        ...s,
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    No. WhatsApp
                  </label>
                  <input
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3"
                    value={settingsForm.whatsapp}
                    onChange={(e) =>
                      setSettingsForm((s) => ({
                        ...s,
                        whatsapp: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Alamat Lengkap
                </label>
                <textarea
                  className="mt-1 min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3"
                  value={settingsForm.address}
                  onChange={(e) =>
                    setSettingsForm((s) => ({
                      ...s,
                      address: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Google Maps URL
                </label>
                <input
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3"
                  value={settingsForm.google_maps_url}
                  onChange={(e) =>
                    setSettingsForm((s) => ({
                      ...s,
                      google_maps_url: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <button className="mt-6 w-full rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white md:w-auto">
            Simpan Pengaturan
          </button>
        </form>
      )}

      {tab === "officials" && (
        <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <form
            onSubmit={saveOfficial}
            className="rounded-[2rem] bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold text-slate-900">
              {officialForm.id ? "Edit Aparatur" : "Tambah Aparatur"}
            </h2>

            <div className="mt-5 space-y-4">
              <input
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                placeholder="Nama Lengkap"
                value={officialForm.name}
                onChange={(e) =>
                  setOfficialForm((s) => ({ ...s, name: e.target.value }))
                }
                required
              />
              <input
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                placeholder="Jabatan"
                value={officialForm.position}
                onChange={(e) =>
                  setOfficialForm((s) => ({ ...s, position: e.target.value }))
                }
                required
              />
              <input
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                placeholder="Foto URL"
                value={officialForm.photo_url}
                onChange={(e) =>
                  setOfficialForm((s) => ({ ...s, photo_url: e.target.value }))
                }
              />
              <input
                type="number"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                placeholder="Urutan"
                value={officialForm.sort_order}
                onChange={(e) =>
                  setOfficialForm((s) => ({
                    ...s,
                    sort_order: Number(e.target.value),
                  }))
                }
              />

              <button className="w-full rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white">
                Simpan Aparatur
              </button>
            </div>
          </form>

          <div className="grid gap-4 md:grid-cols-2">
            {officials.map((item) => (
              <div
                key={item.id}
                className="rounded-[2rem] bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-100">
                    {item.photo_url && (
                      <img
                        src={item.photo_url}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{item.name}</h3>
                    <p className="text-sm text-slate-500">{item.position}</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() =>
                      setOfficialForm({
                        id: item.id,
                        name: item.name,
                        position: item.position,
                        photo_url: item.photo_url || "",
                        sort_order: item.sort_order,
                      })
                    }
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteRow("officials", item.id)}
                    className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
