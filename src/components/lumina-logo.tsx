import { cn } from "@/lib/utils";

export function LuminaMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden="true">
      <rect width="32" height="32" rx="9" className="fill-primary" />
      <path
        d="M16 6.5c1.2 3.9 3.6 6.3 7.5 7.5-3.9 1.2-6.3 3.6-7.5 7.5-1.2-3.9-3.6-6.3-7.5-7.5 3.9-1.2 6.3-3.6 7.5-7.5Z"
        className="fill-primary-foreground"
      />
      <rect
        x="11"
        y="23.4"
        width="10"
        height="2.4"
        rx="1.2"
        className="fill-primary-foreground opacity-70"
      />
    </svg>
  );
}

export function LuminaLogo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LuminaMark />
      {!compact && (
        <span className="font-display text-lg font-semibold tracking-tight">Lumina</span>
      )}
    </span>
  );
}
