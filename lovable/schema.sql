-- ============================================================================
-- ELO — Esquema do banco (PostgreSQL / Supabase)
-- ============================================================================
-- Referência canônica do backend. No Lovable, peça para a IA implementar
-- seguindo este arquivo (ela gera as migrations). Para rodar na mão:
-- Supabase → SQL Editor → cole e execute por blocos, na ordem.
--
-- Convenção: português, snake_case, timestamptz, ids uuid.
-- Fluxo: estabelecimento publica EXCEDENTE → instituição faz SOLICITAÇÃO →
--        estabelecimento aceita → retirada efetiva → vira DOAÇÃO (indicadores).
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. PERFIS  (1 por usuário; estende auth.users)
-- ----------------------------------------------------------------------------
create table public.perfis (
  id                 uuid primary key references auth.users (id) on delete cascade,
  tipo_conta         text not null check (tipo_conta in ('doador', 'beneficiario', 'admin')),
  status             text not null default 'pendente' check (status in ('pendente', 'ativo', 'bloqueado')),
  nome               text not null,
  documento          text,                          -- CNPJ / registro (opcional)
  subtipo            text,                           -- doador: supermercado|fazenda|restaurante|padaria|industria
                                                     -- beneficiario: ong|banco_de_alimentos|igreja|abrigo|escola
  area_atuacao       text,                           -- só beneficiário: combate à fome, acolhimento, etc.
  publico_atendido   text,                           -- só beneficiário: famílias, crianças, pop. de rua...
  capacidade_diaria  integer,                        -- só beneficiário: refeições/pessoas por dia (opcional)
  cidade             text not null default '',
  uf                 text not null default '' check (char_length(uf) <= 2),
  contato            text not null,                  -- e-mail ou WhatsApp público
  telefone           text,
  lat                numeric,
  lng                numeric,
  consentimento_lgpd boolean not null default false,
  criado_em          timestamptz not null default now(),
  ultimo_acesso      timestamptz
);
comment on table public.perfis is 'Perfil de cada doador, instituição beneficente ou admin.';


-- ----------------------------------------------------------------------------
-- 2. ENDERECOS  (endereços / pontos de retirada de um perfil)
-- ----------------------------------------------------------------------------
create table public.enderecos (
  id                uuid primary key default gen_random_uuid(),
  perfil_id         uuid not null references public.perfis (id) on delete cascade,
  rotulo            text,                            -- "Loja centro", "Cozinha", "Sede"
  logradouro        text not null,
  numero            text,
  complemento       text,
  bairro            text,
  cidade            text not null,
  uf                text not null check (char_length(uf) = 2),
  cep               text,
  referencia        text,
  ponto_retirada    boolean not null default true,
  criado_em         timestamptz not null default now()
);


-- ----------------------------------------------------------------------------
-- 3. CATEGORIAS DE ALIMENTO
-- ----------------------------------------------------------------------------
create table public.categorias (
  id                uuid primary key default gen_random_uuid(),
  nome              text not null unique
);
insert into public.categorias (nome) values
  ('Frutas e verduras'), ('Carnes e proteínas'), ('Laticínios'),
  ('Grãos e cereais'), ('Pães e massas'), ('Refeições prontas'),
  ('Bebidas'), ('Não perecíveis'), ('Outros');


-- ----------------------------------------------------------------------------
-- 4. EXCEDENTES  (item publicado por um doador)
-- ----------------------------------------------------------------------------
create table public.excedentes (
  id                uuid primary key default gen_random_uuid(),
  doador_id         uuid not null references public.perfis (id) on delete cascade,
  categoria_id      uuid not null references public.categorias (id),
  descricao         text not null,
  quantidade        numeric not null check (quantidade > 0),
  unidade           text not null default 'kg' check (unidade in ('kg', 'unid', 'L', 'porcoes', 'caixas', 'pacotes')),
  condicao          text not null check (condicao in ('in_natura', 'preparado', 'embalado', 'nao_perecivel')),
  perecivel         boolean not null default true,
  data_validade     date,                            -- obrigatória se perecivel = true (validar no app)
  retirar_ate       timestamptz not null,            -- prazo limite para retirada
  endereco_id       uuid references public.enderecos (id),
  destino_sugerido  text not null default 'doacao' check (destino_sugerido in ('doacao', 'racao', 'compostagem')),
  status            text not null default 'disponivel' check (status in ('disponivel', 'reservado', 'coletado', 'expirado', 'cancelado')),
  foto_url          text,
  observacoes       text,
  criado_em         timestamptz not null default now()
);
create index excedentes_busca_idx  on public.excedentes (status, uf, cidade, data_validade);
create index excedentes_doador_idx on public.excedentes (doador_id);


