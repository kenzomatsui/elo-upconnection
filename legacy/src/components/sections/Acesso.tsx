import { Reveal } from '@/components/decor/Reveal';
import { AccessPanel } from './AccessPanel';

export function Acesso() {
  return (
    <section id="acesso" className="border-t border-line py-20">
      <div className="mx-auto max-w-[1140px] px-7">
        <Reveal>
          <div className="mb-[42px] max-w-[64ch]">
            <span className="mb-3 block font-mono text-[12.5px] uppercase tracking-wide text-ember-deep">
              08 · Acesso à rede
            </span>
            <h2 className="text-[clamp(25px,3.3vw,35px)] font-bold tracking-tight">Entre ou cadastre-se.</h2>
          </div>

          <p className="mb-8 max-w-[74ch] rounded-[10px] border border-line bg-card px-4 py-3.5 text-[13.5px] text-ink-soft">
            <b className="text-ink">Nota do protótipo:</b> este é o MVP do Desafio Escolas Inovadoras. Os cadastros
            abaixo já salvam de verdade no seu navegador, para você poder testar o fluxo — mas ficam guardados
            localmente, sem criptografia. Não use senhas reais.
          </p>

          <div className="grid grid-cols-1 items-start gap-[26px] lg:grid-cols-2">
            <AccessPanel role="entidade" />
            <AccessPanel role="empresa" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
