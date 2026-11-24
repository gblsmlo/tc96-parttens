# 0009. Camada `blocks` acima de `patterns`, em categorias; os templates instaláveis viram blocks

- **Status:** Draft (decisão do dono na conversa de 2026-11-22; o texto espera a revisão dele)
- **Date:** 2026-11-22
- **Origin:** pedido do dono em 2026-11-22: montar variações de páginas de auth (login etc.) para um projeto novo, que ele vê como blocks e não como patterns; "precisamos decidir para que não existam mais essas dúvidas"
- **Supersedes:** none
- **Amends:** [ADR 0004](0004-templates-only-in-storybook.md), no aspecto D3 (a palavra "bloco", usada ali para uma peça compartilhada, passa a ler-se "peça"; a raiz `Templates/` continua só com as telas do Storybook); [ADR 0005](0005-installable-templates.md), nos aspectos D1, D2, D4 e D8, que passam a valer para blocks (D5 e D6, nomes no registry e alias `templates`, mudaram no refactor do CLI, D9); [ADR 0006](0006-flow-family-on-react-flow.md), que leva as duas telas de fluxo para a categoria AI & Agents

## Context

| Força | Fonte |
| --- | --- |
| O dono quer montar variações de páginas de auth (login etc.) para um projeto novo e as vê como blocks, não como patterns | pedido do dono de 2026-11-22 |
| "Template" nomeia duas coisas: o item instalável (ADR 0005) e a tela só de Storybook (ADR 0004) | `.specs/adr/0004-templates-only-in-storybook.md`, `.specs/adr/0005-installable-templates.md` |
| A sidebar do Storybook tem a raiz `Application` (instaláveis) e a raiz `Templates` (só Storybook) | ordem em `storySort` (`apps/storybook/.storybook/preview.ts`) |
| `boundaries:check` permite `templates` importar `parttens`, `ui`, `elements`, `utils` e `helpers`, e nada importa `templates` | `scripts/check-boundaries.ts` |
| O build do registry publica todo item de pattern e de template como `registry:block` | `packages/registry/src/build-registry.ts:151` |
| `templateNames` e `templateSources` listam `app-shell-1..4`, `workflow-editor` e `agent-builder` | `packages/registry/src/manifest.ts` |
| `docs/architecture/tc96-ui.md` descreve a camada Patterns como "blocos de produto" | `docs/architecture/tc96-ui.md` |
| Os editores de fluxo importam caminhos internos de patterns (`flow/canvas/composition/flow-canvas/flow-canvas`), então renomear um arquivo interno quebra o block | `docs/architecture/layer-decision-map.md` (Como o tc96 aplica, 3); `packages/blocks/AGENTS.md` (Dependents) |
| O especificador `tc96/blocks` existiu no 0.1.0 e foi removido | `docs/architecture/public-api-baseline.md:3` |
| Na literatura e no mercado, o nível composto e específico é feito do nível genérico e reutilizável: Atomic Design, recipes sobre o core, tiers de produto, blocks do shadcn com `registryDependencies`, COSS (primitives → particles → atoms) | `docs/architecture/layer-decision-map.md` (Fontes) |
| Stable Dependencies Principle: depender na direção da estabilidade; Acyclic Dependencies Principle: sem ciclo entre componentes publicados | Robert C. Martin, citados em `docs/architecture/layer-decision-map.md` (Fontes) |

## Decision

Vamos acrescentar a camada `blocks` acima de `patterns`, no pacote `@tc96/blocks`, organizada em categorias. Os templates instaláveis passam a ser blocks, e o nome "template" fica reservado às telas que só existem no Storybook.

**Axis that decided it:** boundary