-- ----------------------------------------------------------------------------
-- 5. SOLICITACOES  (instituição pede a retirada de um excedente)
-- ----------------------------------------------------------------------------
create table public.solicitacoes (
  id                     uuid primary key default gen_random_uuid(),
  excedente_id           uuid not null references public.excedentes (id) on delete cascade,
  beneficiario_id        uuid not null references public.perfis (id) on delete cascade,
  status                 text not null default 'pendente'
                           check (status in ('pendente', 'aceita', 'recusada', 'concluida', 'cancelada')),
  data_retirada_prevista date not null,
  data_retirada_efetiva  timestamptz,
  observacoes            text,
  motivo_recusa          text,
  termo_aceito           boolean not null default false,   -- termo de responsabilidade (obrigatório = true)
  criado_em              timestamptz not null default now()
);
-- uma instituição só pode ter UMA solicitação ativa por excedente
create unique index solicitacao_ativa_unica
  on public.solicitacoes (excedente_id, beneficiario_id)
  where status in ('pendente', 'aceita');
create index solicitacoes_beneficiario_idx on public.solicitacoes (beneficiario_id);


-- ----------------------------------------------------------------------------
-- 6. DOACOES  (registro consolidado — alimenta indicadores e rankings)
--    Preenchida SÓ pelo trigger, quando a retirada é concluída.
-- ----------------------------------------------------------------------------
create table public.doacoes (
  id                uuid primary key default gen_random_uuid(),
  excedente_id      uuid references public.excedentes (id) on delete set null,
  solicitacao_id    uuid references public.solicitacoes (id) on delete set null,
  doador_id         uuid not null references public.perfis (id) on delete cascade,
  beneficiario_id   uuid not null references public.perfis (id) on delete cascade,
  categoria_id      uuid references public.categorias (id),
  quantidade        numeric not null check (quantidade > 0),
  unidade           text not null,
  data              timestamptz not null default now()
);
create index doacoes_doador_idx      on public.doacoes (doador_id);
create index doacoes_beneficiario_idx on public.doacoes (beneficiario_id);


-- ----------------------------------------------------------------------------
-- 7. NOTIFICACOES
-- ----------------------------------------------------------------------------
create table public.notificacoes (
  id                uuid primary key default gen_random_uuid(),
  perfil_id         uuid not null references public.perfis (id) on delete cascade,
  titulo            text not null,
  mensagem          text not null,
  tipo              text default 'info' check (tipo in ('info', 'sucesso', 'alerta')),
  link              text,
  lida              boolean not null default false,
  criado_em         timestamptz not null default now()
);
create index notificacoes_perfil_idx on public.notificacoes (perfil_id, lida);


-- ----------------------------------------------------------------------------
-- 8. APOIOS  (doação em dinheiro — só persistir se confirmar pagamento real)
-- ----------------------------------------------------------------------------
create table public.apoios (
  id                uuid primary key default gen_random_uuid(),
  apoiador_id       uuid references public.perfis (id) on delete set null,
  valor             numeric not null check (valor > 0),
  metodo            text not null check (metodo in ('pix', 'cartao')),
  status            text not null default 'pendente' check (status in ('pendente', 'confirmado', 'falhou')),
  criado_em         timestamptz not null default now()
);


-- ============================================================================
-- 9. TRIGGERS
-- ============================================================================

-- 9.1 cria o perfil no cadastro. O form passa em options.data:
--     { tipo_conta, nome, documento, subtipo, cidade, uf, contato, telefone }
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.perfis (id, tipo_conta, status, nome, documento, subtipo, cidade, uf, contato, telefone, consentimento_lgpd)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'tipo_conta', 'doador'),
    'pendente',                                  -- admin ativa depois (ou trocar p/ 'ativo' se não houver moderação)
    coalesce(new.raw_user_meta_data ->> 'nome', 'Sem nome'),
    new.raw_user_meta_data ->> 'documento',
    new.raw_user_meta_data ->> 'subtipo',
    coalesce(new.raw_user_meta_data ->> 'cidade', ''),
    coalesce(new.raw_user_meta_data ->> 'uf', ''),
    coalesce(new.raw_user_meta_data ->> 'contato', new.email),
    new.raw_user_meta_data ->> 'telefone',
    true
  );
  return new;
end $$;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();


