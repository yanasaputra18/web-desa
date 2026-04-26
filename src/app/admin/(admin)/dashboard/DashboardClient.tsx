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

  const [tab, setTab] = useState<"posts" | "services" | "gallery">("posts");
  const [loading, setLoading] = useState(true);

  const [posts, setPosts] = useState<Post[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

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

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);

    const [postsRes, servicesRes, galleryRes] = await Promise.all([
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
    ]);

    setPosts((postsRes.data as Post[]) ?? []);
    setServices((servicesRes.data as Service[]) ?? []);
    setGalleryItems((galleryRes.data as GalleryItem[]) ?? []);
    setLoading(false);
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

    if (postForm.id) {
      await supabase.from("posts").update(payload).eq("id", postForm.id);
    } else {
      await supabase.from("posts").insert(payload);
    }

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

    if (serviceForm.id) {
      await supabase.from("services").update(payload).eq("id", serviceForm.id);
    } else {
      await supabase.from("services").insert(payload);
    }

    setServiceForm({
      id: 0,
      name: "",
      description: "",
      requirements: "",
      sort_order: 1,
      is_active: true,
    });

    loadAll();
  }

  async function saveGallery(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      title: galleryForm.title,
      image_url: galleryForm.image_url,
      description: galleryForm.description,
    };

    if (galleryForm.id) {
      await supabase
        .from("gallery_items")
        .update(payload)
        .eq("id", galleryForm.id);
    } else {
      await supabase.from("gallery_items").insert(payload);
    }

    setGalleryForm({
      id: 0,
      title: "",
      image_url: "",
      description: "",
    });

    loadAll();
  }

  async function deleteRow(table: string, id: number) {
    const ok = window.confirm("Yakin mau hapus data ini?");
    if (!ok) return;

    await supabase.from(table).delete().eq("id", id);
    loadAll();
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
    </div>
  );
}
