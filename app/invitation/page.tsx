import { pageMetadata } from "@/lib/seo";
import { InvitationSection } from "@/components/sections/invitation";

export const metadata = pageMetadata({
  title: "The Invitation",
  path: "/invitation",
  description: "For speaking, consulting, media, or literary rights — a direct line to her, not a contact form into a queue.",
});

export default function InvitationPage() {
  return (
    <main>
      <InvitationSection />
    </main>
  );
}