-- 9.2 avança o ciclo conforme o status da solicitação muda
create or replace function public.processar_solicitacao()
returns trigger language plpgsql security definer set search_path = public as $$
declare exc public.excedentes;
begin
  select * into exc from public.excedentes where id = new.excedente_id;

  -- nova solicitação → avisa o doador
  if tg_op = 'INSERT' then
    insert into public.notificacoes (perfil_id, titulo, mensagem, tipo, link)
    values (exc.doador_id, 'Nova solicitação de retirada',
            'Uma instituição solicitou a retirada de "' || exc.descricao || '".', 'info', '/painel/solicitacoes');
    return new;
  end if;

  -- aceita → reserva o excedente e avisa a instituição
  if new.status = 'aceita' and old.status is distinct from 'aceita' then
    update public.excedentes set status = 'reservado' where id = exc.id;
    insert into public.notificacoes (perfil_id, titulo, mensagem, tipo, link)
    values (new.beneficiario_id, 'Solicitação aceita',
            'O estabelecimento aceitou sua retirada de "' || exc.descricao || '".', 'sucesso', '/painel/solicitacoes');
  end if;

  -- recusada/cancelada → excedente volta a ficar disponível
  if new.status in ('recusada', 'cancelada') and old.status not in ('recusada', 'cancelada') then
    update public.excedentes set status = 'disponivel' where id = exc.id and status = 'reservado';
    insert into public.notificacoes (perfil_id, titulo, mensagem, tipo)
    values (new.beneficiario_id, 'Solicitação ' || new.status,
            'Sua solicitação de "' || exc.descricao || '" foi ' || new.status || '.', 'alerta');
  end if;

  -- concluída (retirada efetiva) → registra a doação e fecha o excedente
  if new.status = 'concluida' and old.status is distinct from 'concluida' then
    if new.data_retirada_efetiva is null then new.data_retirada_efetiva := now(); end if;
    insert into public.doacoes (excedente_id, solicitacao_id, doador_id, beneficiario_id, categoria_id, quantidade, unidade)
    values (exc.id, new.id, exc.doador_id, new.beneficiario_id, exc.categoria_id, exc.quantidade, exc.unidade);
    update public.excedentes set status = 'coletado' where id = exc.id;
    insert into public.notificacoes (perfil_id, titulo, mensagem, tipo)
    values (exc.doador_id, 'Retirada concluída',
            'A retirada de "' || exc.descricao || '" foi concluída. Comprovante disponível.', 'sucesso');
  end if;

  return new;
end $$;
create trigger on_solicitacao_insert
  after insert on public.solicitacoes for each row execute function public.processar_solicitacao();
create trigger on_solicitacao_update
  before update on public.solicitacoes for each row execute function public.processar_solicitacao();


-- 9.3 marca excedentes vencidos (chamar ao carregar listagens, ou via cron do Supabase)
create or replace function public.expirar_excedentes()
returns void language sql security definer set search_path = public as $$
  update public.excedentes
     set status = 'expirado'
   where status = 'disponivel'
     and (retirar_ate < now() or (data_validade is not null and data_validade < current_date));
$$;


-- ============================================================================
-- 10. VIEWS — indicadores e rankings
-- ============================================================================
create or replace view public.indicadores_rede as
select
  coalesce(sum(quantidade) filter (where unidade = 'kg'), 0) as kg_resgatados,
  coalesce(sum(quantidade) filter (where unidade = 'kg'), 0) * 2 as refeicoes_estimadas,
  count(distinct beneficiario_id)                            as instituicoes_atendidas,
  count(distinct doador_id)                                  as empresas_doadoras,
  count(*)                                                   as total_doacoes
from public.doacoes;

create or replace view public.ranking_estabelecimentos as
select p.id, p.nome, p.cidade, p.uf, p.subtipo,
       coalesce(sum(d.quantidade) filter (where d.unidade = 'kg'), 0) as kg_total,
       count(d.id) as num_doacoes
from public.perfis p
left join public.doacoes d on d.doador_id = p.id
where p.tipo_conta = 'doador'
group by p.id
having count(d.id) > 0
order by kg_total desc;

create or replace view public.ranking_ongs as
select p.id, p.nome, p.cidade, p.uf, p.capacidade_diaria,
       count(distinct d.id) as retiradas,
       coalesce(sum(d.quantidade) filter (where d.unidade = 'kg'), 0) as kg_recebidos
from public.perfis p
left join public.doacoes d on d.beneficiario_id = p.id
where p.tipo_conta = 'beneficiario'
group by p.id
having count(d.id) > 0
order by kg_recebidos desc;

