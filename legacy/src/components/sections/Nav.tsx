const LINKS = [
  { href: '#ranking', label: 'Ranking' },
  { href: '#problema', label: 'O problema' },
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#acesso', label: 'Acesso' },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1140px] items-center justify-between gap-4 px-7 py-4">
        <div className="flex items-center gap-2 text-[21px] font-bold tracking-tight">
          <span className="inline-block h-[9px] w-[9px] rounded-full bg-ember shadow-[0_0_0_3px_rgba(239,134,0,.22)]" />
          ELO
        </div>
        <nav className="hidden gap-6 text-[14.5px] sm:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative py-1 text-ink-soft transition-colors hover:text-ink"
            >
              {l.label}
              <span className="absolute inset-x-0 bottom-0 h-[2px] origin-right scale-x-0 bg-ember transition-transform duration-200 group-hover:origin-left group-hover:scale-x-100" />
            </a>
          ))}
        </nav>
        <a
          href="#acesso"
          className="whitespace-nowrap rounded-full bg-ink px-[18px] py-[9px] text-[14px] font-semibold text-paper transition-all hover:-translate-y-px hover:bg-[#22262D]"
        >
          Acessar a rede
        </a>
      </div>
    </header>
  );
}
