import { useEffect, useState, useCallback } from 'react';
import { AnimatedNumber } from '@/components/motion-primitives/animated-number';
import { Reveal } from '@/components/decor/Reveal';
import { EMP_PREFIX, ENT_PREFIX, getAllRecords, type Empresa } from '@/lib/storage';

export function Indicadores() {
  const [kg, setKg] = useState(0);
  const [doacoes, setDoacoes] = useState(0);
  const [entidades, setEntidades] = useState(0);
  const [empresas, setEmpresas] = useState(0);

  const refresh = useCallback(async () => {
    const emp = await getAllRecords<Empresa>(EMP_PREFIX);
    const ent = await getAllRecords(ENT_PREFIX);
    let totalKg = 0;
    let totalDoacoes = 0;
    emp.forEach((e) => {
      totalKg += e.data.kgDoado || 0;
      totalDoacoes += e.data.doacoes || 0;
    });
    setKg(totalKg);
    setDoacoes(totalDoacoes);
    setEntidades(ent.length);
    setEmpresas(emp.length);
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener('elo:refresh', refresh);
    return () => window.removeEventListener('elo:refresh', refresh);
  }, [refresh]);

  const KPIS = [
    { ic: 'Kg', value: kg, decimals: 1, label: 'evitados do descarte' },
    { ic: 'Doações', value: doacoes, decimals: 0, label: 'registradas na rede' },
    { ic: 'Entidades', value: entidades, decimals: 0, label: 'cadastradas para receber' },
    { ic: 'Empresas', value: empresas, decimals: 0, label: 'parceiras cadastradas' },
  ];

  return (
    <section className="border-t border-line py-20">
      <div className="mx-auto max-w-[1140px] px-7">
        <Reveal>
          <div className="mb-[42px] max-w-[64ch]">
            <span className="mb-3 block font-mono text-[12.5px] uppercase tracking-wide text-ember-deep">
              06 · Indicadores da rede
            </span>
            <h2 className="text-[clamp(25px,3.3vw,35px)] font-bold tracking-tight">O que a rede já está medindo.</h2>
            <p className="mt-3.5 text-base text-ink-soft">
              Números reais desta demonstração, somados a cada novo cadastro e a cada doação registrada.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
            {KPIS.map((k) => (
              <div
                key={k.ic}
                className="rounded-[14px] border border-line bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(14,17,22,.08)]"
              >
                <span className="font-mono text-xs uppercase tracking-wide text-signal-deep">{k.ic}</span>
                <div className="mt-2.5 font-mono text-[28px] font-bold tabular-nums">
                  <AnimatedNumber value={k.value} decimals={k.decimals} />
                </div>
                <p className="mt-1.5 text-[13px] text-ink-soft">{k.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
