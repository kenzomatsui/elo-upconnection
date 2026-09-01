# Prompt completo para a Lovable — Plataforma ELO

> **Como usar**
> 1. Copie TUDO abaixo da linha e cole na Lovable como o primeiro prompt do projeto.
> 2. Anexe também o arquivo `index.html` (referência visual exata da landing) e o
>    `lovable/schema.sql` (modelo do banco).
> 3. A Lovable **não** vai entregar o app inteiro de uma vez — e nem deve. Peça para
>    construir **a Fase 1 primeiro**, teste, e só então vá pedindo a Fase 2 em prompts
>    curtos ("agora implemente a verificação de CNPJ", "agora o match por proximidade").
>
> **Resumo das decisões de escopo** (por que está dividido assim):
> - A banca avalia um **MVP funcional testável**. Vale muito mais um fluxo completo e
>   redondo do que 15 telas pela metade. Por isso a **Fase 1 é o coração do produto** e
>   já é um MVP defensável sozinho.
> - **Fase 2** são reforços de alto impacto que cabem se o tempo permitir
>   (verificação de CNPJ, mapa/proximidade, avaliações, pagamento com gateway).
> - **Fase 3** é roadmap: implemente só se sobrar tempo; senão, é assunto para o pitch.

---

Construa uma aplicação web chamada **ELO** em **React + TypeScript + Tailwind**, com
backend no **Supabase** (Postgres, Auth, Storage, RLS, Edge Functions). Idioma:
**português do Brasil**. Datas exibidas em **dd/MM/aaaa**, fuso de Brasília.

## O que é o ELO

Rede que conecta **estabelecimentos com excedente de alimentos** (supermercados,
fazendas/produtores, restaurantes, padarias, indústrias) a **instituições beneficentes**
(ONGs, bancos de alimentos, igrejas, abrigos) para doação, em qualquer cidade do Brasil.
Base: lei francesa nº 2016-138 (2016) e Lei brasileira nº 15.224/2025 (Política Nacional
de Combate à Perda e ao Desperdício de Alimentos — cria o "Selo Doador de Alimentos" e
incentiva plataformas digitais de doação). Projeto estudantil da equipe **UpConnection**
para o Desafio Escolas Inovadoras 2026 (HJ Tech × Lovable), eixo "Impacto e Inclusão".

**Fluxo central do produto:**
estabelecimento publica um excedente → instituição solicita a retirada (aceitando um
termo de responsabilidade) → estabelecimento aceita → a retirada acontece → vira uma
**doação registrada** (entra nos indicadores e no ranking) → estabelecimento emite um
**comprovante** para fins do Selo Doador → as duas partes se avaliam.

---

## FASES

### FASE 1 — MVP para a banca (indispensável)
1. Landing page pública fiel ao `index.html`.
2. Cadastro e login (Supabase Auth) para 2 perfis: **estabelecimento doador** e
   **instituição beneficente**. Consentimento LGPD obrigatório.
3. Shell da área logada (cabeçalho + menu lateral + conteúdo + sino de notificações).
4. Estabelecimento: **publicar excedente** + **meus excedentes** + **solicitações
   recebidas** (aceitar / recusar / registrar retirada).
5. Instituição: **doações disponíveis** (com filtros) + **solicitar retirada** (modal
   com termo) + **minhas solicitações** (cancelar / confirmar retirada).
6. Ao concluir a retirada → cria a **doação**; a landing (Indicadores e Rank) passa a
   ler **dados reais** das views.
7. Notificações in-app + links `wa.me` para combinar a retirada por WhatsApp.
8. Doação em dinheiro por **Pix Copia e Cola** (gerado no cliente — só precisa de uma
   chave Pix válida; ver §9).
9. Seed de demonstração para as telas aparecerem populadas para a banca.

