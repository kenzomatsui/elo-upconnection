# Guia de migração para a Lovable — ELO

Passo a passo para levar o que já existe (`index.html`) para a Lovable e construir
o resto lá: backend (Supabase) e páginas pós-login.

> **Dois caminhos:**
> - **Prompt único** (recomendado para começar): copie e cole o
>   [`prompt-completo.md`](prompt-completo.md) — ele descreve o app inteiro (landing +
>   área logada dos 3 perfis + backend). Anexe o `index.html` junto.
> - **Passo a passo** (este arquivo): se preferir prompts menores e mais controláveis,
>   siga as etapas abaixo. As duas abordagens usam o mesmo `schema.sql`.
>
> **Ordem importa.** Faça uma etapa, teste, e só então vá para a próxima.

---

## Etapa 0 — Preparação (antes de abrir a Lovable)

- [ ] **Conta:** pelo regulamento (art. 12), quem é menor de 18 não pode ser dono do
      workspace — a conta/projeto Lovable fica no nome do **professor orientador**.
      Usar os créditos fornecidos pela organização.
- [ ] Ter em mãos: o arquivo `index.html` deste repositório e o `LOVABLE_PROMPT.md`.
- [ ] Trocar, no `index.html`, as constantes de Pix (`CHAVE_PIX`, `NOME_RECEBEDOR`,
      `CIDADE_RECEBEDOR`, linhas ~1216) pela **conta oficial do projeto** — não subir
      CPF pessoal para um site público.
- [ ] Decidir o nome do projeto na Lovable: `elo` ou `elo-upconnection`.

---

## Etapa 1 — Recriar a landing page

1. Criar um projeto novo na Lovable.
2. Primeiro prompt (cole o texto abaixo, e anexe / cole o conteúdo de `index.html`):

> Vou te dar uma landing page pronta em um único arquivo HTML+CSS+JS (em anexo) e
> uma especificação (abaixo). Recrie essa página como um app **React + TypeScript +
> Tailwind**, **mantendo fielmente** o layout, a paleta, as fontes (Fraunces / Inter
> / IBM Plex Mono), o modo claro/escuro por `data-theme`, as animações (título do
> hero palavra por palavra, reveal on scroll, trilho de corrente lateral, count-up
> dos KPIs) e todas as seções na mesma ordem. Quebre em componentes por seção. Use
> as imagens da pasta `imagens/` (vou subir os arquivos). Ainda **sem backend** nesta
> etapa — formulários e “doação em dinheiro” continuam como estão (Pix gerado no
> cliente, submit mostrando mensagem de sucesso).
>
> [colar aqui todo o conteúdo de LOVABLE_PROMPT.md]

3. Subir as imagens da pasta `imagens/` para o projeto Lovable (assets/public).
4. **Testar:** abрir o preview, conferir seção por seção no claro e no escuro, no
   celular e no desktop. Ajustar com prompts pequenos (“o espaçamento da seção X
   está diferente”, “o toggle de tema sumiu no mobile” etc.).

---

## Etapa 2 — Ligar o backend

1. Na Lovable, ativar o backend: **Supabase** (ou “Lovable Cloud”, que provisiona
   Supabase automaticamente). Autenticar / criar o projeto Supabase.
2. Prompt:

> Ative o backend com Supabase. Crie o schema do banco conforme o arquivo
> `lovable/schema.sql` deste repositório (vou colar abaixo): tabelas `perfis`,
> `excedentes`, `reservas`, `doacoes`, `apoios`; os dois triggers
> (`handle_new_user` e `registrar_doacao`); as views `ranking_empresas` e
> `indicadores_rede`; e **todas as políticas RLS** exatamente como no arquivo.
> Não invente colunas a mais.
>
> [colar aqui todo o conteúdo de lovable/schema.sql]

3. **Testar no Supabase:** Table Editor deve mostrar as 5 tabelas; Authentication →
   Policies deve mostrar o RLS ativo em todas.

---

## Etapa 3 — Autenticação e cadastro real

Prompt:

> Configure Supabase Auth com **e-mail + senha**. Transforme os dois formulários da
> seção “Cadastro” em cadastro real:
> - “Instituição beneficente” → `signUp` com `options.data` = `{ tipo_conta:
>   'beneficiario', nome, documento, cidade, uf, contato }`.
> - “Empresa doadora” → idem com `tipo_conta: 'doador'` e `subtipo` = tipo de
>   estabelecimento escolhido.
> O trigger `handle_new_user` cria o perfil sozinho — não insira em `perfis` pelo
> cliente.
> Adicione uma tela **/entrar** com login e logout, e um estado de sessão global.
> O checkbox de consentimento LGPD é obrigatório para enviar.
> Mantenha o visual dos cards atuais.

**Testar:** criar 1 conta doador e 1 conta beneficiário; confirmar que aparecem 2
linhas em `perfis` com o `tipo_conta` certo; login e logout funcionando.

---

## Etapa 4 — Páginas pós-login (o “resto do site”)

### 4a. Painel do doador  (`/painel` quando `tipo_conta = 'doador'`)

