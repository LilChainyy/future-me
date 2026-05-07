type LogoProps = {
  size?: number;
  className?: string;
};

/**
 * futureMe brand mark.
 *
 * Concept: a half-sun rising over a horizon line — the future emerging into
 * view — with a single dot on the horizon representing the self looking
 * forward. The mark is themed with the app's clay/ink palette via CSS
 * variables so it adapts to dark mode automatically.
 */
export default function Logo({ size = 28, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="futureMe"
      className={className}
    >
      {/* Soft circular field */}
      <circle
        cx="16"
        cy="16"
        r="15"
        fill="var(--fm-paper-soft)"
        stroke="var(--fm-border-strong)"
        strokeWidth="1"
      />
      {/* Rising sun (future emerging) */}
      <path
        d="M8 19 A8 8 0 0 1 24 19"
        fill="var(--fm-clay)"
        opacity="0.92"
      />
      {/* Horizon line */}
      <line
        x1="6"
        y1="20"
        x2="26"
        y2="20"
        stroke="var(--fm-clay-deep)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* The self — a single point on the horizon, looking forward */}
      <circle cx="16" cy="20" r="1.6" fill="var(--fm-ink)" />
    </svg>
  );
}