| Aspecto | Desenho |
| --- | --- |
| D1. Definição | Block é a composição de uma página, de uma moldura de página ou de uma seção de página, com variações numeradas (`login-1`, `app-shell-3`), que o consumidor instala e edita como ponto de partida. Pattern é um componente composto e reutilizável, colocado por outro componente em vários lugares, com uma versão e API estável no baseline. Tamanho não decide: `collection` e `wizard` são grandes e são patterns. Critério principal: variação estrutural é block; configuração por props é pattern |
| D2. Direção | `blocks` → `parttens` → `ui` → `utils` (`helpers` sem React; `elements` saiu e Text e IconFrame estão em `ui`). Pattern nunca importa block; block nunca importa outro block. Peças de um grupo ficam em `<categoria>/<grupo>/shared/`; uma peça de que blocks de grupos diferentes precisam desce para pattern, ou para `ui` se não tiver domínio. Block importa pattern por arquivo, não pelo barrel (ADR 0005 D3), e pode usar só `ui`. Block segue o contrato dos patterns: controlado, sem fetch, sessão, cookie, provider de auth ou tema |
| D3. Categorias e caminho | `packages/blocks/src/<categoria>/<grupo>/<block>/`, com as categorias `application`, `data`, `charts`, `solutions`, `ai-agents`, `ecommerce` e `marketing`. Story `Blocks/<Categoria>/<Grupo>/<Nome>`, com os nomes de exibição Application, Data, Charts, Solutions, AI & Agents, eCommerce e Marketing. O nome do item no registry não leva a categoria e é único (`login-1`). Desempate: domínio explícito vence o genérico; Solutions só recebe vertical sem categoria própria; entre Data e Charts decide o conteúdo dominante (registros ou métricas); Application fica com moldura e acesso |
| D4. Migração | `app-shell-1..4` ficam em `application/shell/`. `workflow-editor` e `agent-builder` saem de `application/flow/` e vão para `ai-agents/flow/`. Os blocks de auth previstos ficam em `application/auth/` (`login-1`, `signup-1`, `forgot-password-1`, `reset-password-1`, `otp-1`), com spec própria antes da implementação |
| D5. Pacote | `packages/templates` (`@tc96/templates`) vira `packages/blocks` (`@tc96/blocks`). O especificador `tc96/blocks` existiu no 0.1.0 e foi removido (`docs/architecture/public-api-baseline.md:3`); o nome volta com outro sentido |
| D6. Storybook | A raiz `Application` vira `Blocks`; `Templates/Doc` vira `Blocks/Doc`; a raiz `Templates` fica só com as telas do Storybook (ADR 0004) |
| D7. API pública | Cada block entra em `docs/architecture/public-api-exports.json` como `block:<nome>` (antes `template:<nome>`) |
| D8. Vocabulário | "template" deixa de nomear algo instalável. "bloco" não é usado nos docs para uma peça de pattern. "pattern" no tc96 é componente composto reutilizável, não a orientação de design do GOV.UK |
| D9. CLI e registry | O refactor do CLI e do registry está feito: o alias é `blocks` (`aliases.blocks` no `components.json`, derivado do `ui` como `helpers` e `patterns`, e `paths` `@acme/blocks/*` no tsconfig), `templateNames` e `isTemplate` viraram `blockNames` e `isBlock`, e o texto de ajuda fala em blocks. Quem já instalou desde a v0.20.0 continua funcionando, com aviso: `aliases.templates` vale como `aliases.blocks`, o caminho derivado `<ui>/templates` do tsconfig recebe os blocks até ser renomeado, e `aliases.elements` ou uma pasta `elements` de instalações antigas gera um aviso de que o tc96 não instala mais `elements`. Quando um pattern é instalado ou atualizado, a checagem de compatibilidade também compila os blocks já instalados e relata só os erros que a atualização causa. A remoção de `elements` (IconFrame e Text em `ui`; o Avatar é o do COSS, dimensionado nos patterns por `--avatar-size`) foi feita em paralelo e integrada junto com esta mudança |

O mapa de decisão, com a matriz e a árvore para escolher a camada e a categoria, é o guia operacional: [`docs/architecture/layer-decision-map.md`](../../docs/architecture/layer-decision-map.md).

