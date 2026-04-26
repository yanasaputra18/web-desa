import Image from "next/image";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  imageUrl: string;
};

export default function PageHero({
  eyebrow,
  title,
  description,
  imageUrl,
}: Props) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-white">
      <div className="container-main grid gap-8 py-12 md:grid-cols-2 md:items-center md:py-16">
        <div>
          <span className="badge-soft">{eyebrow}</span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
            {description}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="relative aspect-[16/10]">
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
