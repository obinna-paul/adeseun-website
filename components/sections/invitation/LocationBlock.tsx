import { MapPin } from "@phosphor-icons/react/dist/ssr";
import { CitySilhouette } from "./CitySilhouette";
import { SocialLinks } from "./SocialLinks";
import { LOCATION_LABEL } from "./invitation-content";

export function LocationBlock() {
  return (
    <div className="flex flex-col gap-8 border-t border-line-whisper pt-10">
      <div>
        <div className="flex items-center gap-2 text-text-subdued">
          <MapPin size={16} weight="light" />
          <span className="font-mono text-xs uppercase tracking-[0.12em]">{LOCATION_LABEL}</span>
        </div>
        <CitySilhouette className="mt-4 h-10 w-full max-w-xs text-gold-ink" />
      </div>
      <SocialLinks />
    </div>
  );
}
