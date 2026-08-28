import { HaikeiWaves } from '@/components/decor/HaikeiWaves';

export function Footer() {
  return (
    <footer className="relative border-t border-line">
      <HaikeiWaves className="pointer-events-none absolute -top-[1px] left-0 h-16 w-full" />
      <div className="mx-auto max-w-[1140px] px-7 pb-[60px] pt-[46px]">
        <div className="flex flex-wrap justify-between gap-6 text-[13px] text-ink-faint">
          <div>
            <div className="font-mono text-xs">ELO — [nome da equipe] · Escola [nome da escola]</div>
            <div className="mt-1.5">
              Protótipo para o Desafio Escolas Inovadoras 2026 (HJ Tech × Lovable) · Eixo Cidade Viva / Impacto e
              Inclusão
            </div>
          </div>
          <div className="max-w-[340px]">
            Baseado na{' '}
            <a
              href="https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15224.htm"
              target="_blank"
              rel="noopener"
              className="text-ink-soft underline hover:text-ink"
            >
              Lei nº 15.224/2025
            </a>
            , que institui a Política Nacional de Combate à Perda e ao Desperdício de Alimentos.
          </div>
        </div>
      </div>
    </footer>
  );
}
