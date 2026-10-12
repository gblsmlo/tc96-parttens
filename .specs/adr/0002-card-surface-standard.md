# 0002. A superfície de card padrão vive em `packages/elements` como `CardSurface`, com o raio lido de uma variável opcional do consumidor

- **Status:** Approved (pelo dono na conversa de 2026-10-11, com a emenda da seção Emenda do dono)
- **Date:** 2026-10-11
- **Origin:** pedido do dono na conversa de 2026-10-11 ("padronizar a ui com card-bg rounder border; KanbanCard é um padrão aprovado; se algum consumer quiser referenciar, ele poderá fazê-lo")
- **Supersedes:** em parte, `docs/architecture/tc96-parttens.md:105` (só a frase do card do `SettingsSection` ser o `Card` do COSS sem classe, com `rounded-2xl`; invólucro `settings-section-rows`, `px-6`, linha de status e foco do `SettingsCollapsed` ficam como estão); o raio `rounded-2xl` do variante `card` em `docs/architecture/tc96-parttens.md:75`; o `rounded-lg border bg-card` do variante `inset` em `docs/architecture/tc96-parttens.md:85`; a moldura `rounded-xl border-border/60` do variante `card` do `Checklist` (`docs/architecture/tc96-parttens.md:111`, `packages/parttens/src/checklist/lib/variants.ts:103`); a regra "o `CardWidgetShell` é o único lugar de raio, borda e sombra" (`AGENTS.md`, seção Code conventions; `packages/parttens/src/widgets/AGENTS.md:71`)

## Context

