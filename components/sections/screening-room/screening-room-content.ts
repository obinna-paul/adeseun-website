/**
 * Content for The Screening Room (/screening-room) — real YouTube
 * clips of her speaking at various functions in her professional
 * capacity, supplied directly as links. IDs below are parsed straight
 * out of the supplied URLs (both the `youtu.be/<id>` and
 * `youtube.com/shorts/<id>` forms carry the video ID as the last path
 * segment before any `?si=`/`?feature=` query string) — nothing
 * invented, nothing looked up.
 *
 * `format` distinguishes a Short (vertical, 9:16) from a standard
 * upload (horizontal, 16:9) so VideoGrid can size each card to its
 * real aspect instead of cropping one shape into the other.
 *
 * No fabricated titles or captions — the real title is whatever
 * YouTube's own embed shows once a card is played (this repo's WebFetch
 * has YouTube's oEmbed endpoint blocked, so there's no way to pull the
 * real titles in ahead of time without inventing them). `label` is a
 * plain, honest placeholder ("Appearance 01"...) for the card grid and
 * for the accessible name before playback — not a description of what
 * the clip actually contains.
 *
 * 14 clips. Started at a stated 19; three of the supplied links turned
 * out to duplicate ones already here (see sr-08/09/10) and the count was
 * closed out at 16 rather than chased further; two more (a pair of red-
 * carpet appearance clips) were pulled per direct instruction, and the
 * remaining ones renumbered so the sequence stays contiguous rather than
 * skipping the removed slots. If more ever get supplied, they just
 * append to this array — nothing else needs to change, VideoGrid and
 * the page both already just map over it.
 */

export type ScreeningRoomVideo = {
  id: string;
  youtubeId: string;
  format: "video" | "short";
  label: string;
};

export const SCREENING_ROOM_VIDEOS: ScreeningRoomVideo[] = [
  { id: "sr-01", youtubeId: "3643cb-BXtI", format: "video", label: "Appearance 01" },
  { id: "sr-02", youtubeId: "2baUb7-711A", format: "video", label: "Appearance 02" },
  { id: "sr-03", youtubeId: "HTU7vKSWKtc", format: "video", label: "Appearance 03" },
  { id: "sr-04", youtubeId: "iF5AjYmNyMg", format: "short", label: "Appearance 04" },
  { id: "sr-05", youtubeId: "9oxJqbsD3K4", format: "short", label: "Appearance 05" },
  { id: "sr-06", youtubeId: "nTNzDtqw7P4", format: "short", label: "Appearance 06" },
  { id: "sr-07", youtubeId: "AYOGJjUcPSQ", format: "short", label: "Appearance 07" },
  { id: "sr-08", youtubeId: "8jUQf8SkKxo", format: "short", label: "Appearance 08" },
  { id: "sr-09", youtubeId: "HxDkJjZoA9M", format: "short", label: "Appearance 09" },
  { id: "sr-10", youtubeId: "wN0GlAqPbXE", format: "short", label: "Appearance 10" },
  { id: "sr-11", youtubeId: "nXJzYobeXMY", format: "short", label: "Appearance 11" },
  { id: "sr-12", youtubeId: "T_IQRlT8O9w", format: "short", label: "Appearance 12" },
  { id: "sr-13", youtubeId: "vn10M_YV1Nc", format: "short", label: "Appearance 13" },
  { id: "sr-14", youtubeId: "wFzdmDuPwXk", format: "short", label: "Appearance 14" },
];

export const PAGE_EYEBROW = "The Screening Room";
export const PAGE_HEADLINE = "Watch her speak.";
export const PAGE_INTRO =
  "Real appearances, panels, and talks — pulled from wherever she's been in the room. Press play on any of them.";

/**
 * Added when this room moved from /screening-room to /media as part of
 * the executive-first restructure — the room's job now covers "Media &
 * Entertainment" broadly, not just her own appearances, so it names the
 * real media companies alongside the clips. Company names/roles are the
 * same already-confirmed facts as study-content.ts's CREDENTIAL_GROUPS
 * and the "threesixty" timeline milestone, not new claims.
 */
export const MEDIA_COMPANIES_LINE =
  "Alongside these appearances: Vice President, 360Africa Media Group — and 360AfricaTv, Universal Worship Network among the platforms she's built or leads.";
