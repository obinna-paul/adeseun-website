import { SCREENING_ROOM_VIDEOS, PAGE_EYEBROW, PAGE_HEADLINE, PAGE_INTRO, MEDIA_COMPANIES_LINE } from "./screening-room-content";
import { VideoCard } from "./VideoCard";

/**
 * CSS multi-column masonry, the same mechanism Behind the Curtain uses
 * (components/sections/study/BehindTheCurtain.tsx) — the real reason to
 * reuse it here specifically: the clips are a genuine mix of landscape
 * uploads (16:9) and vertical Shorts (9:16), and a masonry column lets
 * each card keep its own real aspect ratio instead of forcing every clip
 * into one uniform shape (cropping every Short, or padding every
 * landscape upload). A JS masonry library would be reaching for a
 * heavier tool than a `columns-*` layout needs (pick-ui-library).
 */
export function ScreeningRoomSection() {
  return (
    <section className="bg-ground px-gutter py-room" aria-label="The Screening Room">
      <div className="mx-auto max-w-3xl text-center">
        <span className="font-mono text-xs uppercase tracking-[0.15em] text-gold-ink">{PAGE_EYEBROW}</span>
        <h1 className="mt-3 text-balance font-display text-4xl font-semibold text-text sm:text-5xl">
          {PAGE_HEADLINE}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-text-subdued">{PAGE_INTRO}</p>
        <p className="mx-auto mt-3 max-w-xl text-sm text-text-faint">{MEDIA_COMPANIES_LINE}</p>
      </div>

      <div className="mx-auto mt-16 max-w-5xl columns-1 gap-6 sm:columns-2 lg:columns-3">
        {SCREENING_ROOM_VIDEOS.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </section>
  );
}
