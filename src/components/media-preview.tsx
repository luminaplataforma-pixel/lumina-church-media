import { ImageOff } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const VIDEO_RE = /\.(mp4|webm|mov|m4v)(\?|$)/i;

/**
 * Renders an actual visual preview for any image/video URL (uploaded or external),
 * with a graceful fallback when the resource cannot be loaded.
 */
export function MediaPreview({
  url,
  alt,
  className,
  rounded = "rounded-lg",
}: {
  url?: string | null;
  alt: string;
  className?: string;
  rounded?: string;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [url]);

  const base = cn(
    "relative flex items-center justify-center overflow-hidden bg-muted",
    rounded,
    className,
  );

  if (!url || failed) {
    return (
      <div className={base}>
        <div className="flex flex-col items-center gap-1 text-muted-foreground">
          <ImageOff className="size-5" />
          <span className="text-[11px]">{failed ? "Falha ao carregar" : "Sem imagem"}</span>
        </div>
      </div>
    );
  }

  if (VIDEO_RE.test(url)) {
    return (
      <div className={base}>
        <video
          src={url}
          className="size-full object-cover"
          controls
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className={base}>
      <img
        src={url}
        alt={alt}
        loading="lazy"
        className="size-full object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
