# Prompt completo para a Lovable — Plataforma ELO

> **Como usar:** copie TUDO abaixo da linha e cole na Lovable como primeiro prompt do
> projeto. Se possível, anexe também o arquivo `index.html` deste repositório — ele é a
> referência visual exata da landing page. Depois de gerar, itere seção por seção.
>
> Este prompt cobre: a landing page pública + toda a área logada (estabelecimento
> doador, instituição beneficente e admin) + o backend no Supabase.

---

Construa uma aplicação web chamada **ELO** em **React + TypeScript + Tailwind**, com
backend no **Supabase** (banco Postgres, Auth, Storage, RLS). Idioma: **português do
Brasil**. Datas sempre no formato **dd/MM/aaaa**.

## O que é o ELO

ELO é uma rede que conecta **estabelecimentos com excedente de alimentos**
(supermercados, fazendas/produtores, restaurantes, padarias, indústrias) a
**instituições beneficentes** (ONGs, bancos de alimentos, igrejas, abrigos) para
doação, em qualquer cidade do Brasil. Inspirado na lei francesa nº 2016-138 (2016) e
na Lei brasileira nº 15.224/2025 (Política Nacional de Combate à Perda e ao Desperdício
de Alimentos — cria o "Selo Doador de Alimentos" e incentiva plataformas digitais de
doação). Projeto estudantil da equipe **UpConnection** para o Desafio Escolas
Inovadoras 2026 (HJ Tech × Lovable), eixo "Impacto e Inclusão".

Fluxo central do produto:
**estabelecimento publica um excedente → instituição solicita a retirada → estabelecimento
aceita → a retirada acontece → vira uma doação registrada (entra nos indicadores e no
ranking) → estabelecimento emite um comprovante para o Selo Doador.**

---

## 1. Identidade visual (obrigatório manter)

- **Fontes (Google Fonts):** títulos em `Fraunces` (serifada, peso 600); corpo em
  `Inter`; números, rótulos e detalhes em `IBM Plex Mono`.
- **Paleta — modo claro:** fundo `#F3EBE0`, fundo-suave `#EDE5D9`, superfície `#FFFBF5`,
  superfície-2 `#F8F0E6`, texto `#16241B`, texto-suave `#4E5D51`, verde primário
  `#234A3A`, verde forte `#163229`, dourado `#C6952F`, terracota `#A85C3B`, borda `#DBE2D0`.
- **Paleta — modo escuro:** fundo `#0D1810`, superfície `#17251A`, superfície-2 `#1C2B1F`,
  texto `#ECF1E6`, texto-suave `#A9BAAC`, primário `#77C39B`, dourado `#E5BD6B`,
  terracota `#D08561`, borda `#263A2C`, footer `#050D08`.
- Alternância de tema por um **toggle sol/lua** no cabeçalho, aplicando `data-theme` na
  raiz. Persistir a escolha em `localStorage`.
- **Cantos:** 28px (cards grandes), 16px (cards), 10px (inputs/botões pequenos).
  **Botões:** formato pílula (raio 100px).
- **Tom:** editorial, sóbrio, "de causa" — nada infantil, nada corporativo agressivo.
- Respeitar `prefers-reduced-motion` (desligar animações).
- **Acessibilidade:** contraste AA, foco de teclado visível (contorno dourado de 3px),
  `alt` em todas as imagens, navegação por teclado, labels associados aos campos.
- Imagens/ícones da marca ficam em `imagens/` (vou subir os arquivos): `logo_projeto_*`,
  `logo-upconnection-*`, ícones de tipo (igreja, ong, abrigo, banco de alimentos,
  indústria, trator, garfo), `Imagen de demonstração 1.jpeg` (foto do hero).

