"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The current-page link gets a gold underline that draws itself in (CSS
 * `scaleX`, not `width` — cheap, compositor-only) rather than a static
 * always-on underline: `transform-origin: left`, `scaleX(0)` at rest,
 * `scaleX(1)` when active. Because this is driven by `usePathname()`
 * rather than `:hover`, it animates on real navigation — leaving one
 * page's link and arriving at the next's re-renders both simultaneously,
 * so the old underline retracts as the new one draws in.
 *
 * Deliberately NOT also shown on hover for other links — that's a
 * distinct affordance (see the plain color transition still used
 * elsewhere) and blending the two would make "here" and "hovering"
 * visually ambiguous.
 *
 * No `data-cursor-text` (real feedback: the "Explore" label on every nav
 * item read as distracting, not helpful, on a link whose destination is
 * already spelled out in the link text itself). Still `data-cursor="link"`
 * for the pointer-shape treatment — only the text label is gone.
 */
export function NavLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      data-cursor="link"
      aria-current={isActive ? "page" : undefined}
      className={cn("group relative inline-block w-fit", className)}
    >
      {children}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-500 ease-gallery-out",
          isActive && "scale-x-100",
        )}
      />
    </Link>
  );
}
