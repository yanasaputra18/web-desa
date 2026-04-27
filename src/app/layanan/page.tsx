import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import { getPublicSiteData } from "@/lib/public-data";
import { placeholderImages } from "@/lib/placeholder-images";

export default async function LayananPage() {
  const { settings, services } = await getPublicSiteData();

  return (
    <>
      <Navbar villageName={settings?.village_name} />
      <main className="bg-white">
        <PageHero
          eyebrow="Layanan Desa"
          title="Informasi layanan warga"
          description="Lihat jenis layanan dan syarat yang perlu disiapkan sebelum datang ke kantor desa."
          imageUrl={settings?.hero_image_url || placeholderImages.hero}
        />

        <section className="bg-slate-50 py-16 md:py-20">
          <div className="container-main grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service: any) => (
              <div key={service.id} className="card-soft p-7">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
                  📄
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {service.name}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {service.description}
                </p>
                <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Syarat
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    {service.requirements}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