### Componentes base a criar e reutilizar em todo o app
Botão (variações: primário, fantasma, contorno-claro), Card, Input/Select/Textarea com
label e mensagem de erro, **Badge de status** (cores por status), **Tabela** com
cabeçalho clicável para ordenar + paginação/scroll + estado vazio ("Nenhum registro
encontrado com os critérios informados."), **Modal**, **Toast** de sucesso/alerta,
**barra de filtros** (busca em texto, selects, intervalo de datas, botões "Filtrar" e
"Limpar filtros"), estado de carregamento (skeleton/spinner), **diálogo de
confirmação** para toda ação destrutiva ou irreversível.

---

## 2. Landing page pública  (rota `/`)

Recrie **fielmente** a landing do `index.html` anexo — mesmo layout, ordem, textos,
paleta, fontes e animações. Quebre em componentes por seção. Seções, na ordem:

1. **Cabeçalho fixo** — logo ELO + "powered by UpConnection" + logo da UpConnection;
   links âncora (Quem somos, Problema, Como funciona, Rank, Doar); toggle de tema;
   botão **"Entrar / Cadastre-se"** que leva a `/entrar`. Em telas ≤ 960px vira menu
   hambúrguer.
2. **Trilho de progresso em corrente** fixo à esquerda, que enche com a rolagem
   (gradiente dourado→verde).
3. **Hero** — foto de fundo; título animado palavra por palavra "O excedente de hoje
   pode ser o prato de alguém amanhã."; linha de apoio; CTAs "Quero me cadastrar" e
   "Como funciona"; onda SVG na transição.
4. **Quem somos** — equipe de estudantes catarinenses; espaço para foto da equipe.
5. **O problema** — 4 cards: `55 mi t` desperdiçadas/ano; `54,7 mi` em insegurança
   alimentar; `6,4 mi` passando fome; `10º` no ranking mundial (ONU). Callout de
   impacto + nota de fontes com links.
6. **De onde veio a ideia** — 2 cards lado a lado: França 2016 / Brasil Lei 15.224/2025.
7. **Como funciona** — 6 passos (Cadastro → Publicação do excedente → Classificação
   automática pela hierarquia da lei → Match e logística → Confirmação e comprovante →
   Impacto medido) + bloco "O que vira o quê" (Doação / Ração / Compostagem-energia).
8. **Indicadores da rede** — 4 KPIs com animação de contagem: kg resgatados, refeições
   geradas, instituições parceiras, municípios conectados. **Ler da view
   `indicadores_rede`** (ver §7). Selo "Demonstração" enquanto os números forem baixos.
9. **Rank** — pódio de 3 + lista 4º–10º das empresas que mais doaram. **Ler da view
   `ranking_estabelecimentos`.** Selo "Demonstração" enquanto vazio.
10. **Cadastro** — mantém os 2 cards ("Sou instituição beneficente" / "Sou empresa
    doadora"); ambos os botões levam a `/entrar` já com o tipo pré-selecionado.
11. **Doação em dinheiro** (`#doar`) — valores R$ 10/25/50/100 ou livre; alternância
    Pix / Cartão. **Pix:** gerar o payload BR Code / EMV no cliente (função já existe
    no `index.html`, com CRC16) e mostrar QR + "Copiar código". **Cartão:** chamar uma
    Edge Function (ver §7). Trocar as constantes de chave Pix pelos dados da conta
    oficial do projeto.
12. **Privacidade** — texto de conformidade com a LGPD (Lei nº 13.709/2018).
13. **Footer** verde-escuro — marca, parceiros (HJ, SESI, Lovable), metadados (Equipe:
    UpConnection · Eixo: Impacto e Inclusão · Escola: Escola SESI).

---

## 3. Autenticação  (rota `/entrar`)

- Uma página com abas **"Entrar"** e **"Criar conta"**, no mesmo visual dos cards da
  landing.
- **Criar conta:** primeiro escolhe o perfil — **Estabelecimento doador** ou
  **Instituição beneficente**. Campos:
  - Comuns: nome da organização, CNPJ ou registro (opcional), e-mail, senha (mín. 8),
    telefone/WhatsApp, cidade, UF.
  - Estabelecimento: tipo (supermercado / fazenda ou produtor rural / restaurante /
    padaria / indústria).
  - Instituição: tipo (ONG / banco de alimentos / igreja / abrigo / escola), área de
    atuação, público atendido, capacidade diária (opcional).
  - **Checkbox obrigatório** de consentimento LGPD com link para a Política de
    Privacidade.
  - Usar `supabase.auth.signUp` passando esses dados em `options.data`. Um trigger cria
    o perfil (ver §7). Contas novas entram com `status = 'pendente'`.
- Após criar conta: tela **"Cadastro em análise"** — explica que um administrador vai
  aprovar em breve; permite sair. (Se preferir simplificar para a demo, deixe o cadastro
  já entrar como `ativo` — deixe isso fácil de alternar.)
- **Entrar:** e-mail + senha. Erros:
  - credenciais inválidas → "E-mail ou senha inválidos."
  - `status = 'pendente'` → "Seu cadastro ainda está em análise."
  - `status = 'bloqueado'` → "Acesso bloqueado. Fale com o suporte."
  - sucesso → atualizar `ultimo_acesso`, guardar a sessão e redirecionar para `/painel`.
- **Recuperação de senha** via Supabase (link "Esqueci minha senha").
- Rotas de `/painel/*` são protegidas: sem sessão → manda para `/entrar`.

---

## 4. Shell da área logada  (rotas `/painel/*`)

Layout comum a todos os perfis:
- **Cabeçalho:** logo ELO à esquerda; à direita: sino de **notificações** (badge com
  não lidas, dropdown com as últimas), toggle de tema, nome + tipo da organização,
  botão **Sair** (com confirmação "Deseja realmente encerrar a sessão?").
- **Menu lateral (sidebar):** itens com ícone e rótulo, item ativo destacado. A lista
  muda conforme o perfil (ver abaixo).
- **Área de conteúdo:** central, troca sem recarregar a página.
- **Rodapé:** nome da organização logada + "ELO · versão 0.1".
- Responsivo: no mobile a sidebar vira menu retrátil.

O item de menu **"Início"** abre o dashboard do perfil e é carregado por padrão ao logar.

---

## 5. Perfil ESTABELECIMENTO DOADOR  (`tipo_conta = 'doador'`)

Menu: Início · Publicar excedente · Meus excedentes · Solicitações recebidas ·
Relatório de impacto · Notificações · Minha organização.

### 5.1 Início (dashboard)
Saudação "Olá, {nome}." + 4 cards de indicadores (só desta organização):
- **Excedentes disponíveis** — meus excedentes com status `disponivel`.
- **Solicitações pendentes** — solicitações aguardando minha resposta.
- **Retiradas concluídas** — total histórico.
- **Kg doados no mês** — soma das minhas doações do mês corrente.

Abaixo: painel **"Vencendo em breve"** (meus excedentes disponíveis com validade nos
próximos 3 dias, ordenados por validade) e botão de atalho **"Publicar excedente"**.

### 5.2 Publicar excedente (formulário)
Campos: categoria (select da tabela `categorias`), descrição, quantidade + unidade
(kg / unid / L / porções / caixas / pacotes), condição (in natura / preparado /
embalado / não perecível), **é perecível?** (sim/não), **data de validade** (obrigatória
se perecível), **retirar até** (data e hora limite), **endereço/ponto de retirada**
(escolher um dos endereços cadastrados ou adicionar novo), observações, **foto**
(opcional, upload para o Storage).

Validações:
- quantidade > 0; se perecível, validade obrigatória e ≥ hoje; "retirar até" no futuro
  e não depois da validade.
- Calcular **destino sugerido**: dentro da validade e condição segura → `doacao`;
  fora da validade mas ainda seguro para animais → `racao`; senão → `compostagem`.
  Mostrar como sugestão editável.
Ao salvar: inserir em `excedentes` com `doador_id` = usuário e `status = 'disponivel'`;
toast de sucesso; ir para "Meus excedentes".

### 5.3 Meus excedentes
Barra de filtros (busca por texto na descrição; select de status; select de categoria;
intervalo de datas de cadastro). Tabela: descrição, categoria, quantidade, validade
(com **badge vermelho** se vence em ≤ 3 dias), status (badge), nº de solicitações,
data de cadastro. Ordenável por coluna; padrão por validade crescente. Ações por linha:
**Editar** (só se `disponivel`), **Cancelar** (confirmação; volta status para
`cancelado`), **Ver solicitações**.

### 5.4 Solicitações recebidas
Lista das `solicitacoes` feitas nos meus excedentes. Filtros por status e período.
Colunas: instituição solicitante, excedente, data da solicitação, retirada prevista,
status. Ao abrir uma solicitação `pendente`:
- Resumo do excedente + dados da instituição (nome, tipo, cidade, contato).
- Botão **Aceitar** → status `aceita` (o excedente vira `reservado` automaticamente);
  opcionalmente ajustar a data combinada.
- Botão **Recusar** → pede motivo; status `recusada` (excedente volta a `disponivel`).
- Quando `aceita`: botão **Registrar retirada** → informa data/hora efetiva → status
  `concluida`. Isso dispara (via trigger) a criação da **doação** e fecha o excedente.
- Quando `concluida`: botão **Ver comprovante** (ver 5.5).

### 5.5 Relatório de impacto
KPIs: kg doados, nº de doações, nº de instituições atendidas, municípios alcançados.
Gráfico de barras "doações por mês" (12 meses, destaca o mês de pico) e gráfico de
pizza "por categoria" (fatias < 2% agrupadas em "Outros", legenda com %). Ler das views
`doacoes_por_mes` e `doacoes_por_categoria` filtrando pelo `doador_id`.
Botão **"Gerar declaração de doação"** → página imprimível / PDF com: dados do
estabelecimento, da instituição, itens, quantidade, datas e um texto padrão citando a
Lei nº 15.224/2025 e o Selo Doador de Alimentos. Salvar o PDF no bucket `comprovantes`.

### 5.6 Notificações
Lista das `notificacoes` do usuário (título, mensagem, data, tipo). Marcar como lida
(individual e "marcar todas"). Clicar leva ao `link` da notificação.

### 5.7 Minha organização
Editar dados do perfil, gerenciar endereços/pontos de retirada, trocar senha.
Botão **"Excluir minha conta e meus dados"** (confirmação dupla — direito da LGPD).

---

## 6. Perfil INSTITUIÇÃO BENEFICENTE  (`tipo_conta = 'beneficiario'`)

Menu: Início · Doações disponíveis · Minhas solicitações · Relatório de impacto ·
Notificações · Minha organização.

### 6.1 Início (dashboard)
Saudação "Bem-vinda, {nome}!" + 4 cards (relativos a esta instituição):
- **Doações disponíveis** — excedentes `disponivel` não vencidos (idealmente na
  mesma UF/cidade da instituição).
- **Solicitações pendentes** — minhas, aguardando resposta do estabelecimento.
- **Solicitações aceitas** — prontas para retirar.
- **Retiradas concluídas** — total histórico.

Abaixo: lista **"Disponíveis perto de você"** (excedentes na mesma cidade/UF,
ordenados por validade) e alertas ("Você tem 2 retiradas agendadas para amanhã").

### 6.2 Doações disponíveis
Barra de filtros: busca por texto (descrição), categoria, **validade — de / até**,
cidade/UF. Lista em cards ou tabela dos `excedentes` com `status = 'disponivel'` e
**não vencidos** (excluir validade ≤ hoje). Cada item mostra: estabelecimento,
descrição, categoria, quantidade, condição, validade, destino sugerido, distância
aproximada (se houver lat/lng). **Ordenar por validade crescente por padrão** (prioriza
o que vence antes); permitir ordenar por outras colunas.
Botão **"Solicitar retirada"** por item. Se a instituição já tem solicitação
`pendente` ou `aceita` para aquele excedente → botão desabilitado com aviso "Você já
tem uma solicitação ativa para este item.".
Sem resultados → "Nenhuma doação encontrada com os critérios informados.".

### 6.3 Modal "Solicitar retirada"
Título "Confirmar solicitação de retirada". Mostra, **somente leitura**: nome do
estabelecimento, descrição, quantidade + unidade, validade (dd/MM/aaaa), endereço de
retirada. Campos:
- **Data prevista de retirada** (obrigatória): não pode ser hoje nem no passado
  (mínimo D+1) e não pode passar da validade do item.
- **Observações** (opcional, até 200 caracteres).
- **Checkbox obrigatório — Termo de Responsabilidade:** "Declaro que a instituição
  se responsabiliza pela retirada, transporte e conservação adequados do alimento, nos
  termos da Lei nº 15.224/2025, e que ele será destinado exclusivamente a consumo
  humano por pessoas em situação de vulnerabilidade." (link para o termo completo).
Botões "Confirmar solicitação" / "Cancelar". Ao confirmar: inserir em `solicitacoes`
com `status = 'pendente'`, `termo_aceito = true`; toast "Solicitação registrada!
Aguarde a confirmação do estabelecimento."; o estabelecimento recebe notificação.

### 6.4 Minhas solicitações
Filtros: status (Todos, Pendente, Aceita, Recusada, Concluída, Cancelada) e período.
Tabela: estabelecimento, excedente, data da solicitação, retirada prevista, status.
Ordenada por data decrescente. Ações:
- `pendente` → **Cancelar** (confirmação; excedente volta a `disponivel`).
- `aceita` → ver contato do estabelecimento + **Confirmar retirada** (informa data/hora
  efetiva → status `concluida`, gera a doação).
- `recusada` → mostra o motivo.

### 6.5 Relatório de impacto da instituição
KPIs: kg recebidos, nº de retiradas, categorias recebidas, estabelecimentos parceiros.
Gráficos "recebido por mês" e "por categoria" (mesmas views, filtrando `beneficiario_id`).

### 6.6 Notificações — igual a 5.6.

### 6.7 Minha organização — igual a 5.7 (com os campos extras: área de atuação,
público atendido, capacidade diária).

---

## 7. Perfil ADMIN  (`tipo_conta = 'admin'`) — implementar por último, se houver tempo

Menu: Painel geral · Cadastros · Excedentes · (Campanhas).

### 7.1 Painel geral
Filtro de período (data inicial/final; padrão últimos 30 dias) que afeta tudo.
4 KPIs: total de doações, kg doados, instituições atendidas, estabelecimentos ativos
no período. 2 gráficos: barras "doações por mês" (destaca o pico) e pizza "por
categoria" (< 2% viram "Outros"). 2 rankings: "Top 5 — Estabelecimentos que mais
doaram" (nome, kg, nº doações) e "Top 5 — Instituições com mais retiradas" (nome,
retiradas, capacidade diária). Botão "Atualizar".