create or replace view public.doacoes_por_mes as
select to_char(date_trunc('month', data), 'YYYY-MM') as mes,
       count(*) as num_doacoes,
       coalesce(sum(quantidade) filter (where unidade = 'kg'), 0) as kg
from public.doacoes
group by 1 order by 1;

create or replace view public.doacoes_por_categoria as
select c.nome as categoria,
       coalesce(sum(d.quantidade) filter (where d.unidade = 'kg'), 0) as kg,
       count(d.id) as num_doacoes
from public.doacoes d
join public.categorias c on c.id = d.categoria_id
group by c.nome order by kg desc;


-- ============================================================================
-- 11. RLS — Row Level Security
-- ============================================================================
alter table public.perfis        enable row level security;
alter table public.enderecos     enable row level security;
alter table public.categorias    enable row level security;
alter table public.excedentes    enable row level security;
alter table public.solicitacoes  enable row level security;
alter table public.doacoes       enable row level security;
alter table public.notificacoes  enable row level security;
alter table public.apoios        enable row level security;

-- helper: o usuário logado é admin?
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.perfis where id = auth.uid() and tipo_conta = 'admin');
$$;

-- PERFIS
create policy perfis_select   on public.perfis for select to authenticated using (true);
create policy perfis_ins_self on public.perfis for insert to authenticated with check (auth.uid() = id);
create policy perfis_upd_self on public.perfis for update to authenticated using (auth.uid() = id or public.is_admin());
create policy perfis_del_self on public.perfis for delete to authenticated using (auth.uid() = id or public.is_admin());

-- ENDERECOS  (endereços de organização, não residência — leitura liberada p/ logados)
create policy enderecos_select on public.enderecos for select to authenticated using (true);
create policy enderecos_write  on public.enderecos for all    to authenticated
  using (perfil_id = auth.uid() or public.is_admin())
  with check (perfil_id = auth.uid() or public.is_admin());

-- CATEGORIAS
create policy categorias_select on public.categorias for select to authenticated using (true);
create policy categorias_admin  on public.categorias for all    to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- EXCEDENTES
create policy excedentes_select on public.excedentes for select to authenticated using (true);
create policy excedentes_write  on public.excedentes for all    to authenticated
  using (doador_id = auth.uid() or public.is_admin())
  with check (doador_id = auth.uid() or public.is_admin());

-- SOLICITACOES
create policy solicitacoes_select on public.solicitacoes for select to authenticated using (
  beneficiario_id = auth.uid()
  or exists (select 1 from public.excedentes e where e.id = excedente_id and e.doador_id = auth.uid())
  or public.is_admin()
);
create policy solicitacoes_insert on public.solicitacoes for insert to authenticated
  with check (beneficiario_id = auth.uid() and termo_aceito = true);
create policy solicitacoes_update on public.solicitacoes for update to authenticated using (
  beneficiario_id = auth.uid()
  or exists (select 1 from public.excedentes e where e.id = excedente_id and e.doador_id = auth.uid())
  or public.is_admin()
);

-- DOACOES  (leitura p/ indicadores; escrita só via trigger / service role)
create policy doacoes_select on public.doacoes for select to authenticated using (true);

-- NOTIFICACOES
create policy notificacoes_own on public.notificacoes for all to authenticated
  using (perfil_id = auth.uid()) with check (perfil_id = auth.uid());

-- APOIOS
create policy apoios_own on public.apoios for all to authenticated
  using (apoiador_id = auth.uid()) with check (apoiador_id = auth.uid());


-- ============================================================================
-- 12. STORAGE
-- ============================================================================
-- Criar 2 buckets:
--   'excedentes'    (público)  → fotos dos itens
--   'comprovantes'  (privado)  → declarações/comprovantes de doação em PDF
-- Políticas: upload só pelo dono do excedente/doação; leitura de 'excedentes' pública.


-- ============================================================================
-- 13. OPCIONAL — campanhas (perfil admin), só se sobrar tempo
-- ============================================================================
-- create table public.campanhas (id uuid pk, criador_id uuid, titulo text, descricao text,
--   data_inicio date, data_fim date, meta_kg numeric, status text
--   check (status in ('ativa','encerrada','cancelada')) default 'ativa', criado_em timestamptz);
-- create table public.campanha_participante (campanha_id uuid, perfil_id uuid, aderiu_em timestamptz,
--   primary key (campanha_id, perfil_id));
