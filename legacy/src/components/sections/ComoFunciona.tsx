import { Reveal } from '@/components/decor/Reveal';

const STEPS = [
  {
    n: '01',
    title: 'Empresa cadastra o excedente',
    text: 'Tipo de alimento, quantidade estimada, condição (in natura, preparado ou embalado) e prazo para retirada — já dentro das normas sanitárias exigidas por lei.',
  },
  {
    n: '02',
    title: 'Entidade vê e reserva',
    text: 'A instituição cadastrada mais próxima visualiza o que está disponível na sua cidade e confirma o interesse antes que o prazo se esgote.',
  },
  {
    n: '03',
    title: 'Combinam a retirada',
    text: 'Empresa e entidade combinam local e horário diretamente, pelo contato já cadastrado — sem intermediários nem burocracia extra.',
  },
  {
    n: '04',
    title: 'Registram o impacto',
    text: 'Os quilos doados entram no ranking da empresa e nos indicadores públicos da rede — histórico que ajuda a embasar o pedido do Selo Doador de Alimentos.',
  },
];

export function ComoFunciona() {
  return (
    <section id="como-funciona" className="border-t border-line py-20">
      <div className="mx-auto max-w-[1140px] px-7">
        <Reveal>
          <div className="mb-[42px] max-w-[64ch]">
            <span className="mb-3 block font-mono text-[12.5px] uppercase tracking-wide text-ember-deep">
              04 · Como funciona
            </span>
            <h2 className="text-[clamp(25px,3.3vw,35px)] font-bold tracking-tight">
              Do excedente ao prato, em quatro passos.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="border-t-2 border-ink pt-4 transition-all hover:-translate-y-[3px] hover:border-ember"
              >
                <span className="font-mono text-[13px] text-ink-faint">{s.n}</span>
                <h3 className="mt-2.5 text-[17px] font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{s.text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
