# Prompt para a Lovable — ELO (versão atual)

> Este arquivo é reescrito a cada push. Ele descreve **todo** o produto ELO como ele está hoje.
> Uso na Lovable: cole o conteúdo de `index.html` como base visual e cole este texto como
> instrução do que construir. A Lovable deve recriar o site e, em seguida, ligar o backend.

---

## 1. Contexto

ELO é uma plataforma web que conecta **empresas com excedente de alimentos** (supermercados,
fazendas/produtores rurais, restaurantes, padarias, indústrias de alimentos) a **instituições
beneficentes** (bancos de alimentos, ONGs, igrejas/pastorais, abrigos) para doação, em
**qualquer cidade do Brasil**.

Projeto da equipe **UpConnection** (Escola SESI) para o **Desafio Escolas Inovadoras 2026 —
HJ Tech × Lovable**, eixo **Impacto e Inclusão**. Público avaliador: banca técnica que vai
acessar e testar o MVP publicado.

Base legal / inspiração (já citada no site, manter):
- **França, Lei nº 2016-138 (2016):** proíbe supermercados de destruir alimentos não vendidos
  ainda próprios para consumo e obriga doação; criou a hierarquia de destino
  (prevenção → doação a pessoas → alimentação animal → compostagem/energia → descarte).
- **Brasil, Lei nº 15.224/2025:** Política Nacional de Combate à Perda e ao Desperdício de
  Alimentos; cria o "Selo Doador de Alimentos", autoriza a doação com segurança jurídica e
  incentiva o uso de aplicativos/plataformas para aproximar doadores e beneficiários.

## 2. Identidade visual (manter fielmente)

- **Tipografia:** títulos em `Fraunces` (serifada, peso 600); texto em `Inter`; detalhes/labels
  em `IBM Plex Mono`. Carregar do Google Fonts.
- **Paleta (modo claro):** fundo `#F5F7F0`, superfície `#FFFFFF`, texto `#16241B`,
  primária verde `#234A3A`, primária forte `#163229`, acento dourado `#C6952F`,
  acento terracota `#A85C3B`, borda `#DBE2D0`.
- **Modo escuro:** fundo `#0D1810`, superfície `#17251A`, texto `#ECF1E6`, primária `#77C39B`,
  acento `#E5BD6B`. Alternável por um toggle no topo (sol/lua), via `html[data-theme]`.
- **Cantos:** raios generosos (28 / 16 / 10 px). Botões em pill (100px).
- **Tom:** editorial, sóbrio, "de causa" — nada infantil, nada corporativo agressivo.
- Respeitar `prefers-reduced-motion` (desligar animações).
- Acessibilidade: contraste AA, foco de teclado visível (outline dourado), textos alt em imagens.

## 3. Estrutura da página (uma landing só, com âncoras)

Barra de topo fixa: logo ELO ("powered by UpConnection"), espaço para logo da UpConnection,
links (Quem somos, Problema, Como funciona, Rank), toggle de tema, botão "Cadastre-se".

Elemento de assinatura: **trilho de progresso vertical em corrente** fixo à esquerda que
enche conforme a rolagem (gradiente dourado→verde).

1. **Hero** — imagem de fundo (foto de doação), título animado palavra por palavra:
   "O excedente de hoje pode ser o prato de alguém amanhã." + linha de apoio + CTAs
   ("Quero me cadastrar", "Como funciona"). Onda SVG fluida na transição para a próxima seção.
2. **Quem somos** — equipe de estudantes catarinenses construindo a ELO na Lovable; espaço
   para foto da equipe.
3. **O problema** — 4 stat-cards: `55 mi t` desperdiçadas/ano; `54,7 mi` em insegurança
   alimentar; `6,4 mi` passando fome; `10º` no ranking mundial de desperdício (ONU). Callout
   de impacto + nota de fontes com links.
4. **De onde veio a ideia** — dois "law-cards" lado a lado: França 2016 e Brasil Lei 15.224/2025.
5. **Como funciona** — 6 passos (Cadastro → Publicação do excedente → Classificação automática
   pela hierarquia da lei → Match e logística → Confirmação e comprovante → Impacto medido).
   Bloco "O que vira o quê": 3 cards (Doação / Ração / Adubo-energia).
6. **Indicadores da rede** (marcado como *Demonstração*) — 4 KPIs com count-up ao entrar na
   tela: kg resgatados, refeições geradas, instituições parceiras, municípios conectados.
7. **Rank** (marcado como *Demonstração*) — pódio de 3 empresas + lista das posições 4–7,
   "empresas que mais doaram", com cidade/UF e kg.