### FASE 2 — reforços de alto impacto (se houver tempo)
- **Verificação automática de CNPJ** no cadastro (BrasilAPI + Mapa das OSCs) — §3.
- **Autopreenchimento de endereço por CEP** (ViaCEP) — §11.
- **Match por proximidade + mapa** (geocodificação + Leaflet/OpenStreetMap) — §7.
- **Avaliações e reputação** mútua após cada retirada — §8.
- **Relatórios de impacto** por organização + **comprovante em PDF** — §5.5 / §6.5.
- **Pagamento com cartão e Pix com confirmação automática** via Mercado Pago
  (sandbox) — §9.
- **E-mails transacionais** (Resend) e **login com Google** — §11.

### FASE 3 — roadmap (falar no pitch, construir só se sobrar tudo)
- Perfil **administrador**: aprovação de cadastros, painel geral, campanhas — §10.
- Notificações automáticas por **WhatsApp Cloud API**.
- App mobile, rotas de coleta otimizadas, integração com bancos de alimentos regionais.

---

## 1. Identidade visual (obrigatório manter)

- **Fontes (Google Fonts):** títulos `Fraunces` (serifada, 600); corpo `Inter`;
  números/rótulos `IBM Plex Mono`.
- **Modo claro:** fundo `#F3EBE0`, fundo-suave `#EDE5D9`, superfície `#FFFBF5`,
  superfície-2 `#F8F0E6`, texto `#16241B`, texto-suave `#4E5D51`, verde primário
  `#234A3A`, verde forte `#163229`, dourado `#C6952F`, terracota `#A85C3B`, borda `#DBE2D0`.
- **Modo escuro:** fundo `#0D1810`, superfície `#17251A`, superfície-2 `#1C2B1F`,
  texto `#ECF1E6`, texto-suave `#A9BAAC`, primário `#77C39B`, dourado `#E5BD6B`,
  terracota `#D08561`, borda `#263A2C`, footer `#050D08`.
- Toggle sol/lua no cabeçalho aplicando `data-theme` na raiz; persistir em `localStorage`.
- Cantos 28 / 16 / 10px; botões em pílula (100px).
- Tom editorial, sóbrio, "de causa". Respeitar `prefers-reduced-motion`.
- **Acessibilidade AA:** foco de teclado visível (contorno dourado 3px), `alt` em
  imagens, labels nos campos, navegação por teclado.
- Assets da marca em `imagens/` (vou subir): `logo_projeto_*`, `logo-upconnection-*`,
  ícones de tipo, `Imagen de demonstração 1.jpeg` (hero).

### Componentes base (criar uma vez, reusar em tudo)
Botão (primário / fantasma / contorno-claro), Card, Input/Select/Textarea com label e
erro, **Badge de status** (cor por status), **Tabela** com cabeçalho clicável para
ordenar + estado vazio ("Nenhum registro encontrado com os critérios informados."),
**Modal**, **Toast** (sucesso / alerta), **barra de filtros** (busca em texto + selects
+ intervalo de datas + "Filtrar" / "Limpar filtros"), skeleton/spinner de carregamento,
**diálogo de confirmação** para toda ação destrutiva ou irreversível.

---

## 2. Landing page pública — rota `/`  (FASE 1)

Recrie **fielmente** o `index.html` anexo (layout, ordem, textos, paleta, fontes,
animações). Componentes por seção, nesta ordem:

1. **Cabeçalho fixo** — logo ELO + "powered by UpConnection" + logo UpConnection;
   links âncora (Quem somos, Problema, Como funciona, Rank, Doar); toggle de tema;
   botão **"Entrar / Cadastre-se"** → `/entrar`. ≤ 960px vira menu hambúrguer.
