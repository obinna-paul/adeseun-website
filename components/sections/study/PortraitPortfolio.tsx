import Image from "next/image";

const PORTRAITS = [
  {
    src: "/images/portraits/ideas-author.jpg",
    alt: "Portrait of Adeseun Oyeneye",
    width: 2783,
    height: 3480,
    className: "min-h-[28rem] sm:min-h-[34rem] lg:col-span-5 lg:row-span-2 lg:min-h-0",
    objectPosition: "50% 18%",
  },
  {
    src: "/images/portraits/home-desktop.jpg",
    alt: "Full-length portrait of Adeseun Oyeneye in a gold gown",
    width: 2783,
    height: 3480,
    className: "min-h-[24rem] lg:col-span-3 lg:row-span-2 lg:mt-16 lg:min-h-0",
    objectPosition: "50% 10%",
  },
  {
    src: "/images/portraits/atrium-hero.jpg",
    alt: "Adeseun Oyeneye seated at a desk",
    width: 2782,
    height: 3480,
    className: "min-h-[24rem] lg:col-span-4 lg:row-span-1 lg:min-h-0",
    objectPosition: "50% 24%",
  },
  {
    src: "/images/portraits/impact.jpg",
    alt: "Full-length portrait of Adeseun Oyeneye",
    width: 2782,
    height: 3480,
    className: "min-h-[28rem] lg:col-span-4 lg:row-span-2 lg:min-h-0",
    objectPosition: "50% 12%",
  },
  {
    src: "/images/portraits/about-mobile.jpg",
    alt: "Adeseun Oyeneye in traditional attire",
    width: 2318,
    height: 3480,
    className: "min-h-[24rem] lg:col-span-4 lg:row-span-1 lg:min-h-0",
    objectPosition: "34% 20%",
  },
  {
    src: "/images/portraits/about-desktop.jpg",
    alt: "Black-and-white portrait of Adeseun Oyeneye",
    width: 2316,
    height: 3480,
    className: "min-h-[24rem] lg:col-span-4 lg:row-span-1 lg:min-h-0",
    objectPosition: "50% 24%",
  },
] as const;

export function PortraitPortfolio() {
  return (
    <section className="bg-ground px-gutter pb-room" aria-label="Portraits of Adeseun Oyeneye">
      <div className="mx-auto max-w-frame">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-[16rem_16rem_16rem]">
          {PORTRAITS.map((portrait) => (
            <figure
              key={portrait.src}
              className={`relative overflow-hidden rounded-frame bg-surface-sunken ${portrait.className}`}
            >
              <Image
                src={portrait.src}
                alt={portrait.alt}
                fill
                sizes="(min-width: 1024px) 34vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
                style={{ objectPosition: portrait.objectPosition }}
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