### 7.2 Cadastros
Lista de todos os perfis (exceto admins). Busca por nome/e-mail; filtro por tipo
(Todos / Estabelecimento / Instituição) e status (Todos / Pendente / Ativo / Bloqueado).
Pendentes sempre no topo. Rodapé "Exibindo X registro(s).". Ações por status:
- Pendente → **Aprovar** (vira `ativo`) / **Recusar** (confirmação; vira `bloqueado`).
- Ativo → **Bloquear** (confirmação).
- Bloqueado → **Reativar**.
Ao aprovar/recusar, enviar notificação ao usuário.

### 7.3 Excedentes
Tabela de todos os `excedentes` com filtros (status, categoria, estabelecimento,
período). Admin pode **cancelar** um excedente impróprio (com motivo).

### 7.4 Campanhas (opcional) — campanhas de arrecadação com meta em kg, período,
participantes; listagem, criação, detalhes, encerrar/cancelar. (Só se sobrar tempo.)

---

## 8. Backend — Supabase

Ative o Supabase e crie o schema **exatamente** conforme o arquivo
`lovable/schema.sql` deste repositório (vou colar junto): tabelas `perfis`, `enderecos`,
`categorias`, `excedentes`, `solicitacoes`, `doacoes`, `notificacoes`, `apoios`; os
triggers `handle_new_user`, `processar_solicitacao`, `expirar_excedentes`; as views
`indicadores_rede`, `ranking_estabelecimentos`, `ranking_ongs`, `doacoes_por_mes`,
`doacoes_por_categoria`; a função `is_admin()`; e **todas as políticas RLS** como no
arquivo. Não crie colunas a mais.