2. **Trilho de progresso em corrente** à esquerda, enche com a rolagem.
3. **Hero** — foto de fundo; título animado palavra por palavra ("O excedente de hoje
   pode ser o prato de alguém amanhã."); CTAs; onda SVG.
4. **Quem somos** — equipe de estudantes catarinenses; espaço p/ foto da equipe.
5. **O problema** — 4 cards (`55 mi t` / `54,7 mi` / `6,4 mi` / `10º`) + callout + fontes.
6. **De onde veio a ideia** — França 2016 / Brasil Lei 15.224/2025.
7. **Como funciona** — 6 passos + bloco "O que vira o quê" (Doação / Ração / Compostagem).
8. **Indicadores da rede** — 4 KPIs com contagem animada, **lendo a view
   `indicadores_rede`**. Selo "Demonstração" enquanto os números forem baixos.
9. **Rank** — pódio de 3 + lista 4º–10º, **lendo `ranking_estabelecimentos`**.
10. **Cadastro** — 2 cards que levam a `/entrar` com o tipo pré-selecionado.
11. **Doação em dinheiro** (`#doar`) — ver §9.
12. **Privacidade** — texto LGPD (Lei nº 13.709/2018).
13. **Footer** — marca, parceiros (HJ, SESI, Lovable), metadados da equipe.

---

## 3. Autenticação e verificação — rota `/entrar`

### 3.1 Cadastro e login (FASE 1)
Página com abas **"Entrar"** e **"Criar conta"**, no visual dos cards da landing.

**Criar conta:** escolher perfil — **Estabelecimento doador** ou **Instituição
beneficente**. Campos:
- Comuns: nome da organização, **CNPJ** (ou "não tenho CNPJ" → registro/observação),
  e-mail, senha (mín. 8), telefone/WhatsApp, **CEP** → cidade/UF/endereço.
- Estabelecimento: tipo (supermercado / fazenda ou produtor / restaurante / padaria /
  indústria).
- Instituição: tipo (ONG / banco de alimentos / igreja / abrigo / escola), área de
  atuação, público atendido, capacidade diária (opcional).
- **Checkbox obrigatório** de consentimento LGPD (link p/ a Política de Privacidade).
- `supabase.auth.signUp` com esses dados em `options.data`; o trigger `handle_new_user`
  cria o perfil. Contas novas entram com `status = 'pendente'`.
- Depois de criar: tela **"Cadastro em análise"**. (Deixe um flag simples para, na
  demo, cadastros já entrarem como `ativo` sem espera.)

**Entrar:** e-mail + senha. Mensagens: credenciais inválidas → "E-mail ou senha
inválidos."; `pendente` → "Seu cadastro ainda está em análise."; `bloqueado` →
"Acesso bloqueado. Fale com o suporte."; sucesso → atualiza `ultimo_acesso`, guarda a
sessão, vai para `/painel`. Link "Esqueci minha senha" (Supabase). Rotas `/painel/*`
protegidas.

### 3.2 Verificação automática de CNPJ (FASE 2)
No passo do CNPJ do cadastro, chamar a Edge Function **`validar-cnpj`** (ver §11), que
consulta a **BrasilAPI** (`/cnpj/v1/{cnpj}`) e devolve razão social, nome fantasia,
natureza jurídica, CNAE, situação cadastral e endereço.

Comportamento:
- **Autopreenche** nome e endereço; deixa o usuário confirmar.
- Se `descricao_situacao_cadastral` ≠ `ATIVA` → **bloqueia** o cadastro:
  "Este CNPJ não consta como ativo na Receita Federal."
- **Instituição beneficente:** se o **código de natureza jurídica começa com "3"**
  (grupo "Entidades sem Fins Lucrativos" da Receita — associações, fundações,
  organizações religiosas, OS, OSCIP) **ou** o CNAE principal é de assistência social
  (ex.: 88.00-6, 94.30-8, 94.91-0, 87.xx, 85.11/85.12) → marcar `verificado = true`,
  `verificacao_fonte = 'brasilapi'`. Opcionalmente cruzar com a **API do Mapa das OSCs
  (IPEA)** por CNPJ: se encontrado, `verificacao_fonte = 'mapa_oscs'` e badge
  **"Instituição verificada"**. Se nada bater → mantém `status = 'pendente'` e pede
  **upload do estatuto + ata de eleição da diretoria** para análise manual do admin.
- **Estabelecimento:** valida só que o CNPJ está ativo; guarda CNAE (informativo).
- Guardar a resposta crua em `perfis.verificacao_dados` (jsonb).

Exibir o selo **"Instituição verificada"** / **"Estabelecimento parceiro"** no perfil
público e nas listagens quando `verificado = true`.

---

## 4. Shell da área logada — rotas `/painel/*`  (FASE 1)

- **Cabeçalho:** logo ELO; à direita: **sino de notificações** (badge de não lidas +
  dropdown), toggle de tema, nome + tipo da organização (+ selo de verificação), botão
  **Sair** (confirmação "Deseja realmente encerrar a sessão?").
- **Menu lateral:** itens com ícone e rótulo, item ativo destacado; lista muda por
  perfil. No mobile vira menu retrátil.
- **Conteúdo** central troca sem recarregar. **Rodapé:** organização + "ELO · versão 0.1".
- "Início" abre o dashboard do perfil e carrega por padrão ao logar.

---

## 5. Perfil ESTABELECIMENTO DOADOR (`tipo_conta = 'doador'`)

Menu: Início · Publicar excedente · Meus excedentes · Solicitações recebidas ·
Relatório de impacto · Notificações · Minha organização.

### 5.1 Início — dashboard  (FASE 1)
"Olá, {nome}." + 4 cards (só desta organização): excedentes disponíveis · solicitações
pendentes · retiradas concluídas · kg doados no mês. Abaixo: painel **"Vencendo em
breve"** (disponíveis com validade em ≤ 3 dias) + atalho "Publicar excedente".

### 5.2 Publicar excedente  (FASE 1)
Campos: categoria (`categorias`), descrição, quantidade + unidade (kg / unid / L /
porções / caixas / pacotes), condição (in natura / preparado / embalado / não
perecível), **é perecível?**, **data de validade** (obrigatória se perecível),
**retirar até** (data e hora), **ponto de retirada** (endereço cadastrado ou novo, com
CEP), observações, **foto** (upload p/ Storage `excedentes`).
Validações: quantidade > 0; validade ≥ hoje; "retirar até" no futuro e ≤ validade.
**Destino sugerido** (editável): dentro da validade e seguro → `doacao`; fora da
validade mas seguro p/ animais → `racao`; senão → `compostagem`.
Salvar → `excedentes` com `status = 'disponivel'` → toast → "Meus excedentes".

### 5.3 Meus excedentes  (FASE 1)
Filtros (texto na descrição, status, categoria, período). Tabela: descrição, categoria,
quantidade, validade (**badge vermelho** se ≤ 3 dias), status, nº de solicitações, data
de cadastro. Ordenável; padrão validade crescente. Ações: **Editar** (só `disponivel`),
**Cancelar** (confirmação → `cancelado`), **Ver solicitações**.

### 5.4 Solicitações recebidas  (FASE 1)
`solicitacoes` nos meus excedentes; filtros status/período. Ao abrir uma `pendente`:
resumo do excedente + dados da instituição (nome, tipo, **selo de verificação**,
**nota média**, cidade, contato, botão **WhatsApp** `wa.me`). Botões:
- **Aceitar** → `aceita` (excedente vira `reservado` via trigger); pode ajustar a data.
- **Recusar** → pede motivo → `recusada` (excedente volta a `disponivel`).
- Quando `aceita`: **Registrar retirada** → data/hora efetiva → `concluida` (trigger
  cria a **doação** e fecha o excedente).
- Quando `concluida`: **Ver comprovante** (§5.5) e **Avaliar a instituição** (§8).

### 5.5 Relatório de impacto  (FASE 2)
KPIs: kg doados, nº de doações, instituições atendidas, municípios. Gráfico de barras
"doações por mês" (12 meses, destaca o pico) + pizza "por categoria" (< 2% → "Outros").
Ler `doacoes_por_mes` / `doacoes_por_categoria` filtrando `doador_id`.
Botão **"Gerar declaração de doação"** → PDF (jsPDF no cliente ou Edge Function) com
dados do estabelecimento, da instituição, itens, quantidades, datas, um código de
verificação, e texto padrão citando a Lei nº 15.224/2025 e o Selo Doador. Salvar no
bucket privado `comprovantes`.

### 5.6 Notificações  (FASE 1)
Lista de `notificacoes` (título, mensagem, data, tipo). Marcar como lida (individual e
"marcar todas"). Clique leva ao `link`.

### 5.7 Minha organização  (FASE 1)
Editar perfil, gerenciar endereços/pontos de retirada, trocar senha, ver **perfil
público** (read-only, com histórico e nota). Botão **"Excluir minha conta e meus
dados"** (confirmação dupla — direito da LGPD).

---

## 6. Perfil INSTITUIÇÃO BENEFICENTE (`tipo_conta = 'beneficiario'`)

Menu: Início · Doações disponíveis · Minhas solicitações · Relatório de impacto ·
Notificações · Minha organização.

### 6.1 Início — dashboard  (FASE 1)
"Bem-vinda, {nome}!" + 4 cards: doações disponíveis (na região) · solicitações
pendentes · aceitas (prontas p/ retirar) · retiradas concluídas. Abaixo: **"Disponíveis
perto de você"** (mesma cidade/UF, por validade) + alertas ("2 retiradas agendadas para
amanhã").

### 6.2 Doações disponíveis  (FASE 1; mapa na FASE 2)
Filtros: busca por texto, categoria, **validade — de / até**, cidade/UF, **raio de
distância** (Fase 2). Lista/cards dos `excedentes` `disponivel` e **não vencidos**.
Cada item: estabelecimento (+ selo, + nota), descrição, categoria, quantidade,
condição, validade, destino sugerido, **distância** (Fase 2). **Ordenar por validade
crescente por padrão**. Botão **"Solicitar retirada"**; se já houver solicitação
`pendente`/`aceita` da instituição para aquele item → desabilitado ("Você já tem uma
solicitação ativa para este item."). Sem resultados → mensagem padrão.
**Fase 2:** alternar entre lista e **mapa** (Leaflet + OpenStreetMap) com pins dos
excedentes; clicar no pin abre o card.

### 6.3 Modal "Solicitar retirada"  (FASE 1)
Título "Confirmar solicitação de retirada". Somente leitura: estabelecimento,
descrição, quantidade + unidade, validade, endereço de retirada. Campos:
- **Data prevista de retirada** (obrigatória): mínimo **D+1** e **≤ validade** do item.
- **Observações** (opcional, até 200 caracteres).
- **Checkbox obrigatório — Termo de Responsabilidade:** "Declaro que a instituição se
  responsabiliza pela retirada, transporte e conservação adequados do alimento, nos
  termos da Lei nº 15.224/2025, e que ele será destinado exclusivamente a consumo
  humano por pessoas em situação de vulnerabilidade." (link p/ o termo completo).
Confirmar → `solicitacoes` (`status = 'pendente'`, `termo_aceito = true`) → toast →
o estabelecimento é notificado (in-app + e-mail na Fase 2).

### 6.4 Minhas solicitações  (FASE 1)
Filtros status (Todos / Pendente / Aceita / Recusada / Concluída / Cancelada) e período.
Tabela: estabelecimento, excedente, data da solicitação, retirada prevista, status;
ordem por data decrescente. Ações: `pendente` → **Cancelar** (confirmação; item volta a
`disponivel`); `aceita` → contato do estabelecimento (+ WhatsApp) + **Confirmar
retirada** (data/hora efetiva → `concluida`); `recusada` → mostra o motivo;
`concluida` → **Avaliar o estabelecimento** (§8).

### 6.5 Relatório de impacto  (FASE 2)
KPIs: kg recebidos, nº de retiradas, categorias, estabelecimentos parceiros. Gráficos
"recebido por mês" e "por categoria" (mesmas views, `beneficiario_id`).

### 6.6 Notificações — igual a 5.6.  ### 6.7 Minha organização — igual a 5.7 (+ campos
de área de atuação, público atendido, capacidade; upload de estatuto se pendente).

---

## 7. Match por proximidade + mapa  (FASE 2)

- Ao cadastrar/editar endereço, chamar a Edge Function **`geocodificar`** (Nominatim /
  OpenStreetMap) → `lat`/`lng` no perfil e nos excedentes.
- Na listagem de "Doações disponíveis", calcular a distância (fórmula de Haversine em
  SQL ou no cliente) entre a instituição e cada excedente; permitir filtrar por raio
  (5 / 10 / 25 / 50 km) e ordenar por distância.
- Visão de **mapa** com **Leaflet + tiles do OpenStreetMap** (sem chave/custo); pins
  dos excedentes disponíveis; popup com o resumo e botão "Solicitar retirada".
- No dashboard do estabelecimento, mini-mapa com as instituições próximas cadastradas.

---

## 8. Avaliações e reputação  (FASE 2)

- Depois de uma retirada **`concluida`**, as duas partes podem se avaliar **uma vez**:
  nota 1–5 + comentário → tabela `avaliacoes`. Um trigger atualiza `perfis.nota_media`.
- Mostrar a nota média (estrelas) no perfil público, nas listagens de excedentes e no
  detalhe das solicitações.
- Badge **"Parceiro de confiança"** para quem tem nota ≥ 4,5 com ≥ 5 avaliações.
- Perfil público de cada organização (`/org/{id}`): dados básicos, selo de verificação,
  nota, nº de doações concluídas, categorias mais doadas/recebidas, últimos comentários.

---

## 9. Doação em dinheiro / pagamentos  (`#doar` na landing)

O botão de pagamento **hoje não confirma nada** porque o Pix estático depende de uma
chave válida e o cartão precisa de um gateway. Faça assim:

### FASE 1 — Pix Copia e Cola (estático, sem gateway, R$ 0)
- Manter a geração do payload **BR Code / EMV** no cliente (a função com CRC16 já
  existe no `index.html`). Mostrar o QR + botão "Copiar código".
- **Corrigir a chave:** usar uma chave Pix **válida e sem pontuação**. Para chave do
  tipo CPF/CNPJ, usar **só os dígitos** (`10880030950`, não `108.800.309-50`); para
  e-mail/telefone/aleatória, o valor exato. `NOME_RECEBEDOR` ≤ 25 caracteres sem
  acento; `CIDADE_RECEBEDOR` ≤ 15. Testar colando o código no app de um banco real.
- Usar a **conta oficial do projeto** (não CPF pessoal). O ideal é abrir uma conta
  PJ/MEI ou usar a conta da instituição parceira.
- Limitação assumida: não há confirmação automática. Registrar o `apoio` como
  `pendente` (`metodo = 'pix_estatico'`) e deixar claro na tela.

### FASE 2 — Gateway com confirmação automática (cartão + Pix dinâmico)
Recomendado: **Mercado Pago — Checkout Pro** (cria conta grátis, aceita Pix + cartão +
boleto, tem **sandbox** com usuários e cartões de teste). Arquitetura:
- Edge Function **`criar-pagamento`**: recebe `{ valor, nome, email }`, cria uma
  *preference* na API do Mercado Pago usando o secret `MP_ACCESS_TOKEN`, grava um
  `apoio` `pendente` com `provider = 'mercadopago'` e `provider_ref`, devolve o
  `init_point`. O front redireciona para lá.
- `back_urls` → páginas `/doar/sucesso`, `/doar/pendente`, `/doar/erro`.
- Edge Function **`webhook-pagamento`** (`notification_url`): recebe a notificação,
  consulta o pagamento na API, e atualiza o `apoio` para `confirmado` / `falhou` +
  `pago_em`.
- **Nunca** expor o Access Token no cliente. Usar credenciais de **teste** para a demo
  da banca; a produção exige a conta do projeto.

**Alternativas** (mesmo padrão de Edge Function + webhook), melhores se a equipe
conseguir um CNPJ:
- **Asaas** — muito usado por ONGs; Pix, boleto, cartão, split; sandbox.
- **Efí (Gerencianet)** — API de **Pix dinâmico** com QR e baixa automática; sandbox.
- **Stripe** — modo de teste, cartão e Pix; documentação forte.

> **Prioridade:** a doação em dinheiro é um recurso **secundário**. Não deixe ela
> atrasar o fluxo principal de doação de alimentos. Fase 1 (Pix estático) é suficiente
> para o MVP; o gateway é bônus.

---

## 10. Perfil ADMIN (`tipo_conta = 'admin'`)  (FASE 3)

Menu: Painel geral · Cadastros · Excedentes · (Campanhas).
- **Painel geral:** filtro de período (padrão 30 dias); 4 KPIs (total de doações, kg,
  instituições atendidas, estabelecimentos ativos); 2 gráficos (barras "por mês" com
  pico destacado; pizza "por categoria", < 2% → "Outros"); 2 rankings (Top 5
  estabelecimentos por kg; Top 5 instituições por retiradas). Botão "Atualizar".
- **Cadastros:** lista de perfis (exceto admins); busca por nome/e-mail; filtro por
  tipo e status; **pendentes no topo**; "Exibindo X registro(s).". Ações: Pendente →
  Aprovar / Recusar; Ativo → Bloquear; Bloqueado → Reativar. Notificar o usuário.
  Ver o estatuto enviado, se houver.
- **Excedentes:** tabela geral com filtros; admin pode cancelar um item impróprio.
- **Campanhas** (opcional): meta em kg, período, participantes; criar / detalhar /
  encerrar / cancelar.

Enquanto o admin não existir, a aprovação de cadastros pode ser feita manualmente no
Supabase (mudar `perfis.status` para `ativo`).

---

## 11. Backend — Supabase

Crie o schema **exatamente** conforme `lovable/schema.sql` (anexo): tabelas `perfis`,
`enderecos`, `categorias`, `excedentes`, `solicitacoes`, `doacoes`, `notificacoes`,
`apoios`, `avaliacoes`; triggers `handle_new_user`, `processar_solicitacao`,
`atualizar_nota_media`, `expirar_excedentes`; views `indicadores_rede`,
`ranking_estabelecimentos`, `ranking_ongs`, `doacoes_por_mes`, `doacoes_por_categoria`;
função `is_admin()`; e **todas as políticas RLS**. Não crie colunas a mais.

- **Auth:** e-mail + senha (Fase 1); **Google OAuth** (Fase 2).
- **Storage:** buckets `excedentes` (público, fotos), `comprovantes` (privado, PDFs),
  `documentos` (privado, estatutos das instituições).
- **Edge Functions:**
  | Função | Fase | O que faz |
  |---|---|---|
  | `validar-cnpj` | 2 | consulta BrasilAPI (`/cnpj/v1/{cnpj}`) e, se possível, a API do Mapa das OSCs; devolve dados + classificação (verificado / pendente / bloqueado) |
  | `geocodificar` | 2 | endereço → `lat`/`lng` via Nominatim (OpenStreetMap) |
  | `criar-pagamento` | 2 | cria a cobrança no Mercado Pago (secret `MP_ACCESS_TOKEN`), grava `apoio` pendente, devolve `init_point` |
  | `webhook-pagamento` | 2 | recebe a notificação do gateway e confirma/falha o `apoio` |
  | `enviar-email` | 2 | e-mails transacionais via **Resend** (secret `RESEND_API_KEY`) |
  | `gerar-comprovante` | 2 | monta o PDF da declaração de doação e salva no bucket |
- Rodar `expirar_excedentes()` ao carregar listas de excedentes (ou cron do Supabase 1x/dia).
- **Seed de demonstração:** ~6 estabelecimentos, ~4 instituições, ~15 excedentes (alguns
  vencendo), ~10 solicitações em vários status, ~8 doações concluídas, ~6 avaliações.
  Marcar visualmente seções com dados de exemplo como "Demonstração". **Sem dados
  pessoais reais.**

### Integrações externas — resumo
| API / serviço | Para quê | Custo | Fase |
|---|---|---|---|
| **BrasilAPI** (`/cnpj`, `/cep`) | validar/auto-preencher CNPJ e endereço; situação cadastral; natureza jurídica | grátis, sem chave | 1 (CEP) / 2 (CNPJ) |
| **Mapa das OSCs — IPEA** | confirmar que o CNPJ é uma OSC registrada | grátis | 2 |
| **ViaCEP** | fallback de CEP → endereço | grátis | 1 |
| **Nominatim (OpenStreetMap)** | geocodificar endereço → lat/lng | grátis (política de uso) | 2 |
| **Leaflet + tiles OpenStreetMap** | mapa de excedentes/instituições | grátis, sem chave | 2 |
| **Pix Copia e Cola (BR Code)** | doação em dinheiro sem gateway | grátis (precisa de chave Pix válida) | 1 |
| **Mercado Pago — Checkout Pro** | cartão + Pix com confirmação automática | grátis criar; taxa por transação; sandbox | 2 |
| **Asaas / Efí / Stripe** | alternativas de gateway (melhores com CNPJ) | idem | 2/3 |
| **Resend** | e-mails transacionais | free tier (~3k/mês) | 2 |
| **wa.me deep links** | abrir conversa no WhatsApp p/ combinar retirada | grátis | 1 |
| **WhatsApp Cloud API (Meta)** | notificações automáticas por WhatsApp | grátis c/ limites; exige verificação Meta | 3 |
| **Google OAuth (Supabase)** | login social | grátis | 2 |
| **Plausible / PostHog** | métricas de uso (evidência p/ a banca) | free tier | 2 |

---

## 12. Regras que valem para o app inteiro

- Ação destrutiva/irreversível → **confirmação**.
- Formulários: validação com mensagem clara ao lado do campo; botão em estado de
  carregamento ao enviar.
- Listas: filtros cumulativos; "Limpar filtros" restaura tudo; estado vazio explícito;
  contagem de resultados; barra de rolagem só quando necessário.
- **Datas em dd/MM/aaaa.** Responsivo (celular e desktop). **Modo claro/escuro** em
  todas as telas.
- **LGPD:** consentimento no cadastro, política acessível, exclusão de conta/dados pelo
  próprio usuário, dados só usados para intermediar a doação.
- Textos 100% em português do Brasil. Sem dados pessoais reais em seeds ou na chave Pix.

## 13. Ordem de implementação

Fase 1: (1) landing → (2) Supabase + schema + Auth + shell → (3) estabelecimento:
publicar + meus excedentes → (4) instituição: disponíveis + solicitar (modal + termo) →
(5) ciclo aceitar/recusar/registrar retirada → doação → indicadores/rank reais →
(6) notificações + `wa.me` → (7) Pix estático → (8) seed de demonstração.
Fase 2: verificação de CNPJ → CEP/geocodificação → match + mapa → avaliações →
relatórios + comprovante PDF → Mercado Pago sandbox → e-mails + Google login.
Fase 3: admin → WhatsApp Cloud API → demais itens do roadmap.

## 14. Não incluir

App mobile nativo; chat em tempo real; otimização de rotas de coleta; cobrança
recorrente; qualquer integração fora das listadas em §11.
