import { Reveal } from '@/components/decor/Reveal';

const ITEMS = [
  {
    tag: 'Ponto de partida',
    title: 'O problema',
    text: 'Comida sobra numa ponta da cadeia enquanto famílias passam necessidade na outra — um descompasso logístico, não de produção.',
    now: false,
  },
  {
    tag: '2025 · Lei nº 15.224',
    title: 'O que ela garante — e onde ela para',
    text: 'Protege juridicamente quem doa de boa-fé, cria o Selo Doador de Alimentos e autoriza incentivos fiscais — mas depende de regulamentação futura, de adesão voluntária de cada estabelecimento e de verba disponível para sair do papel.',
    now: false,
  },
  {
    tag: 'Agora',
    title: 'ELO',
    text: 'A plataforma que transforma o princípio da lei em prática: conectar quem doa e quem recebe, de verdade, em qualquer cidade do Brasil.',
    now: true,
  },
];

export function Timeline() {
  return (
    <section className="border-t border-line py-20">
      <div className="mx-auto max-w-[1140px] px-7">
        <Reveal>
          <div className="mb-[42px] max-w-[64ch]">
            <span className="mb-3 block font-mono text-[12.5px] uppercase tracking-wide text-ember-deep">
              03 · De onde vem a ideia
            </span>
            <h2 className="text-[clamp(25px,3.3vw,35px)] font-bold tracking-tight">
              A lei já aponta o caminho. Faltava quem construísse a ponte.
            </h2>
            <p className="mt-3.5 text-base text-ink-soft">
              A Lei nº 15.224/2025, que criou a Política Nacional de Combate à Perda e ao Desperdício de Alimentos,
              chega a citar, entre seus princípios, a importância de aplicativos e sites que aproximem diretamente
              quem quer doar de quem quer receber. A lei abre a porta — mas não constrói a ferramenta. É aí que
              entra a ELO.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {ITEMS.map((it) => (
              <div
                key={it.title}
                className={
                  'rounded-[14px] border p-6 transition-all hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(14,17,22,.08)] ' +
                  (it.now
                    ? 'border-signal bg-gradient-to-b from-signal-tint to-transparent to-60%'
                    : 'border-line bg-card')
                }
              >
                <span className={'font-mono text-[13px] font-medium ' + (it.now ? 'text-signal-deep' : 'text-ember-deep')}>
                  {it.tag}
                </span>
                <h3 className="mt-2 text-[19px] font-bold">{it.title}</h3>
                <p className="mt-2.5 text-[14.5px] text-ink-soft">{it.text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