| Força | Fonte |
| --- | --- |
| O card aprovado é o `KanbanCard`: `rounded-lg border border-border/80 bg-card not-dark:bg-clip-padding text-card-foreground shadow-xs/5` e um realce `before:` com raio `calc(var(--radius-lg)-1px)` | `packages/parttens/src/collection-views/views/kanban/components/kanban-card.tsx:25-37` |
| O `KanbanCard` não usa a raiz `Card` do COSS: é um `article` por `useRender` com `data-slot="card"`, e usa só as partes (`CardHeader`, `CardFooter`...) | `kanban-card.tsx:5-12`, `:136-153` |
| As partes do COSS e o `KanbanCard` se ajustam por `in-[[data-slot=card]:has(>[data-slot=card-panel])]`, então qualquer card precisa de `data-slot="card"` na raiz | `packages/ui/src/card.tsx` (`CardHeader`), `kanban-card.tsx:65`, `:97`, `packages/parttens/src/collection-views/AGENTS.md:74` |
| O `Card` do COSS fixa `rounded-2xl`, borda cheia e o realce em `calc(var(--radius-2xl)-1px)` dentro da própria classe | `packages/ui/src/card.tsx:15` |
| `packages/ui` é somente leitura e travado por `coss.lock.json`; só muda por `bun run sync:coss` | `AGENTS.md` (Rules enforced by scripts), `packages/ui/coss.lock.json:29-30` |
| `CardWidgetShell` é o `Card` do COSS com `rounded-lg border-border/80 shadow-none before:hidden`, sobrescrita que exige duas exceções | `packages/parttens/src/widgets/shared/card-widget-shell.tsx:15`, `scripts/override-exceptions.json:9-19` |
| `SettingsSection` usa o `Card` sem classe (`rounded-2xl`), decidido hoje numa auditoria de coerência | `packages/parttens/src/surfaces/settings/composition/settings-section/settings-section.tsx:14`, `docs/architecture/tc96-parttens.md:105` |
| `RecordGroup` desenha o card à mão: `card` com `rounded-2xl border bg-card`, `inset` com `rounded-lg border bg-card` | `packages/parttens/src/records/group/lib/variants.ts:6`, `:35` |
| `Checklist` `card` desenha uma moldura própria `rounded-xl border border-border/60`, sem fundo, com as linhas arredondadas em `first:rounded-t-xl last:rounded-b-xl` | `packages/parttens/src/checklist/lib/variants.ts:103`, `:117` |
| A coluna do Kanban (`rounded-lg border border-border bg-card shadow-none`) e a moldura da lista (`rounded-lg bg-card/40 border border-border/80`) são contêineres que seguram cards ou linhas | `packages/parttens/src/collection-views/views/kanban/components/kanban-column.tsx:289`, `packages/parttens/src/collection-views/views/list/components/list-view.tsx:113` |
| O tema do consumidor tem `--radius`, `--radius-lg: var(--radius)`, `--radius-2xl: calc(var(--radius) * 1.8)`, `--card`, `--border`; não há token de card nem de sombra | `apps/example/packages/ui/src/styles.css:29`, `:31`, `:176` |
| `rounded-2xl`/`--radius-2xl` também desenha `alert-dialog`, `dialog` e `sheet` do COSS; 11 itens usam `rounded-lg`/`--radius-lg` | `grep -l` em `packages/ui/src/*.tsx`, medição de 2026-10-11 |
| Cor, raio, borda e sombra novos ficam com o tema do consumidor; patterns não carregam CSS, tokens nem tema | `docs/architecture/tc96-parttens.md:203`, `AGENTS.md` (What this repo is) |
| `overrides:check` só cobre `className` em componentes importados de `@tc96/ui/<item>`; segue constantes importadas no workspace; falha em exceção sem uso | `scripts/check-overrides.ts:115-131`, `:207-223`, `:329` |
| `elements` pode importar `ui`, `utils`, `helpers`; `parttens` importa `elements` | `scripts/check-boundaries.ts:7-12`, `docs/architecture/tc96-parttens.md:240` |
| `packages/elements` é a camada de componentes próprios, distribuída arquivo a arquivo no alias `elements` do consumidor, só com o que o pattern importa | `packages/elements/package.json` (`"./*": "./src/*.tsx"`), `docs/architecture/tc96-parttens.md:225`, `:231`, `packages/registry/src/manifest.test.ts:273` |
| A linha de base da API pública só registra os barrels de `parttens`, não `elements` | `docs/architecture/public-api-exports.json` (chaves: os 11 patterns e `parttens`) |
| A gravação do CLI preserva um arquivo diferente do consumidor e só sobrescreve com "sim" | `.specs/adr/0001-instalador-proprio.md` (Decision, linha Gravação) |

## Decision

Vamos criar `CardSurface` em `packages/elements/src/card-surface.tsx`, a única superfície de card dos patterns, com a forma aprovada do `KanbanCard` e o raio lido de `--card-radius`, uma variável opcional que só o consumidor define, com `var(--radius-lg)` como padrão. Tokens do tema e o primitivo do COSS não mudam.

**Axis that decided it:** boundary

