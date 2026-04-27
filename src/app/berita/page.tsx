import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import { getPublicSiteData } from "@/lib/public-data";
import { placeholderImages } from "@/lib/placeholder-images";

export default async function BeritaPage() {
  const { settings, posts } = await getPublicSiteData();

  return (
    <>
      <Navbar villageName={settings?.village_name} />
      <main className="bg-white">
        <PageHero
          eyebrow="Berita Desa"
          title="Kabar terbaru dari desa"
          description="Kegiatan, pengumuman, agenda, dan informasi resmi desa."
          imageUrl={placeholderImages.news[0]}
        />

        <section className="py-16 md:py-20">
          <div className="container-main grid gap-5 lg:grid-cols-3">
            {posts.map((post: any, index: number) => (
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
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
