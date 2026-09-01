-- ============================================================================
-- ELO — Esquema do banco (PostgreSQL / Supabase)
-- ============================================================================
-- Use este arquivo como REFERÊNCIA. No Lovable, peça para a IA criar as tabelas
-- e políticas seguindo este desenho (ela gera as migrations). Se preferir rodar
-- na mão: Supabase → SQL Editor → cole e execute por blocos, na ordem abaixo.
--
-- Convenção: tudo em português, snake_case. Datas em timestamptz.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. PERFIS  (1 linha por usuário autenticado; estende auth.users)
-- ----------------------------------------------------------------------------
create table public.perfis (
  id                uuid primary key references auth.users (id) on delete cascade,
  tipo_conta        text not null check (tipo_conta in ('doador', 'beneficiario')),
  nome              text not null,
  documento         text,                          -- CNPJ ou registro (opcional)
  subtipo           text,                           -- supermercado / fazenda / restaurante / padaria / industria
                                                    -- igreja / ong / abrigo / banco_de_alimentos
  cidade            text not null,
  uf                text not null check (char_length(uf) <= 2),  -- '' transitório se o cadastro não enviar
  contato           text not null,                  -- e-mail ou WhatsApp
  lat               numeric,
  lng               numeric,
  consentimento_lgpd boolean not null default false,
  criado_em         timestamptz not null default now()
);

comment on table public.perfis is 'Perfil de cada doador ou instituição beneficente.';


-- ----------------------------------------------------------------------------
-- 2. EXCEDENTES  (alimento publicado por um doador)
-- ----------------------------------------------------------------------------
create table public.excedentes (
  id                uuid primary key default gen_random_uuid(),
  doador_id         uuid not null references public.perfis (id) on delete cascade,
  tipo_alimento     text not null,
  quantidade_kg     numeric not null check (quantidade_kg > 0),
  condicao          text not null check (condicao in ('in_natura', 'preparado', 'embalado', 'nao_perecivel')),
  validade          date,
  destino_sugerido  text not null default 'doacao' check (destino_sugerido in ('doacao', 'racao', 'compostagem')),
  status            text not null default 'disponivel' check (status in ('disponivel', 'reservado', 'coletado', 'expirado')),
  cidade            text not null,
  uf                text not null check (char_length(uf) <= 2),
  observacoes       text,
  criado_em         timestamptz not null default now()
);

create index excedentes_status_uf_idx on public.excedentes (status, uf, cidade);
create index excedentes_doador_idx     on public.excedentes (doador_id);


-- ----------------------------------------------------------------------------
-- 3. RESERVAS  (uma instituição reserva um excedente)
-- ----------------------------------------------------------------------------
create table public.reservas (
  id                uuid primary key default gen_random_uuid(),
  excedente_id      uuid not null references public.excedentes (id) on delete cascade,
  beneficiario_id   uuid not null references public.perfis (id) on delete cascade,
  status            text not null default 'pendente' check (status in ('pendente', 'confirmada', 'coletada', 'cancelada')),
  combinado_em      timestamptz,
  coletado_em       timestamptz,
  criado_em         timestamptz not null default now(),
  unique (excedente_id, beneficiario_id)
);

create index reservas_beneficiario_idx on public.reservas (beneficiario_id);


-- ----------------------------------------------------------------------------
-- 4. DOACOES  (registro consolidado, alimenta indicadores e ranking)
-- ----------------------------------------------------------------------------
create table public.doacoes (
  id                uuid primary key default gen_random_uuid(),
  excedente_id      uuid references public.excedentes (id) on delete set null,
  doador_id         uuid not null references public.perfis (id) on delete cascade,
  beneficiario_id   uuid not null references public.perfis (id) on delete cascade,
  quantidade_kg     numeric not null check (quantidade_kg > 0),
  tipo_alimento     text,
  data              timestamptz not null default now()
);

create index doacoes_doador_idx on public.doacoes (doador_id);


