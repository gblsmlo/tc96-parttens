# 0003. Os patterns renderizam o `Card` do COSS, e o raio do card é uma regra do tema do consumidor

- **Status:** Draft (decisão do dono na conversa de 2026-10-17, "use option a"; o texto espera a revisão dele)
- **Date:** 2026-10-17
- **Origin:** pedido do dono na conversa de 2026-10-17 ("analise como podemos eliminar a necessidade do card surface"), opção A da análise
- **Supersedes:** `.specs/adr/0002-card-surface-standard.md` (D1, D2, D4 (4) e (5), D6, D8 e D9 no que citam `CardSurface`); a invariante "a classe da superfície só existe em `card-surface.tsx`"

## Context

| Força | Fonte |
| --- | --- |
| `CardSurface` repete a classe de superfície do `Card` do COSS com o raio lido de `--card-radius`; o custo declarado no ADR 0002 é que `sync:coss` não chega a ela | `.specs/adr/0002-card-surface-standard.md` (Consequences, Costs) |
| O `Card` do COSS fixa `rounded-2xl` e o realce em `calc(var(--radius-2xl)-1px)` na própria classe | `packages/ui/src/card.tsx:15` |
| `packages/ui` é somente leitura; o tema é do consumidor | `AGENTS.md` (Rules enforced by scripts), `docs/architecture/tc96-parttens.md:203` |
| O gancho `[data-slot="card"]` no tema já era o terceiro do ADR 0002 | `.specs/adr/0002-card-surface-standard.md` (D4 (3)) |
| `--card-surface-radius` só era lida pelas linhas do `Checklist` | `packages/parttens/src/checklist/lib/variants.ts` |
| O CLI copia para o consumidor o arquivo de `elements` que o pattern importa | `packages/registry/src/manifest.test.ts` (item `settings`) |

## Decision

Os patterns importam `Card` de `@tc96/ui/card` e não há mais `packages/elements/src/card-surface.tsx`. O raio e o realce passam a ser uma regra do tema do consumidor, no `styles.css` do exemplo.

**Axis that decided it:** boundary

| Aspecto | Desenho |
| --- | --- |
| D1. Raiz | `KanbanCard`, `WidgetShell`, `SettingsSection`, `RecordGroup` (`card` e `inset`), `Checklist` `card` e `GalleryItemSkeleton` renderizam `Card`. Os `className` que cada um já passava ficam (`min-w-0 border-transparent`, `bg-muted/72 p-3 shadow-none before:hidden`, os estados do Kanban) |
| D2. Raio | O tema declara `[data-slot="card"] { --card-surface-radius: var(--card-radius, var(--radius-lg)); border-radius: var(--card-surface-radius) }` e `[data-slot="card"]::before { border-radius: calc(var(--card-surface-radius) - 1px) }`, dentro de `@layer utilities`: mesma camada do `rounded-2xl` do `Card`, declarada depois, então vence; seletores mais específicos (as regras do `CardFrame`) continuam vencendo a regra |
| D3. Sem a regra | O card é o do COSS, `rounded-2xl`. As linhas do `Checklist` leem `--card-surface-radius` com `--radius-2xl` de reserva, e os cantos acompanham o card nos dois casos |
| D4. Ganchos do consumidor | `--card-radius` no tema ou num ancestral; `[--card-radius:x]` em uma instância; editar a regra do tema. Sai o gancho de importar `CardSurface` |
| D5. Borda | O `Card` usa `border` com `--border` cheio, no lugar de `border-border/80`. O `hover:border-border` do `KanbanCard` perdeu o efeito e saiu com a exceção dele |
| D6. Exceções | As entradas do `KanbanCard` e do `RecordGroup` passam de `CardSurface` a `Card`; uma a menos no `KanbanCard` (14). `overrides:check` não precisa de regra própria: `styledElements` fica vazio |

## Alternatives

| Alternative | Why it was discarded |
| --- | --- |
| B. `Card` com `className` de sobrescrita em cada pattern | uma exceção por classe em cada uso, e o realce do COSS fica preso a `--radius-2xl` |
| C. Copiar as classes do `CardSurface` em cada pattern | seis cópias de uma classe longa, a razão pela qual o ADR 0002 criou o `CardSurface` |
| D. Mudar `packages/ui/src/card.tsx` para ler `--card-radius` | `check:coss` bloqueia; só valeria no COSS |
| Manter o `CardSurface` | o consumidor já o recebe pelo CLI; ficou como a opção que não muda nada |

## Consequences

- **Gains:**
  - um arquivo a menos em `elements` e nenhum componente que repita a classe do `Card`;
  - `sync:coss` chega aos cards dos patterns;
  - o item `settings` e o `record-group` passam a depender do `@coss/card` em vez do arquivo de `elements`.
- **Costs:**
  - o consumidor que quer o raio `lg` precisa da regra no tema; sem ela os cards voltam a `rounded-2xl`;
  - mudança visual: borda de `/80` para cheia (`--border` é 8% de preto no claro e 6% de branco no escuro);
  - consumidores que já copiaram `card-surface.tsx` ficam com um arquivo sem uso;
  - o `Card` do COSS é `div`, e `KanbanCard`, `WidgetShell` e o skeleton continuam usando `render` para `article` e `section`.
- **Verifiable invariants:**

| Invariante | Tipo | Como verificar |
| --- | --- | --- |
| Nenhum pattern importa `@tc96/elements/card-surface` | static | `grep -rn "card-surface" packages/parttens/src apps/storybook/src` só em `--card-surface-radius` |
| O item `settings` e o `record-group` não levam `card-surface.tsx` e levam `@coss/card` | unit | `bun test --isolate packages/registry/src` |
| A regra do tema vence `rounded-2xl`: `--card-radius` ausente dá o raio de `--radius-lg` na raiz e menos 1px no `::before` | component | no Storybook, `getComputedStyle` da raiz do card do `Checklist` deu 10px, o `::before` 9px e a primeira linha 9px |
| Os patterns e o Storybook passam nos dois temas | component | `bun run storybook:test` |

## Not verified

- o contraste do `Checklist` `card` com a borda cheia, que não foi remedido;
- um consumidor real que não declare a regra: as linhas do `Checklist` caem em `--radius-2xl`, o que casa com o `Card` do COSS por leitura do código, sem captura.
