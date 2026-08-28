import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Reveal } from '@/components/decor/Reveal';

const ITEMS = [
  {
    value: 'seguranca',
    title: 'Meus dados estão seguros?',
    content:
      'Nesta fase do MVP os cadastros ficam salvos localmente no seu navegador, apenas para você testar o fluxo — sem criptografia, e visíveis a quem estiver testando a mesma página. Na fase de backend, a ELO passa a usar autenticação e banco de dados de verdade, em conformidade com a LGPD.',
  },
  {
    value: 'como-funciona',
    title: 'Como funciona uma doação na prática?',
    content:
      'A empresa cadastra o excedente disponível, a entidade mais próxima reserva o que precisa, e as duas combinam local e horário de retirada diretamente pelo contato já cadastrado — sem intermediários.',
  },
  {
    value: 'produto-final',
    title: 'Isso já é o produto final, ou ainda vai mudar?',
    content:
      'Este é o MVP construído durante a Jornada de Desenvolvimento do Desafio Escolas Inovadoras 2026. A ideia é continuar evoluindo com base em testes reais com usuários, mentorias e feedback da comunidade.',
  },
  {
    value: 'custo',
    title: 'Escolas, empresas ou entidades pagam algo para usar a ELO?',
    content:
      'Não. A ELO nasceu dentro do desafio como uma ferramenta gratuita — o objetivo é reduzir o desperdício de alimentos, não gerar custo para quem doa ou para quem recebe.',
  },
] as const;

export function Faq() {
  return (
    <section className="border-t border-line py-20">
      <div className="mx-auto max-w-[1140px] px-7">
        <Reveal>
          <div className="mb-[42px] max-w-[64ch]">
            <span className="mb-3 block font-mono text-[12.5px] uppercase tracking-wide text-ember-deep">
              07 · Perguntas frequentes
            </span>
            <h2 className="text-[clamp(25px,3.3vw,35px)] font-bold tracking-tight">
              O que as pessoas mais perguntam.
            </h2>
          </div>

          <Accordion type="multiple" defaultValue={['seguranca']} className="w-full max-w-[760px]">
            {ITEMS.map((item) => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger className="flex-row-reverse justify-end gap-3 text-left text-[16px] font-semibold [&_[data-slot=accordion-trigger-icon]]:ml-0">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className="pl-7 text-[14.5px] text-muted-foreground">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
