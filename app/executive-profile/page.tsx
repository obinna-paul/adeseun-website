import { pageMetadata } from "@/lib/seo";
import { ExecutiveProfileSection } from "@/components/sections/executive-profile";

export const metadata = pageMetadata({
  title: "The Boardroom",
  path: "/executive-profile",
  description: "Career timeline, credentials, and governance — the formal professional-authority layer of the site.",
});

export default function ExecutiveProfilePage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <ExecutiveProfileSection />
    </main>
  );
}
