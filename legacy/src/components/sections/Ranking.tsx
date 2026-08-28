import { useEffect, useState, useCallback } from 'react';
import { EMP_PREFIX, getAllRecords, type Empresa } from '@/lib/storage';
import { fmt } from '@/lib/format';
import { Reveal } from '@/components/decor/Reveal';

type Row = { key: string; data: Empresa };

export function Ranking() {
  const [rows, setRows] = useState<Row[]>([]);

  const refresh = useCallback(async () => {
    const empresas = await getAllRecords<Empresa>(EMP_PREFIX);
    const sorted = empresas
      .filter((e) => (e.data.kgDoado || 0) > 0)
      .sort((a, b) => (b.data.kgDoado || 0) - (a.data.kgDoado || 0))
      .slice(0, 5);
    setRows(sorted);
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener('elo:refresh', refresh);
    return () => window.removeEventListener('elo:refresh', refresh);
  }, [refresh]);

  return (
    <section id="ranking" className="border-t border-line py-20">
      <div className="mx-auto max-w-[1140px] px-7">
        <Reveal>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-[64ch]">
              <span className="mb-3 block font-mono text-[12.5px] uppercase tracking-wide text-ember-deep">
                01 · Ranking de impacto
              </span>
              <h2 className="text-[clamp(25px,3.3vw,35px)] font-bold tracking-tight">
                Quem está doando mais para a própria comunidade.
              </h2>
              <p className="mt-3.5 text-base text-ink-soft">
                Toda doação registrada por uma empresa parceira entra automaticamente aqui. O ranking é público e
                atualizado em tempo real — pense nele como um placar nacional de generosidade.
              </p>
            </div>
          </div>

          {rows.length === 0 ? (
            <div className="rounded-[14px] border border-dashed border-line bg-card p-10 text-center text-[14.5px] text-ink-soft">
              Ainda não há doações registradas nesta demonstração. Cadastre-se como empresa lá embaixo e seja a
              primeira do ranking nacional.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-[14px] border border-line bg-card">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {['#', 'Empresa', 'Cidade/UF', 'Setor', 'Kg doados', 'Doações'].map((h) => (
                      <th
                        key={h}
                        className="border-b border-line px-4 py-3.5 text-left font-mono text-[11.5px] font-medium uppercase tracking-wide text-ink-faint"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r.key} className="border-b border-line last:border-none hover:bg-ember-tint">
                      <td className="px-4 py-[15px] font-mono text-[14.5px] text-ink-faint">{i + 1}</td>
                      <td className="px-4 py-[15px] text-[14.5px]">{r.data.nome || '—'}</td>
                      <td className="px-4 py-[15px] text-[14.5px]">{(r.data.cidade || '—') + '/' + (r.data.uf || '—')}</td>
                      <td className="px-4 py-[15px] text-[14.5px]">{r.data.setor || '—'}</td>
                      <td className="px-4 py-[15px] font-mono text-[14.5px] font-medium">{fmt(r.data.kgDoado)} kg</td>
                      <td className="px-4 py-[15px] font-mono text-[14.5px]">{r.data.doacoes || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="mt-4 text-[13px] text-ink-faint">
            Empresas que doam com regularidade também podem solicitar, do governo federal, o Selo Doador de Alimentos
            criado pela Lei nº 15.224/2025.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
