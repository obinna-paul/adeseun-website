import { LinkedinLogo, InstagramLogo, XLogo } from "@phosphor-icons/react/dist/ssr";
import { SOCIAL_LINKS } from "./invitation-content";

const ICONS = { LinkedIn: LinkedinLogo, Instagram: InstagramLogo, X: XLogo } as const;

/**
 * The "elegant hover fill" is `clip-path`, not a background swap —
 * per emil-design-eng, "one of the most powerful animation tools in
 * CSS": a gold disc sits behind the icon clipped to `circle(0%)`, and
 * expands to `circle(100%)` on hover, reading as ink filling the ring
 * rather than a color flicking on.
 */
export function SocialLinks() {
  return (
    <ul className="flex items-center gap-3">
      {SOCIAL_LINKS.map((social) => {
        const Icon = ICONS[social.label as keyof typeof ICONS];
        return (
          <li key={social.label}>
            <a
              href={social.href}
              aria-label={social.label}
              className="group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-line text-text-subdued transition-colors duration-300 ease-gallery-standard hover:border-gold hover:text-text-on-dark active:border-gold active:text-text-on-dark"
            >
              {/* clip-path fill fires on hover AND active, so a touch tap
                  gets the same ink-fill confirmation a mouse hover does —
                  not just the global press-scale. */}
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-gold-fill transition-[clip-path] duration-300 ease-gallery-out [clip-path:circle(0%_at_50%_50%)] group-hover:[clip-path:circle(100%_at_50%_50%)] group-active:[clip-path:circle(100%_at_50%_50%)]"
              />
              <Icon size={18} weight="light" className="relative z-10" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