> Crie o painel do doador com:
> 1. **Publicar excedente** — formulário: tipo de alimento, quantidade (kg),
>    condição (in natura / preparado / embalado / não perecível), validade,
>    cidade/UF (pré-preenchidos do perfil), observações. Ao salvar, insere em
>    `excedentes` com `doador_id = usuário atual` e `status = 'disponivel'`.
>    Calcule `destino_sugerido`: condição `in_natura`/`preparado`/`embalado`/
>    `nao_perecivel` dentro da validade → `doacao`; validade vencida mas condição
>    ainda segura → `racao`; senão → `compostagem`. (regra simples, pode refinar)
> 2. **Meus excedentes** — lista com status colorido, filtro por status.
> 3. **Reservas recebidas** — para cada excedente reservado, mostra a instituição,
>    contato, e botões **Confirmar combinação** (`reservas.status = 'confirmada'`,
>    grava `combinado_em`) e **Confirmar coleta** (`reservas.status = 'coletada'`
>    — o trigger cria a doação e fecha o excedente automaticamente).
> 4. Após a coleta, botão **Ver comprovante** — página imprimível com dados da
>    doação (para o Selo Doador de Alimentos).

### 4b. Painel do beneficiário  (`/painel` quando `tipo_conta = 'beneficiario'`)

> Crie o painel do beneficiário com:
> 1. **Excedentes disponíveis perto de mim** — lista de `excedentes` com
>    `status = 'disponivel'`, ordenada priorizando a mesma `uf`/`cidade` do perfil.
>    Cada card mostra tipo, quantidade, condição, validade, cidade e o
>    `destino_sugerido`. Botão **Reservar** → insere em `reservas`
>    (`beneficiario_id = usuário`, `status = 'pendente'`) e muda o excedente para
>    `status = 'reservado'`.
> 2. **Minhas reservas** — status de cada uma, contato do doador quando confirmada,
>    botão **Cancelar** (volta o excedente para `disponivel`).
> 3. **Histórico de coletas** — lê de `doacoes` onde `beneficiario_id = usuário`.

### 4c. Indicadores e Rank com dados reais

> Substitua os números fixos das seções “Indicadores da rede” e “Rank” por consultas:
> - Indicadores → view `indicadores_rede`.
> - Rank → view `ranking_empresas` (top 3 no pódio, 4º–10º na lista). Mantenha o
>   selo “Demonstração” só enquanto não houver dados reais suficientes.

**Testar o fluxo inteiro:** doador publica → beneficiário reserva → doador confirma
combinação → doador confirma coleta → a doação aparece nos indicadores e no ranking.

---

## Etapa 5 — Doação em dinheiro (opcional, se sobrar tempo)

- **Pix:** já funciona no cliente (gera o BR Code). Só garanta que a chave é a
  oficial do projeto.
- **Cartão:** criar uma **Edge Function** `criar-preferencia-mp`:

> Crie uma Supabase Edge Function `criar-preferencia-mp` que recebe `{ valor }`,
> chama a API “Preferences” do Mercado Pago usando o secret `MP_ACCESS_TOKEN`
> (nunca expor no cliente), e devolve `init_point`. No botão “Cartão” da seção
> Doar, chame essa função e redirecione o usuário para o `init_point`.
> Adicione a Edge Function `mp-webhook` que recebe a notificação de pagamento
> aprovado e grava/atualiza a linha em `apoios` com `status = 'confirmado'`.

---

## Etapa 6 — Versionar de volta no GitHub

Na Lovable: **GitHub → Connect**. Ela cria/usa um repositório e passa a sincronizar
os dois lados. A partir daí:
- O código React fica versionado (bom para o critério “Mentalidade Builder”).
- Este repositório (`elo-upconnection`) segue como **fonte da base/histórico**
  (`index.html`, `reference/`, este guia). Se quiser, aponte a Lovable para ele; se
  ela preferir criar um repo próprio, deixe um link no README de um para o outro.

---

## Etapa 7 — Checklist antes de enviar para a banca (até 11/09)

- [ ] Link público da Lovable ativo e testável (fica no ar até 23/09).
- [ ] Fluxo doação ponta a ponta funcionando (Etapa 4).
- [ ] Login/logout para os dois tipos de conta.
- [ ] Responsivo + modo escuro.
- [ ] Política de Privacidade visível + consentimento LGPD obrigatório no cadastro.
- [ ] Nenhum dado pessoal real exposto (chave Pix, e-mails de teste).
- [ ] Deck (PDF), vídeo final (até 3 min), descrição do projeto (até 800 palavras),
      evidências de teste com usuários.
- [ ] Gravação de tela do MVP (até 60s) como backup para a demo ao vivo.

---

## Referência rápida

| Preciso de… | Onde |
|---|---|
| Prompt para recriar o visual | `../LOVABLE_PROMPT.md` |
| Schema do banco + RLS | `schema.sql` (nesta pasta) |
| Como era cada versão do HTML | `../reference/Elo V1..V7.html` |
| Base visual (arquivo único) | `../index.html` |