| Aspecto | Desenho |
| --- | --- |
| D1. Camada | `packages/elements`, não o tema (a) nem o COSS (b). O tema não tem como mudar só o card: `--radius-2xl` também desenha `dialog`, `alert-dialog`, `sheet`, e `--radius-lg` 11 itens. O COSS é somente leitura e o raio está na classe, não num token. Entre `parttens/shared` e `elements`, vence `elements`: a superfície não tem vocabulário de pattern, tem seis usos em cinco famílias (o terceiro consumidor de `REACT-ARCH-08` já existe) e `elements` já chega ao consumidor como arquivo editável no alias dele |
| D2. Forma | `useRender` com `div` padrão e `render` aberto, `data-slot="card"` na raiz (o mesmo do COSS, então `CardHeader`, `CardPanel`, `CardFooter` e as regras `in-[[data-slot=card]...]` continuam valendo). As classes são as de `kanban-card.tsx:26`, menos o raio fixo: a raiz declara `[--card-surface-radius:var(--card-radius,var(--radius-lg))]` e usa `rounded-(--card-surface-radius)` e `before:rounded-[calc(var(--card-surface-radius)-1px)]`. Sem variantes, densidade, hover ou estado: isso continua com quem usa (densidade e `--card-padding` do `KanbanCard`, `kanban-card.tsx:28-34`; `hover:`, `dimmed`, `selected`, `kanban-card.tsx:38-62`) |
| D3. Sombra | Uma só, a do `KanbanCard`: `shadow-xs/5` com o realce `before:`. O `CardWidgetShell` deixa `shadow-none before:hidden`. O `dimmed` do Kanban continua com `shadow-none` como estado próprio |
| D4. Gancho do consumidor | Em ordem de alcance: (1) `--card-radius` no tema (`:root`, `.dark` ou qualquer ancestral) muda o raio de todos os cards dos patterns sem tocar `Dialog`/`Sheet`; (2) `className` por instância, com raio por `[--card-radius:<valor>]`, não por `rounded-*`, para o realce acompanhar; (3) `[data-slot="card"]` no CSS do consumidor, que alcança o `Card` do COSS e o `CardSurface` juntos, de propósito: é um card só; (4) `import { CardSurface }` do alias `elements` para o consumidor desenhar o mesmo card nas próprias telas; (5) o arquivo `card-surface.tsx` copiado, que é do consumidor. Fundo, borda e sombra seguem os tokens `--card`, `--border` e o tema; não há variável para eles |
| D5. API pública | Contrato público: o módulo `@tc96/elements/card-surface` (`CardSurface` e `CardSurfaceProps`), a variável `--card-radius` e `data-slot="card"`. `--card-surface-radius` é interna: só descendentes de patterns a leem (linhas do `Checklist`). Nada é reexportado pelo barrel raiz de `parttens`, então `public-api-exports.json` não ganha nome; os nomes `CardWidgetShell` e `CardWidgetShellProps` saem e entram `WidgetShell` e `WidgetShellProps` (emenda do dono), então o baseline muda nos dois barrels que os exportam (`docs/architecture/public-api-exports.json:410-411`, `:635-636`) |
| D6. Migram | `KanbanCard` (raiz vira `CardSurface` com `render` repassado, mantém `data-pattern`, `data-variant`, `data-density`, `data-state`); `CardWidgetShell`, renomeado `WidgetShell` (de `Card` com sobrescrita para `CardSurface` com `render={<section />}` e `min-w-0`, sem borda: emenda do dono); `SettingsSection` (de `Card` para `CardSurface`); `RecordGroup` `card` (a `section` vira `CardSurface`) e `inset` (o invólucro das linhas vira `CardSurface`); `Checklist` `card` (o `ol` vira `CardSurface`, as linhas passam a `first:rounded-t-[calc(var(--card-surface-radius)-1px)]` e `last:rounded-b-[...]`) |
| D7. Ficam fora | Coluna do Kanban e moldura da `ListView` (contêineres, não cards; lacuna abaixo); pílulas e invólucros de avatar, HUD, alça de arrastar, cabeçalho de grupo da lista com `bg-card/90` (não são superfícies de card); `CardFrame` (nenhum pattern o usa, `data-table.test.tsx:112`) |
| D8. Exceções e `overrides:check` | As duas exceções do `CardWidgetShell` (`scripts/override-exceptions.json:9-19`) saem, porque o shell deixa de usar o `Card` do COSS; `check-overrides.ts:329` falha se ficarem. `overrides:check` passa a tratar `CardSurface` como componente com estilo, igual a um item COSS: raio, borda, sombra ou cor passados por um pattern em `className` exigem exceção registrada. O consumidor não passa pelo check |
| D9. Docs | Atualizar `docs/architecture/tc96-parttens.md:75`, `:85`, `:105`, `:111`, `:203` (a superfície padrão é o `CardSurface`) e `:231` (`elements` também guarda a superfície de card); `AGENTS.md` (Code conventions: decisões de raio, borda e sombra de card ficam no `CardSurface`); `packages/parttens/src/widgets/AGENTS.md:31`, `:71`; `packages/parttens/src/surfaces/settings/AGENTS.md:47`; `packages/parttens/src/collection-views/AGENTS.md:74` |

