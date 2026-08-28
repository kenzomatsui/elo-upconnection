import { Reveal } from '@/components/decor/Reveal';

const ROWS = [
  { label: 'Alimento desperdiçado no Brasil por ano', value: '≈46 mi t' },
  { label: 'Parcela da produção nacional desperdiçada', value: '≈30%' },
  { label: 'Domicílios c/ insegurança alimentar (2024)', value: '24,2%' },
  { label: 'Posição do Brasil no ranking mundial de desperdício', value: '10º' },
];

export function Problema() {
  return (
    <section id="problema" className="border-t border-line py-20">
      <div className="mx-auto max-w-[1140px] px-7">
        <Reveal>
          <div className="mb-[42px] max-w-[64ch]">
            <span className="mb-3 block font-mono text-[12.5px] uppercase tracking-wide text-ember-deep">
              02 · O problema
            </span>
            <h2 className="text-[clamp(25px,3.3vw,35px)] font-bold tracking-tight">
              Um país que alimenta o mundo — e ainda desperdiça muito pelo caminho.
            </h2>
          </div>

          <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-[1.1fr_.9fr]">
            <div>
              <p className="mb-4 text-base text-ink-soft">
                O Brasil é o 5º maior produtor mundial de alimentos, mas está entre os 10 países que mais
                desperdiçam comida do planeta, segundo dados da ONU e da FAO. O problema não é falta de comida: é a
                falta de conexão entre quem tem excedente e quem poderia recebê-lo a tempo, com segurança.
              </p>
              <p className="text-base text-ink-soft">
                Enquanto toneladas de alimento próprio para consumo são descartadas todos os dias — em mercados,
                restaurantes, indústrias e no campo — quase um quarto dos lares brasileiros ainda convive com algum
                grau de insegurança alimentar. Fechar essa distância é o trabalho da ELO.
              </p>
            </div>
            <div className="rounded-[14px] border border-line bg-card px-6 py-[22px]">
              {ROWS.map((r) => (
                <div
                  key={r.label}
                  className="flex items-center justify-between border-b border-line py-3.5 transition-[padding] last:border-none hover:pl-1.5"
                >
                  <span className="text-sm text-ink-soft">{r.label}</span>
                  <span className="font-mono text-base font-medium">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
