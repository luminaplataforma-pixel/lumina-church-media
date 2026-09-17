import { cn } from "@/lib/utils";

export function LuminaMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden="true">
      <circle
        cx="16"
        cy="16"
        r="13"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        opacity="0.95"
      />
      <path
        d="M8.3 11.5A10.1 10.1 0 0 1 16 6.8"
        fill="none"
        stroke="#E0FF33"
        strokeLinecap="round"
        strokeWidth="3.2"
      />
      <circle cx="16" cy="16" r="4.1" fill="currentColor" />
      <circle cx="16" cy="16" r="1.7" fill="#E0FF33" />
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
        <span className="font-display text-lg font-semibold tracking-tight">Lumyes</span>
      )}
    </span>
  );
}
