"use client";

import Link from "next/link";
import { Dialog } from "@base-ui/react/dialog";
import { X } from "@phosphor-icons/react/dist/ssr";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SITE_PAGES } from "@/lib/navigation";

/**
 * The hamburger's destination — base-ui's Dialog again (same primitive
 * BookModal uses), not hand-rolled open-state/focus-trap/Escape logic:
 * per pick-ui-library, a real primitive already solves keyboard focus
 * trapping and returning focus to the trigger on close, so hand-rolling
 * it here would just be reinventing what's already vendored in.
 *
 * Full-screen and centered rather than a slide-in drawer from the side —
 * this site has no other "panel slides in from an edge" precedent to
 * extend (The Invitation's Library modal on mobile is a bottom sheet,
 * a different, content-specific pattern for something with a cover
 * image and description, not a plain link list), and a plain fade+scale
 * (the same `animate-nook-expand`/`nookCollapse` keyframes BookModal
 * already uses) keeps one transition vocabulary across the two modal
 * surfaces the site has, rather than introducing a third.
 *
 * Every page is listed here — unlike the desktop header, which only
 * shows `primary`-flagged pages and relies on the Monogram as the
 * implicit "home" link. A full-screen drawer doesn't have the header's
 * space constraint, so it lists the complete site map — but with 9 real
 * pages, showing all of them at the same giant `text-4xl` would read as
 * a wall of identical links. Primary pages keep that large display
 * treatment; secondary pages (Executive Profile, Speaking, Awards,
 * Impact) render smaller below a divider — same two-tier idea Header
 * already applies, just both tiers visible here instead of one being
 * header-only.
 */
export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const primaryPages = SITE_PAGES.filter((page) => page.primary);
  const secondaryPages = SITE_PAGES.filter((page) => !page.primary);

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-hero-ground/90 backdrop-blur-md transition-opacity duration-300 ease-gallery-out data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 lg:hidden" />
        <Dialog.Popup className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-2 overflow-y-auto py-24 outline-none animate-nook-expand data-[ending-style]:animate-nook-collapse lg:hidden">
          <Dialog.Close
            aria-label="Close menu"
            data-cursor="link"
            data-cursor-text="Close"
            className="fixed right-6 top-6 flex h-11 w-11 items-center justify-center rounded-control text-text-on-dark/80 transition-colors duration-150 ease-gallery-standard hover:text-gold"
          >
            <X size={24} weight="light" />
          </Dialog.Close>

          <Dialog.Title className="sr-only">Site navigation</Dialog.Title>

          <nav aria-label="Site" className="flex flex-col items-center gap-5">
            <Link
              href="/"
              onClick={onClose}
              data-cursor="link"
              aria-current={pathname === "/" ? "page" : undefined}
              className={cn(
                "font-display text-4xl font-semibold transition-colors duration-200 ease-gallery-standard",
                pathname === "/" ? "text-gold" : "text-text-on-dark hover:text-gold",
              )}
            >
              Home
            </Link>
            {primaryPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                onClick={onClose}
                data-cursor="link"
                aria-current={pathname === page.href ? "page" : undefined}
                className={cn(
                  "font-display text-4xl font-semibold transition-colors duration-200 ease-gallery-standard",
                  pathname === page.href ? "text-gold" : "text-text-on-dark hover:text-gold",
                )}
              >
                {page.name}
              </Link>
            ))}
          </nav>

          <div className="my-4 h-px w-16 bg-text-on-dark/15" aria-hidden="true" />

          <nav aria-label="More" className="flex flex-col items-center gap-4">
            {secondaryPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                onClick={onClose}
                data-cursor="link"
                aria-current={pathname === page.href ? "page" : undefined}
                className={cn(
                  "font-mono text-xs uppercase tracking-[0.12em] transition-colors duration-200 ease-gallery-standard",
                  pathname === page.href ? "text-gold" : "text-text-on-dark/70 hover:text-gold",
                )}
              >
                {page.name}
              </Link>
            ))}
          </nav>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
