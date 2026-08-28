# ELO — a rede que conecta quem tem com quem precisa

MVP para o **Desafio Escolas Inovadoras 2026** (HJ Tech × Lovable) — equipe **UpConnection**, Escola SESI.
Eixo temático: **Impacto e Inclusão**.

A ELO conecta empresas com excedente de alimentos (supermercados, fazendas, restaurantes,
indústrias) a instituições beneficentes (bancos de alimentos, ONGs, igrejas, abrigos) em
qualquer cidade do Brasil — inspirada na Lei francesa nº 2016-138 e na Lei brasileira
nº 15.224/2025 (Política Nacional de Combate à Perda e ao Desperdício de Alimentos).

## Como o projeto está organizado

Estamos construindo em **um único arquivo** (`index.html`, com HTML + CSS + JS juntos), de
propósito: é a base que copiamos para dentro da **Lovable** (exigência do regulamento) e é
mais fácil de iterar com IA.

```
index.html            → o site inteiro (HTML + <style> + <script> num arquivo só)
imagens/              → logos, ícones de tipo e imagem de demonstração
LOVABLE_PROMPT.md     → prompt da versão atual para recriar tudo na Lovable (ver abaixo)
reference/            → histórico de versões (Elo V1…V5) — mostra a evolução do projeto
legacy/               → protótipo antigo em React/Vite (fora do caminho, mantido só p/ consulta)
```

## Divisão de trabalho

- **Frontend** (colega, usuário `josebepi06`): layout, seções, design, interações do `index.html`.
- **Backend** (skenzomatsui): autenticação e banco de dados reais — feitos na Lovable
  (Supabase), substituindo os formulários de demonstração e os dados fixos de KPIs/ranking.

Regra prática: mudanças de frontend e de backend passam pelo mesmo `index.html`. Commits
pequenos e frequentes; sempre atualizar o `LOVABLE_PROMPT.md` junto.

## Rodando localmente

Não tem build. É só abrir o `index.html` no navegador, ou servir a pasta:

```bash
python3 -m http.server 5173
```

E acessar `http://localhost:5173`.

## Fluxo com a Lovable

O regulamento exige que o MVP seja construído e publicado na Lovable. Nosso fluxo:

1. Iteramos o `index.html` aqui (com o Claude), commitando cada versão.
2. A cada push, atualizamos o `LOVABLE_PROMPT.md` — um prompt que descreve o produto inteiro.
3. Na Lovable: colamos o conteúdo do `index.html` como base + o `LOVABLE_PROMPT.md` como
   instrução, e a Lovable regenera o projeto lá dentro.
4. O backend (Supabase) é ligado na Lovable a partir daí.

## O que ainda falta (frontend)

- Foto real do hero em `imagens/doacao-hero.jpg` (hoje usa `Imagen de demonstração 1.jpeg`).
- Foto da equipe em `imagens/equipe.jpg`.
- Logo da UpConnection e logos de empresas parceiras (hoje são placeholders no HTML).

## Referências

- Lei nº 15.224/2025 — <https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15224.htm>
- France's law for fighting food waste (LOI n° 2016-138) — Zero Waste Europe factsheet.