8. **Cadastro** — dois formulários lado a lado:
   - *Instituição beneficente:* nome, CNPJ/registro, cidade/estado, e-mail ou WhatsApp,
     checkbox de consentimento LGPD. Ícones de tipo (igreja, ONG, abrigo, banco de alimentos).
   - *Empresa doadora:* nome, tipo de estabelecimento (select), cidade/estado, botão
     "Ver instituições próximas (simulação)" que lista 3 instituições fictícias com distância,
     e-mail ou WhatsApp, checkbox LGPD. Ícones de tipo (indústria, fazenda/trator, restaurante).
9. **Privacidade** — texto curto de conformidade com a LGPD (Lei nº 13.709/2018).
10. **Footer** verde-escuro — marca, empresas parceiras (placeholders), metadados
    (Equipe: UpConnection, Eixo: Impacto e Inclusão, Escola: Escola SESI), créditos
    "Feito com Lovable e Inteligência Artificial".

## 4. Interações já existentes (JS, manter)

- Título do hero: aparece palavra por palavra (delay incremental).
- Toggle claro/escuro alterando `document.documentElement.dataset.theme`.
- Reveal on scroll (`IntersectionObserver`, classe `.reveal` → `.in`).
- Trilho de corrente enche com o percentual de rolagem.
- Count-up dos KPIs quando entram na viewport.
- Simulação de "instituições próximas" no formulário de doador.
- Submit dos formulários: hoje só mostra mensagem de sucesso e desabilita os campos.

## 5. Backend a construir na Lovable (Supabase)

Trocar a parte de demonstração por dados reais, mantendo o mesmo visual:

### Autenticação
- Cadastro/login por e-mail e senha (Supabase Auth) para os dois tipos de usuário.
- Campo `tipo_conta` em `perfis`: `'doador'` ou `'beneficiario'`.

### Tabelas (Postgres / Supabase)
- `perfis` — `id` (fk auth.users), `tipo_conta`, `nome`, `documento` (CNPJ/registro, opcional),
  `cidade`, `uf`, `contato`, `subtipo` (supermercado, fazenda, restaurante… / igreja, ONG,
  abrigo, banco de alimentos), `lat`, `lng` (opcional), `criado_em`.
- `excedentes` — `id`, `doador_id` (fk perfis), `tipo_alimento`, `quantidade_kg`,
  `condicao` (in natura / preparado / embalado / não perecível), `validade`,
  `destino_sugerido` (doação / ração / compostagem — calculado pela hierarquia),
  `status` (`disponivel` | `reservado` | `coletado` | `expirado`), `cidade`, `uf`, `criado_em`.
- `reservas` — `id`, `excedente_id`, `beneficiario_id`, `status` (`pendente` | `confirmada`
  | `coletada` | `cancelada`), `combinado_em`, `coletado_em`.
- `doacoes` (registro consolidado para ranking/indicadores) — `id`, `doador_id`,
  `beneficiario_id`, `quantidade_kg`, `tipo_alimento`, `data`.

### Regras / RLS
- Usuário só edita o próprio `perfil` e os próprios `excedentes`.
- Beneficiário vê `excedentes` com `status = 'disponivel'` (idealmente filtrando por
  proximidade da própria cidade/UF).
- Doador vê as `reservas` feitas nos seus excedentes.
- Consentimento LGPD obrigatório no cadastro; permitir exclusão de conta e dados.

### Telas novas (após login)
- **Doador:** publicar excedente (form → `excedentes`), lista dos meus excedentes com status,
  ver quem reservou, confirmar coleta (gera linha em `doacoes` e comprovante em PDF/tela
  para fins do Selo Doador).
- **Beneficiário:** painel de excedentes disponíveis perto de mim, reservar em 1 clique,
  combinar retirada, histórico de coletas.
- **Indicadores e Rank:** passar a ler de `doacoes` (soma de kg, contagem, nº de instituições,
  nº de municípios distintos). "Refeições geradas" ≈ `kg * 2`.
- Classificação automática do `destino_sugerido` seguindo a hierarquia da lei
  (próprio p/ humano → doação; impróprio p/ humano mas seguro p/ animal → ração; resto →
  compostagem/energia).

### Não incluir
- Pagamentos, cobrança, chat em tempo real, app mobile nativo. Foco no fluxo doação ponta a ponta.

## 6. Checklist de qualidade (o que a banca vai testar)

- [ ] Fluxo completo: empresa cadastra excedente → instituição reserva → coleta confirmada →
      aparece nos indicadores e no rank.
- [ ] Login/logout funcionando para os dois tipos.
- [ ] Responsivo (celular e desktop) e com modo escuro.
- [ ] Link público ativo e testável.
- [ ] Conformidade LGPD visível (política + consentimento).

---

### Histórico de versões deste prompt

- **v1 (2026-08-28):** primeira versão. Base = `Elo V5.html` importado como `index.html`,
  imagens normalizadas para `imagens/`, frontend de demonstração ainda sem backend.
