import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import { getPublicSiteData } from "@/lib/public-data";
import { placeholderImages } from "@/lib/placeholder-images";

export default async function GaleriPage() {
  const { settings, galleryItems } = await getPublicSiteData();

  return (
    <>
      <Navbar villageName={settings?.village_name} />
      <main className="bg-white">
        <PageHero
          eyebrow="Galeri Desa"
          title="Dokumentasi kegiatan desa"
          description="Foto kegiatan masyarakat, pelayanan, pembangunan, dan momen penting di desa."
          imageUrl={placeholderImages.gallery[0]}
        />

        <section className="bg-slate-50 py-16 md:py-20">
          <div className="container-main grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {(galleryItems.length ? galleryItems : new Array(6).fill(null)).map(
              (item: any, index: number) => (
                <div
                  key={item?.id ?? index}
                  className="card-soft overflow-hidden"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={
                        item?.image_url ||
                        placeholderImages.gallery[
                          index % placeholderImages.gallery.length
                        ]
                      }
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
              ),
            )}
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
