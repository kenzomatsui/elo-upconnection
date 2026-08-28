import { AnimatedNumber } from '@/components/motion-primitives/animated-number';
import { TextEffect } from '@/components/motion-primitives/text-effect';
import { HaikeiBlob } from '@/components/decor/HaikeiBlob';
import { NetworkDiagram } from './NetworkDiagram';

const STATS = [
  { prefix: '≈', value: 46, decimals: 0, suffix: ' mi t', label: 'de alimentos desperdiçados no Brasil todo ano — cerca de 30% de tudo que produzimos (IBGE)' },
  { prefix: '', value: 24.2, decimals: 1, suffix: '%', label: 'dos domicílios brasileiros conviviam com algum grau de insegurança alimentar em 2024 (IBGE)' },
  { prefix: '', value: 10, decimals: 0, suffix: 'º', label: 'posição do Brasil no ranking mundial de países que mais desperdiçam comida (ONU/FAO)' },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-10 pt-[58px]">
      <HaikeiBlob className="pointer-events-none absolute -right-40 -top-32 w-[560px] opacity-70 sm:-right-24" />

      <div className="relative mx-auto max-w-[1140px] px-7">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-ember/30 bg-ember-tint px-3 py-1.5 font-mono text-[12.5px] uppercase tracking-wide text-ember-deep">
          Desafio Escolas Inovadoras 2026 · HJ Tech × Lovable
        </span>

        <TextEffect
          as="h1"
          per="word"
          preset="fade-in-blur"
          className="max-w-[16ch] text-[34px] font-bold leading-[1.08] tracking-tight sm:text-[46px] lg:text-[58px]"
        >
          A terra que alimenta o Brasil também pode alimentar quem está ao lado.
        </TextEffect>

        <p className="mt-[22px] max-w-[58ch] text-lg text-ink-soft">
          <b className="font-semibold text-ink">ELO</b> é a rede que conecta, em qualquer cidade do Brasil, empresas
          com excedente de alimentos às instituições que atendem quem precisa. A Lei nº 15.224/2025 já abriu esse
          caminho — a ELO é a ferramenta que faltava para percorrê-lo.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#acesso"
            className="inline-flex items-center gap-2 rounded-[10px] bg-signal px-[22px] py-[13px] text-[15px] font-semibold text-ink transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(0,194,206,.35)]"
          >
            Sou uma entidade — quero receber
          </a>
          <a
            href="#acesso"
            className="inline-flex items-center gap-2 rounded-[10px] bg-ember px-[22px] py-[13px] text-[15px] font-semibold text-ink transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(239,134,0,.35)]"
          >
            Sou uma empresa — quero doar
          </a>
          <a
            href="#como-funciona"
            className="inline-flex items-center gap-2 rounded-[10px] border border-line px-[22px] py-[13px] text-[15px] font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-ink-faint hover:bg-ink/[.03]"
          >
            Ver como funciona ↓
          </a>
        </div>

        <div className="mt-[54px] grid grid-cols-1 gap-[22px] border-t border-line pt-[26px] sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label} className="transition-transform hover:-translate-y-[3px]">
              <b className="block font-mono text-[29px]">
                {s.prefix}
                <AnimatedNumber value={s.value} decimals={s.decimals} className="tabular-nums" />
                {s.suffix}
              </b>
              <span className="mt-[5px] block max-w-[28ch] text-[13px] text-ink-soft">{s.label}</span>
            </div>
          ))}
        </div>

        <NetworkDiagram />
      </div>
    </section>
  );
}
