import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getPostBySlug } from "@/lib/public-data";
import { placeholderImages } from "@/lib/placeholder-images";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function DetailBeritaPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <>
      <Navbar />
      <main className="bg-white">
        <section className="border-b border-slate-200 bg-slate-50 py-12 md:py-16">
          <div className="container-main max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Berita Desa
            </p>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 md:text-5xl">
              {post.title}
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-600">
              {post.excerpt}
            </p>
          </div>
        </section>

        <section className="py-10 md:py-14">
          <div className="container-main max-w-4xl">
            <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-[2rem] border border-slate-200">
              <Image
                src={post.cover_url || placeholderImages.news[0]}
                alt={post.title}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>

            <article className="prose max-w-none prose-slate">
              <div className="text-base leading-8 text-slate-700 whitespace-pre-line">
                {post.content}
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
