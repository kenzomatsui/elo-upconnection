export function NetworkDiagram() {
  return (
    <div className="mt-13 rounded-[20px] border border-line bg-card px-[18px] pb-3 pt-[22px]">
      <svg viewBox="0 0 760 320" role="img" aria-labelledby="diagTitle diagDesc" className="block max-w-full">
        <title id="diagTitle">Diagrama da rede ELO</title>
        <desc id="diagDesc">
          Mercados, restaurantes, indústrias e produtores de um lado; bancos de alimentos, ONGs, abrigos e igrejas
          do outro — conectados pela plataforma.
        </desc>

        <g stroke="rgba(239,134,0,.32)" strokeWidth={1.6} fill="none">
          <path d="M 130 60 C 230 90, 300 130, 372 172" />
          <path d="M 130 140 C 230 145, 300 160, 372 178" />
          <path d="M 130 220 C 230 210, 300 200, 372 190" />
          <path d="M 130 300 C 230 260, 300 220, 372 190" />
        </g>
        <g stroke="rgba(0,194,206,.32)" strokeWidth={1.6} fill="none">
          <path id="pathR1" d="M 388 172 C 460 130, 530 90, 630 60" />
          <path d="M 388 178 C 460 155, 530 145, 630 140" />
          <path d="M 388 190 C 460 195, 530 210, 630 220" />
          <path id="pathR2" d="M 388 190 C 460 220, 530 260, 630 300" />
        </g>
        <defs>
          <path id="pathL1" d="M 130 60 C 230 90, 300 130, 372 172" />
          <path id="pathL2" d="M 130 300 C 230 260, 300 220, 372 190" />
        </defs>

        {/* doadores */}
        <g fontFamily="IBM Plex Mono, monospace" fontSize={12} fill="rgba(14,17,22,.72)">
          <g className="node origin-center transition-transform hover:scale-[1.22]">
            <circle cx={130} cy={60} r={7} fill="#EF8600" />
            <text x={145} y={55}>Mercados</text>
            <text x={145} y={70} fill="rgba(14,17,22,.45)" fontSize={10.5}>e mercearias</text>
          </g>
          <g className="node origin-center transition-transform hover:scale-[1.22]">
            <circle cx={130} cy={140} r={7} fill="#EF8600" />
            <text x={145} y={135}>Restaurantes</text>
            <text x={145} y={150} fill="rgba(14,17,22,.45)" fontSize={10.5}>e lanchonetes</text>
          </g>
          <g className="node origin-center transition-transform hover:scale-[1.22]">
            <circle cx={130} cy={220} r={7} fill="#EF8600" />
            <text x={145} y={215}>Indústrias</text>
            <text x={145} y={230} fill="rgba(14,17,22,.45)" fontSize={10.5}>de alimentos</text>
          </g>
          <g className="node origin-center transition-transform hover:scale-[1.22]">
            <circle cx={130} cy={300} r={7} fill="#EF8600" />
            <text x={145} y={295}>Produtores</text>
            <text x={145} y={310} fill="rgba(14,17,22,.45)" fontSize={10.5}>rurais</text>
          </g>
        </g>

        {/* receptores */}
        <g fontFamily="IBM Plex Mono, monospace" fontSize={12} fill="rgba(14,17,22,.72)" textAnchor="end">
          <g className="node origin-center transition-transform hover:scale-[1.22]">
            <circle cx={630} cy={60} r={7} fill="#00C2CE" />
            <text x={615} y={55}>Bancos de</text>
            <text x={615} y={70} fill="rgba(14,17,22,.45)" fontSize={10.5}>alimentos</text>
          </g>
          <g className="node origin-center transition-transform hover:scale-[1.22]">
            <circle cx={630} cy={140} r={7} fill="#00C2CE" />
            <text x={615} y={135}>ONGs e</text>
            <text x={615} y={150} fill="rgba(14,17,22,.45)" fontSize={10.5}>associações</text>
          </g>
          <g className="node origin-center transition-transform hover:scale-[1.22]">
            <circle cx={630} cy={220} r={7} fill="#00C2CE" />
            <text x={615} y={215}>Abrigos</text>
          </g>
          <g className="node origin-center transition-transform hover:scale-[1.22]">
            <circle cx={630} cy={300} r={7} fill="#00C2CE" />
            <text x={615} y={295}>Igrejas e</text>
            <text x={615} y={310} fill="rgba(14,17,22,.45)" fontSize={10.5}>pastorais</text>
          </g>
        </g>

        {/* hub */}
        <g>
          <circle cx={380} cy={181} r={26} fill="#0E1116" />
          <circle cx={366} cy={192} r={3.4} fill="#F4F3F0" />
          <circle cx={378} cy={184} r={3.4} fill="#F4F3F0" />
          <circle cx={390} cy={176} r={3.4} fill="#F4F3F0" />
          <path
            d="M 390 176 L 400 168 M 400 168 L 400 174 M 400 168 L 394 168"
            stroke="#00C2CE"
            strokeWidth={2.4}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <text x={380} y={228} textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight={700} fontSize={13} fill="#0E1116">
          ELO
        </text>

        {/* pulses */}
        <g fill="#EF8600">
          <circle r={4}>
            <animateMotion dur="4.5s" repeatCount="indefinite">
              <mpath href="#pathL1" />
            </animateMotion>
          </circle>
          <circle r={4}>
            <animateMotion dur="5.4s" begin="1.5s" repeatCount="indefinite">
              <mpath href="#pathL2" />
            </animateMotion>
          </circle>
        </g>
        <g fill="#00C2CE">
          <circle r={4}>
            <animateMotion dur="4.5s" begin=".8s" repeatCount="indefinite">
              <mpath href="#pathR1" />
            </animateMotion>
          </circle>
          <circle r={4}>
            <animateMotion dur="5.4s" begin="2.1s" repeatCount="indefinite">
              <mpath href="#pathR2" />
            </animateMotion>
          </circle>
        </g>
      </svg>
      <div className="flex flex-wrap items-baseline justify-between gap-1.5 px-2.5 pb-1 pt-1.5 text-[12.5px] text-ink-faint">
        <span>Esquema ilustrativo — não representa empresas ou instituições reais</span>
        <span className="font-mono text-ink-soft">quem doa ↔ ELO ↔ quem recebe</span>
      </div>
    </div>
  );
}
