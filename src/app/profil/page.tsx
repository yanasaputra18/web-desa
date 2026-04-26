import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import { getPublicSiteData } from "@/lib/public-data";
import { placeholderImages } from "@/lib/placeholder-images";

export default async function ProfilPage() {
  const { settings, officials } = await getPublicSiteData();

  return (
    <>
      <Navbar />
      <main className="bg-white">
        <PageHero
          eyebrow="Profil Desa"
          title={`Mengenal ${settings?.village_name ?? "Desa Sukamaju"}`}
          description="Informasi umum desa, semangat pelayanan, dan aparatur desa yang siap melayani masyarakat."
          imageUrl={settings?.profile_image_url || placeholderImages.profile}
        />

        <section className="py-16 md:py-20">
          <div className="container-main grid gap-5 lg:grid-cols-3">
            <div className="card-soft p-7 lg:col-span-2">
              <h2 className="text-2xl font-bold text-slate-900">
                Tentang Desa
              </h2>
              <p className="mt-4 text-sm leading-8 text-slate-600 md:text-base">
                {settings?.village_name ?? "Desa Sukamaju"} berkomitmen
                menghadirkan pelayanan yang cepat, informasi yang tertata, dan
                komunikasi publik yang mudah dijangkau oleh warga.
              </p>
            </div>

            <div className="card-soft p-7">
              <h3 className="text-xl font-bold text-slate-900">
                Informasi Wilayah
              </h3>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">Alamat:</span>{" "}
                  {settings?.address ?? "-"}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">
                    Kecamatan:
                  </span>{" "}
                  {settings?.district ?? "-"}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">
                    Kabupaten:
                  </span>{" "}
                  {settings?.regency ?? "-"}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">
                    Provinsi:
                  </span>{" "}
                  {settings?.province ?? "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="container-main mt-12">
            <h3 className="text-2xl font-bold text-slate-900">Aparatur Desa</h3>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {(officials.length ? officials : new Array(4).fill(null)).map(
                (official: any, index: number) => (
                  <div key={official?.id ?? index} className="card-soft p-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-bold text-emerald-700">
                      {official?.name?.charAt(0) ?? "A"}
                    </div>
                    <h4 className="mt-5 text-lg font-bold text-slate-900">
                      {official?.name ?? "Nama Aparatur"}
                    </h4>
                    <p className="mt-1 text-sm text-slate-600">
                      {official?.position ?? "Jabatan"}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