-- ----------------------------------------------------------------------------
-- 5. APOIOS  (doação em dinheiro — só persistir se confirmar pagamento real)
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
-- 6. TRIGGER — cria o perfil automaticamente quando o usuário se cadastra
--    O formulário de cadastro deve passar os dados em options.data:
--    supabase.auth.signUp({ email, password, options: { data: {
--      tipo_conta, nome, cidade, uf, contato, subtipo, documento
--    }}})
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.perfis (id, tipo_conta, nome, cidade, uf, contato, subtipo, documento, consentimento_lgpd)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'tipo_conta', 'doador'),
    coalesce(new.raw_user_meta_data ->> 'nome', 'Sem nome'),
    coalesce(new.raw_user_meta_data ->> 'cidade', ''),
    coalesce(new.raw_user_meta_data ->> 'uf', ''),
    coalesce(new.raw_user_meta_data ->> 'contato', new.email),
    new.raw_user_meta_data ->> 'subtipo',
    new.raw_user_meta_data ->> 'documento',
    true
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ============================================================================
-- 7. TRIGGER — ao marcar a reserva como 'coletada', registra a doação
--    e fecha o excedente
-- ============================================================================
create or replace function public.registrar_doacao()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  exc public.excedentes;
begin
  if new.status = 'coletada' and old.status is distinct from 'coletada' then
    select * into exc from public.excedentes where id = new.excedente_id;

    insert into public.doacoes (excedente_id, doador_id, beneficiario_id, quantidade_kg, tipo_alimento)
    values (exc.id, exc.doador_id, new.beneficiario_id, exc.quantidade_kg, exc.tipo_alimento);

    update public.excedentes set status = 'coletado' where id = exc.id;
    new.coletado_em := now();
  end if;
  return new;
end;
$$;

create trigger on_reserva_coletada
  before update on public.reservas
  for each row execute function public.registrar_doacao();


-- ============================================================================
-- 8. VIEWS — ranking e indicadores da rede
-- ============================================================================
create or replace view public.ranking_empresas as
select
  p.id,
  p.nome,
  p.cidade,
  p.uf,
  p.subtipo,
  coalesce(sum(d.quantidade_kg), 0) as kg_total,
  count(d.id)                        as num_doacoes
from public.perfis p
left join public.doacoes d on d.doador_id = p.id
where p.tipo_conta = 'doador'
group by p.id
having coalesce(sum(d.quantidade_kg), 0) > 0
order by kg_total desc;

create or replace view public.indicadores_rede as
select
  coalesce(sum(quantidade_kg), 0)                          as kg_resgatados,
  coalesce(sum(quantidade_kg), 0) * 2                       as refeicoes_estimadas,
  (select count(*) from public.perfis where tipo_conta = 'beneficiario') as instituicoes,
  count(distinct doador_id)                                as empresas_doadoras
from public.doacoes;


-- ============================================================================
-- 9. RLS — Row Level Security
-- ============================================================================
alter table public.perfis     enable row level security;
alter table public.excedentes enable row level security;
alter table public.reservas   enable row level security;
alter table public.doacoes    enable row level security;
alter table public.apoios     enable row level security;

-- PERFIS: qualquer usuário logado lê (nome/cidade aparecem no match e no ranking);
--         só edita o próprio.
create policy "perfis_select" on public.perfis
  for select to authenticated using (true);
create policy "perfis_insert_proprio" on public.perfis
  for insert to authenticated with check (auth.uid() = id);
create policy "perfis_update_proprio" on public.perfis
  for update to authenticated using (auth.uid() = id);
create policy "perfis_delete_proprio" on public.perfis
  for delete to authenticated using (auth.uid() = id);

-- EXCEDENTES: todos os logados veem (beneficiário precisa achar os disponíveis);
--             só o dono cria/edita/apaga.
create policy "excedentes_select" on public.excedentes
  for select to authenticated using (true);
create policy "excedentes_insert_dono" on public.excedentes
  for insert to authenticated with check (doador_id = auth.uid());
create policy "excedentes_update_dono" on public.excedentes
  for update to authenticated using (doador_id = auth.uid());
create policy "excedentes_delete_dono" on public.excedentes
  for delete to authenticated using (doador_id = auth.uid());

-- RESERVAS: o beneficiário que reservou OU o doador dono do excedente.
create policy "reservas_select_envolvidos" on public.reservas
  for select to authenticated using (
    beneficiario_id = auth.uid()
    or exists (select 1 from public.excedentes e where e.id = excedente_id and e.doador_id = auth.uid())
  );
create policy "reservas_insert_beneficiario" on public.reservas
  for insert to authenticated with check (beneficiario_id = auth.uid());
create policy "reservas_update_envolvidos" on public.reservas
  for update to authenticated using (
    beneficiario_id = auth.uid()
    or exists (select 1 from public.excedentes e where e.id = excedente_id and e.doador_id = auth.uid())
  );

-- DOACOES: leitura liberada para logados (ranking/indicadores). Escrita é só via trigger.
create policy "doacoes_select" on public.doacoes
  for select to authenticated using (true);

-- APOIOS: cada um vê o próprio.
create policy "apoios_proprio" on public.apoios
  for all to authenticated using (apoiador_id = auth.uid()) with check (apoiador_id = auth.uid());
