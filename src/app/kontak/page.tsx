import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import { getPublicSiteData } from "@/lib/public-data";
import { placeholderImages } from "@/lib/placeholder-images";

function formatWhatsappLink(
  phone?: string | null,
  villageName?: string | null,
) {
  const number = phone?.replace(/\D/g, "") || "6281234567890";
  const text = encodeURIComponent(
    `Halo admin ${villageName ?? "desa"}, saya ingin bertanya terkait layanan desa.`,
  );
  return `https://wa.me/${number}?text=${text}`;
}

export default async function KontakPage() {
  const { settings } = await getPublicSiteData();
  const whatsappLink = formatWhatsappLink(
    settings?.whatsapp,
    settings?.village_name,
  );

  return (
    <>
      <Navbar />
      <main className="bg-white">
        <PageHero
          eyebrow="Kontak Desa"
          title="Hubungi pemerintah desa"
          description="Sampaikan pertanyaan, kebutuhan layanan, atau informasi penting melalui kanal resmi desa."
          imageUrl={settings?.contact_image_url || placeholderImages.contact}
        />

        <section className="py-16 md:py-20">
          <div className="container-main grid gap-6 lg:grid-cols-2">
            <div className="card-soft overflow-hidden">
              <div className="relative aspect-[16/11]">
                <Image
                  src={placeholderImages.contact}
                  alt="Kontak desa"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="card-soft p-8">
              <h2 className="text-2xl font-bold text-slate-900">
                Informasi Kontak
              </h2>
              <div className="mt-6 space-y-4 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">Alamat:</span>{" "}
                  {settings?.address ?? "-"}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Telepon:</span>{" "}
                  {settings?.phone ?? "-"}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Email:</span>{" "}
                  {settings?.email ?? "-"}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Wilayah:</span>{" "}
                  {settings?.district ?? "-"}, {settings?.regency ?? "-"},{" "}
                  {settings?.province ?? "-"}
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                >
                  Chat WhatsApp
                </a>
                <a
                  href={settings?.google_maps_url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                >
                  Lihat Lokasi
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