- **Auth:** e-mail + senha. O cadastro passa os dados do perfil em `options.data` e o
  trigger cria a linha em `perfis`.
- **Storage:** buckets `excedentes` (público, fotos) e `comprovantes` (privado, PDFs).
- **Edge Function `criar-preferencia-mp`** (só para pagamento com cartão): recebe
  `{ valor }`, chama a API "Preferences" do Mercado Pago com o secret `MP_ACCESS_TOKEN`,
  devolve `init_point`. Nunca expor o token no cliente.
- Rodar `expirar_excedentes()` ao carregar as listagens de excedentes (ou agendar via
  cron do Supabase, 1x/dia).
- **Seed de demonstração:** criar ~6 estabelecimentos, ~4 instituições, ~15 excedentes
  (alguns vencendo), ~10 solicitações em vários status e ~8 doações concluídas, para a
  banca ver as telas populadas. Marcar visualmente as seções com dados de exemplo como
  "Demonstração".

---

## 9. Regras que valem para o app inteiro

- Toda ação destrutiva/irreversível pede **confirmação**.
- Formulários: validação com mensagem clara ao lado do campo; botão entra em estado de
  carregamento ao enviar.
- Listas: filtros cumulativos, "Limpar filtros" restaura tudo, estado vazio explícito,
  contagem de resultados, barra de rolagem só quando necessário.
