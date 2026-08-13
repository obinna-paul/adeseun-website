"use client";

import Link from "next/link";
import { Dialog } from "@base-ui/react/dialog";
import { X } from "@phosphor-icons/react/dist/ssr";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SITE_ROOMS } from "@/lib/navigation";

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
 * Every room is listed here, including The Foyer — unlike the desktop
 * header, where the Monogram already serves as the implicit "home" link
 * and repeating it as a text link would be redundant right next to it.
 * A full-screen drawer doesn't have that adjacency problem, so it lists
 * the complete, literal room list, matching the 404 page's "here's
 * everywhere you can go" convention.
 */
export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-hero-ground/90 backdrop-blur-md transition-opacity duration-300 ease-gallery-out data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 lg:hidden" />
        <Dialog.Popup className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-2 outline-none animate-nook-expand data-[ending-style]:animate-nook-collapse lg:hidden">
          <Dialog.Close
            aria-label="Close menu"
            data-cursor="link"
            data-cursor-text="Close"
            className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-control text-text-on-dark/80 transition-colors duration-150 ease-gallery-standard hover:text-gold"
          >
            <X size={24} weight="light" />
          </Dialog.Close>

          <Dialog.Title className="sr-only">Site navigation</Dialog.Title>

          <nav aria-label="Site" className="flex flex-col items-center gap-6">
            {SITE_ROOMS.map((room) =>
              room.built ? (
                <Link
                  key={room.href}
                  href={room.href}
                  onClick={onClose}
                  data-cursor="link"
                  aria-current={pathname === room.href ? "page" : undefined}
                  className={cn(
                    "font-display text-4xl font-semibold transition-colors duration-200 ease-gallery-standard",
                    pathname === room.href ? "text-gold" : "text-text-on-dark hover:text-gold",
                  )}
                >
                  {room.name}
                </Link>
              ) : (
                <span
                  key={room.href}
                  aria-disabled="true"
                  className="flex items-baseline gap-2 font-display text-4xl font-semibold text-text-on-dark/30"
                >
                  {room.name}
                  <span className="font-mono text-xs uppercase tracking-[0.1em] text-text-on-dark/20">Soon</span>
                </span>
              ),
            )}
          </nav>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
