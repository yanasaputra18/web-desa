export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container-main py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Website Resmi
            </p>
            <h3 className="mt-2 text-xl font-bold text-slate-900">
              Desa Sukamaju
            </h3>
            <p className="mt-3 max-w-sm text-sm leading-7 text-slate-600">
              Portal informasi desa yang memudahkan warga mengakses layanan,
              berita, galeri kegiatan, dan kontak resmi pemerintah desa.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">
              Menu
            </h4>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
              <a href="#profil" className="hover:text-emerald-700">
                Profil Desa
              </a>
              <a href="#layanan" className="hover:text-emerald-700">
                Layanan
              </a>
              <a href="#berita" className="hover:text-emerald-700">
                Berita
              </a>
              <a href="#galeri" className="hover:text-emerald-700">
                Galeri
              </a>
              <a href="#kontak" className="hover:text-emerald-700">
                Kontak
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">
              Kontak
            </h4>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>Jl. Raya Desa Sukamaju No. 1</p>
              <p>Kecamatan Contoh, Kabupaten Contoh</p>
              <p>0812-3456-7890</p>
              <p>desasukamaju@email.com</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-500">
          © 2026 Desa Sukamaju. Semua hak dilindungi.
        </div>
      </div>
    </footer>
  );
}