## Alternatives

| Alternative | Why it was discarded |
| --- | --- |
| (a) Tema: trocar `--radius-2xl` ou `--radius` no `styles.css` do consumidor | muda `dialog`, `alert-dialog`, `sheet` e os 11 itens em `--radius-lg`; não unifica borda `/80` nem sombra; e o tema é do consumidor, não do tc96 (`docs/architecture/tc96-parttens.md:203`) |
| (b) Primitivo: editar `packages/ui/src/card.tsx` | bloqueado por `check:coss` e `coss.lock.json:29-30`; só valeria como mudança no COSS, fora do nosso controle |
| (c1) `Card` do COSS com `className` de sobrescrita num componente compartilhado (o `CardWidgetShell` generalizado) | uma exceção por classe em cada uso, e o realce do COSS fica preso a `--radius-2xl` (`card.tsx:15`): trocar o raio pede também `before:rounded-[...]`, outra sobrescrita |
| (c2) `CardSurface` em `packages/parttens/src/shared` | o barrel raiz o tornaria API de `parttens` sem vocabulário de pattern, e o `shared/AGENTS.md` define a pasta como peças de coleção; `elements` já é a camada de componentes próprios abaixo dos patterns |
| (c3) Exportar só uma string ou `cva` de classes | aplicar a string à mão permite raiz sem `data-slot="card"`, e o contrato do D4 (3) quebra em silêncio |
| Sem variável: raio só por `className` | o realce `before:` não acompanha um `rounded-*` trocado, e o consumidor que edita o arquivo copiado perde a edição ou o update a cada reinstalação (`.specs/adr/0001-instalador-proprio.md`, Gravação) |
| Variáveis também para borda, opacidade da borda e sombra | contrato maior sem pedido; `--card` e `--border` já são do tema |
| Nome no namespace do Tailwind (`--radius-card` em `@theme`) | o Tailwind v4 só emite variáveis de `@theme` usadas por utilitário; não verificado se `var()` em valor arbitrário conta como uso (não verificado, ver Not verified) |
| Duas sombras, por variante (`raised` para o Kanban, `flat` para widgets) | o dono nomeou um padrão aprovado; um eixo de elevação sem um terceiro uso é variante antecipada |

## Consequences

- **Gains:**
  - um lugar para a forma do card, no lugar de sete classes espalhadas (`kanban-card.tsx:26`, `card-widget-shell.tsx:15`, `settings-section.tsx:14`, `records/group/lib/variants.ts:6`, `:35`, `checklist/lib/variants.ts:103`, `:117`);
  - o consumidor muda o raio de todos os cards com uma linha no tema, sem afetar diálogos;
  - o consumidor desenha o mesmo card nas próprias telas importando `CardSurface`;
  - duas exceções a menos em `scripts/override-exceptions.json`.
- **Costs:**
  - mudança visual: `SettingsSection` e `RecordGroup` `card` passam de `rounded-2xl` a `rounded-lg`; widgets ganham `shadow-xs/5` e o realce; `RecordGroup` `inset` ganha borda `/80`, sombra e realce; `Checklist` `card` ganha `bg-card`, sombra, realce, borda `/80` no lugar de `/60` e raio `lg` no lugar de `xl`;
  - inverte hoje a decisão de `docs/architecture/tc96-parttens.md:105` e a de 2026-10-06 em `:75`;
  - uma variável lida (`--card-radius`) vira contrato público e não pode ser renomeada sem aviso;
  - `CardSurface` repete a classe de superfície do `Card` do COSS; uma mudança do COSS (`sync:coss`) não chega a ela sozinha;
  - testes que fixam classes mudam: `widgets.test.tsx:187-201` (`shadow-none`, `before:hidden`), `checklist.test.tsx:119` (`rounded-xl`), e os de `kanban-card`, `record-group` e `settings-section`;
  - `overrides:check` ganha uma regra para `CardSurface`;
  - consumidores que já copiaram patterns mantêm as superfícies antigas até reinstalar e aceitar a sobrescrita;
  - custo de teste: quase tudo é estático ou unitário; uma prova de componente no navegador, porque cascata de variável CSS e `::before` não existem no JSDOM.