- **Datas exibidas em dd/MM/aaaa.** Fuso de Brasília.
- Responsivo (celular e desktop) e com **modo claro/escuro** em todas as telas.
- **LGPD:** consentimento no cadastro, política de privacidade acessível, exclusão de
  conta/dados pelo próprio usuário.
- Textos e rótulos 100% em português do Brasil.
- Não usar dados pessoais reais em seeds nem na chave Pix.

## 10. Ordem de implementação sugerida

1. Landing page (`/`) fiel ao `index.html`.
2. Supabase + schema + Auth + shell de `/painel`.
3. Estabelecimento: publicar excedente + meus excedentes.
4. Instituição: doações disponíveis + solicitar retirada (modal + termo).
5. Ciclo completo: aceitar/recusar → registrar retirada → doação gerada → indicadores
   e ranking da landing lendo dados reais.
6. Dashboards de início dos dois perfis + relatórios de impacto + comprovante PDF.
7. Notificações (sino + página).
8. Perfil admin (cadastros + painel geral).
9. Seed de demonstração.
10. Polimento: acessibilidade, responsivo, textos de erro, modo escuro.

## 11. Não incluir

App mobile nativo; chat em tempo real; cálculo de rotas/mapas de logística; cobrança
recorrente; qualquer integração além de Supabase e (opcional) Mercado Pago para o
cartão.
