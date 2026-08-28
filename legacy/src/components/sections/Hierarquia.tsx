import { Reveal } from '@/components/decor/Reveal';

const ROWS = [
  {
    n: '01',
    title: 'Prevenir',
    text: 'Planejar compras, produção e estoque para gerar menos sobra desde o início da cadeia.',
    bottom: false,
  },
  {
    n: '02',
    title: 'Doar para consumo humano',
    text: 'Prioridade da lei: alimento próprio para consumo vai primeiro para pessoas, através de bancos de alimentos, ONGs, abrigos e igrejas cadastrados na rede.',
    bottom: false,
  },
  {
    n: '03',
    title: 'Alimentar animais',
    text: 'Quando o alimento já não pode ser consumido por pessoas — passou do ponto ideal, tem defeito estético ou sobrou do processamento — mas ainda é seguro para consumo animal, ele pode virar ração.',
    bottom: false,
  },
  {
    n: '04',
    title: 'Compostar ou gerar energia',
    text: 'Só quando o alimento não serve mais nem para consumo humano nem animal — mofado, contaminado ou misturado a outros resíduos — ele vai para compostagem agrícola ou produção de biomassa para energia.',
    bottom: true,
  },
  {
    n: '05',
    title: 'Descartar',
    text: 'Só depois de esgotadas todas as opções acima — o último recurso, nunca o primeiro.',
    bottom: true,
  },
];

export function Hierarquia() {
  return (
    <section className="border-t border-line py-20">
      <div className="mx-auto max-w-[1140px] px-7">
        <Reveal>
          <div className="mb-[42px] max-w-[64ch]">
            <span className="mb-3 block font-mono text-[12.5px] uppercase tracking-wide text-ember-deep">
              05 · O que vira o quê
            </span>
            <h2 className="text-[clamp(25px,3.3vw,35px)] font-bold tracking-tight">
              Nem tudo que sobra é lixo — e a lei já diz a ordem certa.
            </h2>
            <p className="mt-3.5 text-base text-ink-soft">
              A Lei nº 15.224/2025 estabelece uma ordem de prioridade para o destino de cada alimento excedente. A
              ELO segue essa mesma lógica.
            </p>
          </div>

          <div className="flex max-w-[680px] flex-col">
            {ROWS.map((r) => (
              <div
                key={r.n}
                className="grid grid-cols-[34px_1fr] items-start gap-4 rounded-[10px] border-b border-line py-[18px] pl-3 pr-3 transition-all first:pt-0 last:border-none hover:bg-card hover:pl-4"
              >
                <span className="pt-0.5 font-mono text-[13px] text-signal-deep">{r.n}</span>
                <div>
                  <h4 className={'text-[17px] font-bold ' + (r.bottom ? 'text-ink-faint' : '')}>{r.title}</h4>
                  <p className="mt-[5px] text-sm text-ink-soft">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