## Alternatives

| Alternative | Why it was discarded |
| --- | --- |
| Manter "templates" como nome da camada instalável | mantém dois sentidos para template (o item instalável e a tela do Storybook) e diverge do termo que o mercado usa, block (shadcn) |
| Tornar as páginas de auth patterns | são variações estruturais numeradas que o consumidor edita, não uma API reutilizada em muitos lugares; um pattern tem API estável no baseline e o auth não tem |
| Deixar pattern importar block | cria ciclo, o que fere o ADP, e depender de um block fere o SDP, porque o block é o mais volátil; o registry levaria blocks dentro de todo item de pattern |
| Blocks planos, sem categorias | não escala para os sete grupos que o dono listou |
| Manter os editores de fluxo em `application/` | o domínio deles é AI & Agents, e domínio explícito vence o genérico |

## Consequences

- **Gains:** uma palavra por camada; o nome bate com o shadcn e com o mercado; o mapa de decisão dá um teste para cada peça nova (`docs/architecture/layer-decision-map.md`).
- **Costs:**
  - renomear mexe em imports, títulos e ids das stories, `paths` do tsconfig, arquivos `AGENTS.md` e caminhos de origem do registry;
  - consumidores que instalaram `workflow-editor` ou `agent-builder` recebem os arquivos em `ai-agents/flow/` na próxima instalação;
  - quem instalou `templates` ou `elements` recebe avisos do CLI até renomear o alias e o `paths` (D9);
  - promover uma peça de block para pattern exige mover o código e trocar os imports dos blocks que a usam (proposed).
- **Verifiable invariants:**

| Invariante | Tipo | Como verificar |
| --- | --- | --- |
| Não existe `packages/templates`; o pacote é `packages/blocks` | (proposed) static | `ls packages/` na revisão e no `boundaries:check` |
| `boundaries:check` recusa um arquivo de `parttens` que importa `@tc96/blocks` | static | `bun run boundaries:check`, com `blocks` na tabela de `scripts/check-boundaries.ts` |
| Um block só importa a própria pasta e o `shared/` do seu grupo; nenhum block importa outro block | static | `bun run boundaries:check`; casos em `scripts/check-boundaries.test.ts` |
| Todo título de story de block começa com `Blocks/` | (proposed) static | `grep -rn "title:"` nas stories de block |
| Cada pasta de block é `<categoria>/<grupo>/<block>`, com categoria da lista de D3 | (proposed) unit | teste que lista `packages/blocks/src` e confere profundidade e categoria |

## Not verified

- A página de Marketing feita de seções não foi decidida: a página copia as seções que usa, ou um block de página importa blocks de seção da mesma categoria? [GAP: a página de Marketing copia as seções que usa, ou um block de página pode importar blocks de seção da mesma categoria — decides: o dono]
- Blocks que importam o interior dos patterns (`flow/canvas/composition/...`) em vez do `index.ts`. Proposta: o block só importa o `index.ts`, o `core.ts` ou `composition/<nome>/index.ts` do pattern, e `boundaries:check` recusa os demais caminhos. [GAP: o block pode importar só `index.ts`, `core.ts` ou `composition/<nome>/index.ts` do pattern, com `boundaries:check` recusando o resto? — decides: o dono]
- Os tipos de teste marcados `(proposed)` na tabela de invariantes ainda não foram confirmados. [GAP: confirmar o tipo de teste de cada invariante marcada `(proposed)` — decides: o dono]

## Open questions

- [GAP: a página de Marketing copia as seções que usa, ou um block de página pode importar blocks de seção da mesma categoria? — decides: o dono]
- [GAP: o block importa só `index.ts`, `core.ts` ou `composition/<nome>/index.ts` do pattern, e `boundaries:check` recusa o resto? — decides: o dono]
- [GAP: confirmar o tipo de teste de cada invariante marcada `(proposed)` — decides: o dono]
