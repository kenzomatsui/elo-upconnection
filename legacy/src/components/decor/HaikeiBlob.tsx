type HaikeiBlobProps = {
  className?: string;
  fill?: string;
};

/**
 * Organic blob shape generated with Haikei (app.haikei.app), recolored to
 * match the ELO brand palette. Purely decorative.
 */
export function HaikeiBlob({ className, fill = 'var(--color-ember-tint)' }: HaikeiBlobProps) {
  return (
    <svg viewBox="0 0 500 500" className={className} aria-hidden="true">
      <path
        d="M136.7 -133.7C186.7 -86.7 243.4 -43.4 239.5 -3.9C235.6 35.6 171.2 71.2 121.2 103.8C71.2 136.5 35.6 166.3 0.1 166.1C-35.4 166 -70.7 136 -116.7 103.4C-162.7 70.7 -219.4 35.4 -236.8 -17.4C-254.2 -70.2 -232.5 -140.5 -186.5 -187.5C-140.5 -234.5 -70.2 -258.2 -13.4 -244.8C43.4 -231.4 86.7 -180.7 136.7 -133.7"
        fill={fill}
        transform="translate(250 250)"
      />
    </svg>
  );
}
