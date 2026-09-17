# ELO

**Uma ponte entre o alimento que sobra e quem precisa dele.**

Projeto da equipe **UpConnection**, da Escola SESI, para o **Desafio Escolas Inovadoras 2026 — HJ Tech × Lovable**, no eixo Impacto e Inclusão.

A proposta é aproximar empresas com excedentes de alimentos de instituições que recebem e distribuem doações. Este repositório reúne a interface de demonstração, sua evolução visual e o material para integrar o produto à Lovable e ao Supabase.

## O que está disponível

A versão principal está em [`index.html`](index.html): uma página com apresentação da rede, perfis de participantes, indicadores, ranking e formulários de demonstração.

**Os indicadores, o ranking e os formulários são demonstrativos.** O arquivo atual ainda não representa uma rede de doações em operação. A chamada de pagamento usa um endereço de backend de exemplo e precisa de integração antes de uso real.

## Ver localmente

Abra `index.html` no navegador ou, na pasta do repositório, execute:

```sh
python3 -m http.server 5173
```

Acesse [localhost:5173](http://localhost:5173). A página principal usa HTML, CSS e JavaScript, sem etapa de compilação.

## Mapa do projeto

| Caminho | Conteúdo |
| :--- | :--- |
| [`index.html`](index.html) | Interface principal, com estilos e interações no mesmo arquivo. |
| [`imagens/`](imagens/) | Identidade visual, ícones e imagens da demonstração. |
| [`lovable/`](lovable/) | Guia de migração, especificação do produto e esquema SQL. |
| [`reference/`](reference/) | Versões anteriores da interface, de V1 a V7. |
| [`legacy/`](legacy/) | Protótipo anterior em React e Vite. |
| [`LOVABLE_PROMPT.md`](LOVABLE_PROMPT.md) | Instruções usadas no fluxo de trabalho com a Lovable. |

## Equipe e desenvolvimento

- **Frontend — [josebepi06](https://github.com/josebepi06):** layout, seções e interações.
- **Backend — Sérgio Kenzo Matsui:** frente de autenticação e banco de dados na integração com Lovable/Supabase.

O desenvolvimento usa apoio de IA, incluindo Claude e Lovable. Os materiais desse processo estão preservados no repositório. O [guia de migração](lovable/guia-migracao.md) detalha a conexão do protótipo ao backend; as [notas originais](docs/PROJECT-NOTES.md) registram a organização e as pendências da equipe.

**Próximas etapas registradas:** integrar os fluxos reais, substituir os dados demonstrativos e completar as imagens da equipe e de parceiros.