- **Verifiable invariants:**

| Invariante | Tipo | Como verificar |
| --- | --- | --- |
| Nenhum pattern importa a raiz `Card` do COSS; só as partes | static | `grep -rnE "import \{[^}]*\bCard\b[^}]*\} from '@tc96/ui/card'" packages/parttens/src` sem resultado |
| A classe da superfície só existe em `card-surface.tsx` | static | `grep -rn "not-dark:bg-clip-padding" packages/parttens/src packages/elements/src` só em `packages/elements/src/card-surface.tsx` |
| `CardSurface` tem `data-slot="card"`, repassa `className` e `render`, e o raio vem de `--card-surface-radius` resolvida de `--card-radius` com padrão `--radius-lg`, inclusive no `before:` | unit | `bun test packages/elements` |
| Cada raiz migrada (D6) renderiza `CardSurface`: `[data-slot="card"]` com a classe da superfície; `KanbanCard` mantém `data-pattern="kanban-card"` | unit | `bun test packages/parttens/src/collection-views packages/parttens/src/widgets packages/parttens/src/surfaces/settings packages/parttens/src/records/group packages/parttens/src/checklist` |
| Pattern que passa raio, borda, sombra ou cor a `CardSurface` sem exceção falha; as exceções do `CardWidgetShell` saíram | static | `bun run overrides:check`, com um caso novo em `bun test --isolate scripts` |
| `elements` só importa o permitido | static | `bun run boundaries:check` |
| `packages/ui` intocado | static | `bun run check:coss` |
| `--card-radius` num ancestral muda o raio da raiz e do `::before` (valor − 1px); sem ela, vale `--radius-lg`; axe passa nos dois temas nas stories migradas | component | `bun run storybook:test`; componente porque só o navegador resolve a cascata de variáveis e o `::before` |

## Edge sweep (`WF-RES-06`)

| Borda | Situação | Resposta |
| --- | --- | --- |
| Limite: card dentro de `CardFrame` | fora | nenhum pattern usa `CardFrame` (`data-table.test.tsx:112`); o `data-slot="card"` mantém o `CardSurface` alcançável pelas regras `*:data-[slot=card]` do `CardFrame` (`packages/ui/src/card.tsx:30-46`, `CardFrame`) para o consumidor |
| Limite: realce `before:` com raio trocado | respondida | o raio sai de uma variável usada pela raiz e pelo `before:` (D2); `rounded-*` por `className` é desaconselhado no D4 (2) porque o `cn` troca só a raiz |
| Limite: linhas arredondadas dentro do card do `Checklist` | respondida | leem `--card-surface-radius` (D6); `overflow-hidden` não serve porque a alça do variante `card` fica fora da linha (`docs/architecture/tc96-parttens.md:111`) |
| Limite: modo escuro | respondida | `not-dark:bg-clip-padding` e os dois realces vêm de `kanban-card.tsx:26` sem mudança; prova no axe dos dois temas |
| Tempo: consumidores que já copiaram patterns | respondida | o CLI preserva arquivos diferentes sem "sim" (`.specs/adr/0001-instalador-proprio.md`, Gravação); `card-surface.tsx` é arquivo novo no alias `elements`, e patterns antigos não o importam, então convivem |
| Vazio: `CardSurface` sem filhos | fora | estado vazio é do pattern (`KanbanEmptyState`, `RecordGroup` `empty`, `records/group/lib/variants.ts:29-32`) |
| Repetição: uma superfície em seis usos | respondida | invariantes estáticas de import e de classe acima impedem a sétima cópia |
| Permissão: o que o consumidor pode mudar | respondida | D4: tudo, porque o arquivo é dele; o contrato estável é `--card-radius`, `data-slot="card"` e o módulo; patterns do tc96 não sobrescrevem a superfície sem exceção (D8) |
| Falha: `overrides:check` | respondida | exceção sem uso falha (`check-overrides.ts:329`), então a remoção do D8 é obrigatória; regra nova para `CardSurface` no mesmo script |
| Falha: `check:coss`, `boundaries:check` | respondida | `packages/ui` não muda; `elements` importa só `@base-ui` e `@tc96/utils` (`check-boundaries.ts:11`, `:57`) |
| Falha: axe e contraste | lacuna | o `Checklist` `card` passa a ter texto sobre `bg-card` em vez do fundo da página; contraste a medir em claro e escuro |
| Já existe: decisão de hoje em `:105`, exceções, variantes do `RecordGroup` e do `Checklist` | respondida | Supersedes, D6, D8, D9 |
| Já existe: nome `card` dos variantes de `RecordGroup` e `Checklist` | respondida | os nomes e tipos (`records/group/core.ts:5`) não mudam; só o desenho |
| Contêineres: coluna do Kanban e moldura da `ListView` | lacuna | ver abaixo |

