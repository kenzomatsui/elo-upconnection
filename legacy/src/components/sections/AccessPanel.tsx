import { useState, type FormEvent } from 'react';
import { TransitionPanel } from '@/components/motion-primitives/transition-panel';
import { UF_LIST } from '@/lib/uf';
import { fmt } from '@/lib/format';
import {
  storageGet,
  storageSet,
  slug,
  type Entidade,
  type Empresa,
} from '@/lib/storage';

type Role = 'entidade' | 'empresa';
type Record = Entidade | Empresa;
type View = 'login' | 'cadastro' | 'success';

const CONFIG = {
  entidade: {
    prefix: 'entidade:',
    tag: 'Para quem recebe',
    title: 'Entidade beneficente',
    blurb: 'Bancos de alimentos, ONGs, igrejas, abrigos e associações que recebem doações.',
    typeLabel: 'Tipo',
    typeOptions: [
      'Banco de alimentos',
      'ONG / Associação social',
      'Igreja / Pastoral',
      'Abrigo / Casa de acolhimento',
      'Escola / Creche',
      'Outro',
    ],
    nameLabel: 'Nome da entidade',
    submitLabel: 'Cadastrar entidade',
    accent: 'signal' as const,
  },
  empresa: {
    prefix: 'empresa:',
    tag: 'Para quem doa',
    title: 'Empresa doadora',
    blurb: 'Mercados, restaurantes, padarias, indústrias e produtores com excedente de alimentos.',
    typeLabel: 'Setor',
    typeOptions: [
      'Supermercado / Mercearia',
      'Restaurante / Lanchonete',
      'Padaria / Panificadora',
      'Indústria de alimentos',
      'Produtor rural / Agricultura familiar',
      'Outro',
    ],
    nameLabel: 'Nome da empresa',
    submitLabel: 'Cadastrar empresa',
    accent: 'ember' as const,
  },
};

function isEmpresa(role: Role, r: Record): r is Empresa {
  return role === 'empresa';
}

