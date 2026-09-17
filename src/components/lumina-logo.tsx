import { cn } from "@/lib/utils";
import lumyesLogo from "@/assets/lumyes-logo.svg";

export function LuminaMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 132 132" className={cn("size-9 shrink-0", className)} aria-hidden="true">
      <image href={lumyesLogo} width="500" height="132" />
    </svg>
  );
}

export function LuminaLogo({
  className,
  compact = false,
  inverse = false,
}: {
  className?: string;
  compact?: boolean;
  inverse?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      {compact ? (
        <LuminaMark />
      ) : inverse ? (
        <>
          <LuminaMark />
          <span className="font-display text-xl font-bold tracking-[-0.05em] text-white">Lumyes</span>
        </>
      ) : (
        <img src={lumyesLogo} alt="Lumyes" className="h-8 w-auto" />
      )}
    </span>
  );
}
