import { pageMetadata } from "@/lib/seo";
import { InvitationSection } from "@/components/sections/invitation";

export const metadata = pageMetadata({
  title: "The Reception",
  path: "/contact",
  description: "For speaking, advisory, media, partnership, or literary rights — a direct line to her, not a contact form into a queue.",
});

/**
 * Moved from /invitation (see next.config.ts's redirect) as part of the
 * executive-first restructure, and renamed again to "The Reception" —
 * same real form/newsletter/social components, reframed copy (see
 * invitation-content.ts's own doc comment for what changed and why).
 */
export default function ContactPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <InvitationSection />
    </main>
  );
}
