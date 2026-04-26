import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getPublicSiteData } from "@/lib/public-data";
import { placeholderImages } from "@/lib/placeholder-images";

export default async function HomePage() {
  const { settings, services, posts, galleryItems, officials } =
    await getPublicSiteData();

  return (
    <>
      <Navbar />

      <main className="bg-white">
        <section className="border-b border-slate-200 bg-gradient-to-b from-emerald-50 via-white to-white">
          <div className="container-main grid gap-10 py-14 md:py-20 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="badge-soft">
                Transparan • Informatif • Modern
              </span>

              <h1 className="mt-6 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl lg:text-6xl">
                {settings?.hero_title ?? "Website Resmi Desa Sukamaju"}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                {settings?.hero_subtitle ??
                  "Portal resmi desa untuk profil, berita, layanan, galeri, dan informasi kontak yang lebih mudah diakses warga."}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/layanan" className="btn-primary">
                  Lihat Layanan
                </Link>
                <Link href="/berita" className="btn-secondary">
                  Baca Berita
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="card-soft p-5">
                  <p className="text-3xl font-bold text-emerald-700">
                    {services.length}+
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Layanan desa
                  </p>
                </div>
                <div className="card-soft p-5">
                  <p className="text-3xl font-bold text-emerald-700">
                    {posts.length}+
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Berita terbaru
                  </p>
                </div>
                <div className="card-soft p-5">
                  <p className="text-3xl font-bold text-emerald-700">
                    {officials.length}+
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Aparatur desa
                  </p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="relative aspect-[16/11]">
                <Image
                  src={settings?.hero_image_url || placeholderImages.hero}
                  alt="Desa"
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/65 via-slate-950/25 to-transparent p-6 text-white">
                <p className="text-sm uppercase tracking-[0.2em] text-emerald-100">
                  Selamat Datang
                </p>
                <h2 className="mt-2 text-2xl font-bold">
                  {settings?.village_name ?? "Desa Sukamaju"}
                </h2>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container-main">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <Link
                href="/profil"
                className="card-soft p-6 transition hover:-translate-y-1"
              >
                <h3 className="text-xl font-bold text-slate-900">
                  Profil Desa
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Lihat informasi desa, visi pelayanan, dan aparatur desa.
                </p>
              </Link>

              <Link
                href="/layanan"
                className="card-soft p-6 transition hover:-translate-y-1"
              >
                <h3 className="text-xl font-bold text-slate-900">Layanan</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Informasi syarat dan jenis layanan yang tersedia untuk warga.
                </p>
              </Link>

              <Link
                href="/berita"
                className="card-soft p-6 transition hover:-translate-y-1"
              >
                <h3 className="text-xl font-bold text-slate-900">Berita</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Kegiatan, pengumuman, dan update terbaru dari desa.
                </p>
              </Link>

              <Link
                href="/galeri"
                className="card-soft p-6 transition hover:-translate-y-1"
              >
                <h3 className="text-xl font-bold text-slate-900">Galeri</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Dokumentasi kegiatan desa dalam tampilan visual yang lebih
                  hidup.
                </p>
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 md:py-20">
          <div className="container-main">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="badge-soft">Preview Berita</span>
                <h2 className="section-title mt-5">Berita terbaru desa</h2>
              </div>
              <Link href="/berita" className="btn-secondary">
                Lihat semua
              </Link>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {posts.slice(0, 3).map((post, index) => (
                <Link
                  key={post.id}
                  href={`/berita/${post.slug}`}
                  className="card-soft overflow-hidden transition hover:-translate-y-1"
                >
                  <div className="relative h-56">
                    <Image
                      src={post.cover_url || placeholderImages.news[index % 3]}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                      Berita Desa
                    </p>
                    <h3 className="mt-3 text-xl font-bold leading-snug text-slate-900">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container-main">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="badge-soft">Preview Galeri</span>
                <h2 className="section-title mt-5">
                  Dokumentasi kegiatan desa
                </h2>
              </div>
              <Link href="/galeri" className="btn-secondary">
                Lihat galeri
              </Link>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {(galleryItems.length
                ? galleryItems.slice(0, 6)
                : new Array(6).fill(null)
              ).map((item: any, index) => (
                <div
                  key={item?.id ?? index}
                  className="card-soft overflow-hidden"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={item?.image_url || placeholderImages.gallery[index]}
                      alt={item?.title || "Galeri desa"}
                      fill
                      sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-900">
                      {item?.title ?? "Kegiatan Desa"}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {item?.description ?? "Dokumentasi kegiatan desa."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