export function AccessPanel({ role }: { role: Role }) {
  const cfg = CONFIG[role];
  const [tab, setTab] = useState<'login' | 'cadastro'>('login');
  const [view, setView] = useState<View>('login');
  const [record, setRecord] = useState<Record | null>(null);
  const [key, setKey] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [donateMsg, setDonateMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get('email') || '');
    const senha = String(form.get('senha') || '');
    setMsg(null);
    setBusy(true);
    const k = cfg.prefix + slug(email);
    const raw = await storageGet(k);
    setBusy(false);
    if (!raw) {
      setMsg({ type: 'err', text: 'Não encontramos cadastro com esse e-mail. Use a aba "Cadastrar".' });
      return;
    }
    const data = JSON.parse(raw) as Record;
    if (data.senha !== senha) {
      setMsg({ type: 'err', text: 'E-mail ou senha incorretos.' });
      return;
    }
    setRecord(data);
    setKey(k);
    setView('success');
  }

  async function handleCadastro(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get('email') || '');
    setMsg(null);
    setBusy(true);
    const k = cfg.prefix + slug(email);
    const existing = await storageGet(k);
    if (existing) {
      setBusy(false);
      setMsg({ type: 'err', text: 'Já existe um cadastro com esse e-mail. Use a aba "Entrar".' });
      return;
    }
    const base = {
      nome: String(form.get('nome') || ''),
      cidade: String(form.get('cidade') || ''),
      uf: String(form.get('uf') || ''),
      responsavel: String(form.get('responsavel') || ''),
      email,
      senha: String(form.get('senha') || ''),
    };
    const newRecord: Record =
      role === 'entidade'
        ? { ...base, tipo: String(form.get('tipo') || '') }
        : { ...base, setor: String(form.get('tipo') || ''), kgDoado: 0, doacoes: 0 };

    const ok = await storageSet(k, JSON.stringify(newRecord));
    setBusy(false);
    if (!ok) {
      setMsg({ type: 'err', text: 'Não foi possível salvar agora. Tente novamente.' });
      return;
    }
    setRecord(newRecord);
    setKey(k);
    setView('success');
    window.dispatchEvent(new Event('elo:refresh'));
  }

  async function handleDonate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!key || !record || !isEmpresa(role, record)) return;
    const form = new FormData(e.currentTarget);
    const tipo = String(form.get('tipo') || '');
    const kg = parseFloat(String(form.get('kg') || ''));
    setDonateMsg(null);
    if (!tipo || !kg || kg <= 0) {
      setDonateMsg({ type: 'err', text: 'Preencha o tipo de alimento e uma quantidade válida.' });
      return;
    }
    const updated: Empresa = { ...record, kgDoado: (record.kgDoado || 0) + kg, doacoes: (record.doacoes || 0) + 1 };
    await storageSet(key, JSON.stringify(updated));
    setRecord(updated);
    setDonateMsg({ type: 'ok', text: 'Doação registrada! Obrigado por fazer parte da rede.' });
    (e.target as HTMLFormElement).reset();
    window.dispatchEvent(new Event('elo:refresh'));
  }

  function logout() {
    setView('login');
    setTab('login');
    setRecord(null);
    setKey(null);
    setMsg(null);
    setDonateMsg(null);
  }

  const accentBg = cfg.accent === 'signal' ? 'bg-signal' : 'bg-ember';
  const accentBorder = cfg.accent === 'signal' ? 'border-signal' : 'border-ember';
  const headGradient = cfg.accent === 'signal' ? 'from-signal-tint' : 'from-ember-tint';

  return (
    <div className="overflow-hidden rounded-[20px] border border-line bg-card transition-shadow hover:shadow-[0_18px_36px_rgba(14,17,22,.08)]">
      <div className={'border-b border-line bg-gradient-to-b px-[26px] pb-[18px] pt-6 ' + headGradient + ' to-transparent'}>
        <span className={'mb-3 inline-block rounded-full px-2.5 py-1 font-mono text-[11.5px] uppercase tracking-wide text-ink ' + accentBg}>
          {cfg.tag}
        </span>
        <h3 className="text-[22px] font-bold">{cfg.title}</h3>
        <p className="mt-2 text-sm text-ink-soft">{cfg.blurb}</p>
      </div>

      {view !== 'success' && (
        <div className="flex gap-1 px-[26px] pt-4">
          {(['login', 'cadastro'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTab(t);
                setView(t);
                setMsg(null);
              }}
              className={
                'flex-1 border-b-2 py-2.5 text-center text-[13.5px] font-semibold transition-colors ' +
                (tab === t ? accentBorder + ' text-ink' : 'border-line text-ink-faint hover:text-ink')
              }
            >
              {t === 'login' ? 'Entrar' : 'Cadastrar'}
            </button>
          ))}
        </div>
      )}

      <div className="px-[26px] pb-[26px] pt-[22px]">
        <TransitionPanel
          activeIndex={view === 'login' ? 0 : view === 'cadastro' ? 1 : 2}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          variants={{
            enter: { opacity: 0, y: 8 },
            center: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -8 },
          }}
        >
          {[
            <form key="login" onSubmit={handleLogin} className="space-y-3.5">
              <Field label="E-mail">
                <input name="email" type="email" required autoComplete="email" className={inputClass} />
              </Field>
              <Field label="Senha">
                <input name="senha" type="password" required autoComplete="current-password" className={inputClass} />
              </Field>
              <button type="submit" disabled={busy} className={submitClass(accentBg)}>
                {busy ? 'Entrando…' : 'Entrar'}
              </button>
              {msg && <FormMsg type={msg.type} text={msg.text} />}
            </form>,

            <form key="cadastro" onSubmit={handleCadastro} className="space-y-3.5">
              <Field label={cfg.nameLabel}>
                <input name="nome" type="text" required className={inputClass} />
              </Field>
              <Field label={cfg.typeLabel}>
                <select name="tipo" required defaultValue="" className={inputClass}>
                  <option value="" disabled>Selecione</option>
                  {cfg.typeOptions.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <div className="grid grid-cols-[1.6fr_1fr] gap-3">
                <Field label="Cidade">
                  <input name="cidade" type="text" required className={inputClass} />
                </Field>
                <Field label="UF">
                  <select name="uf" required defaultValue="" className={inputClass}>
                    <option value="" disabled>--</option>
                    {UF_LIST.map((uf) => (
                      <option key={uf}>{uf}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Responsável">
                <input name="responsavel" type="text" required className={inputClass} />
              </Field>
              <Field label="E-mail">
                <input name="email" type="email" required autoComplete="email" className={inputClass} />
              </Field>
              <Field label="Senha">
                <input name="senha" type="password" required minLength={4} autoComplete="new-password" className={inputClass} />
              </Field>
              <button type="submit" disabled={busy} className={submitClass(accentBg)}>
                {busy ? 'Enviando…' : cfg.submitLabel}
              </button>
              {msg && <FormMsg type={msg.type} text={msg.text} />}
            </form>,

            <div key="success" className="pb-0.5 pt-1.5">
              {record && (
                <>
                  <div className="mb-1.5 text-xl font-bold">Bem-vinda(o), {record.nome}</div>
                  <div className="mb-4 text-[13.5px] text-ink-soft">
                    {(role === 'entidade' ? (record as Entidade).tipo : (record as Empresa).setor)} — {record.cidade}/{record.uf}
                  </div>

                  {isEmpresa(role, record) && (
                    <>
                      <div className="mb-4 flex gap-4.5 gap-x-[18px]">
                        <div className="flex-1 rounded-[10px] border border-line bg-paper px-3.5 py-2.5">
                          <b className="block font-mono text-lg">{fmt(record.kgDoado)}</b>
                          <span className="text-[11.5px] text-ink-soft">kg doados</span>
                        </div>
                        <div className="flex-1 rounded-[10px] border border-line bg-paper px-3.5 py-2.5">
                          <b className="block font-mono text-lg">{record.doacoes}</b>
                          <span className="text-[11.5px] text-ink-soft">doações</span>
                        </div>
                      </div>

                      <div className="mb-3.5 rounded-[10px] border border-dashed border-line p-4">
                        <h4 className="mb-3 text-sm font-semibold">Registrar uma doação</h4>
                        <form onSubmit={handleDonate} className="space-y-3">
                          <div className="grid grid-cols-[1.6fr_1fr] gap-3">
                            <Field label="Tipo de alimento">
                              <select name="tipo" required defaultValue="" className={inputClass}>
                                <option value="" disabled>Selecione</option>
                                <option>In natura (frutas, verduras, legumes)</option>
                                <option>Padaria / panificados</option>
                                <option>Preparado (refeições, marmitas)</option>
                                <option>Embalado / não perecível</option>
                                <option>Outro</option>
                              </select>
                            </Field>
                            <Field label="Quantidade (kg)">
                              <input name="kg" type="number" min="0.1" step="0.1" required className={inputClass} />
                            </Field>
                          </div>
                          <button type="submit" className={submitClass('bg-ember')}>
                            Registrar doação
                          </button>
                          {donateMsg && <FormMsg type={donateMsg.type} text={donateMsg.text} />}
                        </form>
                      </div>
                    </>
                  )}

                  <div className="rounded-[10px] border border-dashed border-line bg-ink/[.03] p-3.5 text-[13.5px] text-ink-soft">
                    {role === 'entidade'
                      ? 'Próxima etapa do MVP: painel com os excedentes disponíveis perto de você, para reservar em um clique.'
                      : 'Próxima etapa do MVP: tela para cadastrar cada excedente e ver, em tempo real, qual entidade reservou.'}
                  </div>
                  <button type="button" onClick={logout} className="mt-3.5 text-[13px] text-ink-soft underline hover:text-ink">
                    Sair e testar outra conta →
                  </button>
                </>
              )}
            </div>,
          ]}
        </TransitionPanel>
      </div>
    </div>
  );
}

const inputClass =
  'w-full rounded-lg border border-line bg-white px-3 py-2.5 font-sans text-[14.5px] text-ink transition-colors focus:border-ink-faint focus:outline-none';

function submitClass(accentBg: string) {
  return (
    'mt-1.5 w-full rounded-[10px] py-3 text-center text-[14.5px] font-semibold text-ink transition-transform hover:not-disabled:-translate-y-px disabled:cursor-progress disabled:opacity-60 ' +
    accentBg
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12.5px] font-medium text-ink-soft">{label}</span>
      {children}
    </label>
  );
}

function FormMsg({ type, text }: { type: 'ok' | 'err'; text: string }) {
  return (
    <div
      className={
        'rounded-lg border px-3 py-2.5 text-[13px] ' +
        (type === 'ok'
          ? 'border-signal/30 bg-signal-tint text-signal-deep'
          : 'border-ember/30 bg-ember-tint text-ember-deep')
      }
    >
      {text}
    </div>
  );
}