## Not verified

- se o Tailwind v4 do consumidor emite uma variável de `@theme` referenciada só dentro de `var()` num valor arbitrário; por isso o gancho não usa o namespace `--radius-*`;
- se `tailwind-merge` agrupa `rounded-(--card-surface-radius)` com `rounded-2xl` (trocar um pelo outro); D4 (2) evita depender disso;
- o contraste numérico do `Checklist` `card` sobre `bg-card`.

## Emenda do dono

Decidido em 2026-10-11, na aprovação deste ADR: o `CardWidgetShell` passa a se chamar `WidgetShell` (arquivo `widgets/shared/widget-shell.tsx`, props `WidgetShellProps`) e não tem a borda da superfície. O resto do ADR foi aprovado como está, inclusive as mudanças visuais da seção Consequences: widgets ganham `shadow-xs/5` e o realce, `SettingsSection` e `RecordGroup` `card` vão a `rounded-lg`, `Checklist` `card` ganha `bg-card`.

- O nome antigo sai sem apelido: os patterns são código copiado, e o consumidor que já tem `CardWidgetShell` o mantém até reinstalar.
- Sem borda, o widget se separa da página só pelo fundo `--card` e pela sombra; o contraste dessa separação é medido no planejamento.
- Tirar a borda do `CardSurface` num pattern é sobrescrita (D8): o planejamento decide entre uma exceção registrada em `scripts/override-exceptions.json` e uma opção do próprio `CardSurface`, e confere o realce `before:` sem a borda de 1px.

## Lacunas em aberto

| Pergunta | Decide | Fecha em |
| --- | --- | --- |
| A coluna do Kanban e a moldura da `ListView` passam a ler `--card-radius`, para não ficarem com raio menor que os cards dentro delas quando o consumidor aumenta o raio? | dono | planejamento |
| Contraste do `Checklist` `card` sobre `bg-card` em claro e escuro (texto 4,5:1, gráfico 3:1), com os números na doc | `qa-engineer` | planejamento |
| Oferecer `card-surface` como item do CLI sem pattern, para quem só quer o card? | dono | quando um consumidor pedir |
| Variáveis para borda e sombra do card? | dono | quando um consumidor pedir |
| Como o `WidgetShell` tira a borda do `CardSurface`: exceção registrada ou opção do `CardSurface`; e o realce `before:` sem a borda | `software-architect` | planejamento |
| Separação do widget sem borda sobre `bg-background`, claro e escuro, com os números na doc | `qa-engineer` | planejamento |
