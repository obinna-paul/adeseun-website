import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type TextLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  /** Override the resting (non-hover) color for dark/non-default backgrounds — defaults to --color-text. */
  tone?: string;
};

/**
 * For links inside running prose — see the `.link-gradient` class in
 * globals.css for the actual hover effect. Deliberately no `data-cursor`
 * here: the expanding 40px circle is right for a nav item or a card, but
 * disruptive mid-sentence — the gradient wipe alone is the affordance
 * for inline text.
 */
export function TextLink({ href, children, className, tone }: TextLinkProps) {
  const isExternal = /^https?:\/\//.test(href) || href.startsWith("mailto:");
  const classes = cn("link-gradient", className);
  const style = tone ? ({ "--link-text-color": tone } as CSSProperties) : undefined;

  if (isExternal) {
    return (
      <a href={href} className={classes} style={style} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} style={style}>
      {children}
    </Link>
  );
}
