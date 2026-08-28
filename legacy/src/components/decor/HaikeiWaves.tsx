type HaikeiWavesProps = {
  className?: string;
};

/**
 * Wave shape generated with Haikei (app.haikei.app), recolored to match the
 * ELO brand palette — used as a soft divider above the footer.
 */
export function HaikeiWaves({ className }: HaikeiWavesProps) {
  return (
    <svg viewBox="0 351 900 90" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path
        d="M0 351L21.5 354C43 357 86 363 128.8 378.5C171.7 394 214.3 419 257.2 424.2C300 429.3 343 414.7 385.8 409.5C428.7 404.3 471.3 408.7 514.2 405.8C557 403 600 393 642.8 394.3C685.7 395.7 728.3 408.3 771.2 409.8C814 411.3 857 401.7 878.5 396.8L900 392L900 441L0 441Z"
        fill="var(--color-signal-tint)"
      />
    </svg>
  );
}
