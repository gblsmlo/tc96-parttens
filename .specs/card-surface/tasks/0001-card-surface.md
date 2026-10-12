---
capability: card-surface
plan: 0001
owner: project-manager
status: Ready
issue: none
branch: feat/card-surface, criada a partir de main em 2026-10-11 com o sim do dono
appetite: médio, um PR; seis unidades. Teto: sem variantes, sem props novas e sem variáveis além de --card-radius no CardSurface. Se uma unidade pedir isso, o plano volta à tabela de decisão (WF-PLAN-02)
inputs: ADR 0002 Approved em 2026-10-11, com a emenda do dono; plano Ready pelo dono em 2026-10-11; lacuna de contraste ainda aberta (bloqueia T3 e T5)
---

### Inputs

| File | Status |
| --- | --- |
| `../requirements.md` | não necessário: sem mudança de comportamento de produto; a mudança é visual e de camada, decidida no ADR |
| `../design.md` | não necessário: o desenho (D1–D9) está no ADR |
| `../user-experience.md` | não necessário: estados, foco e teclado não mudam; a acessibilidade entra como critério de contraste e axe |
| `../../adr/0002-card-surface-standard.md` | Approved (2026-10-11), com a seção "Emenda do dono" |

O plano referencia o ADR e não o copia (`WF-SPEC-02`): as unidades citam D1–D9 e as invariantes da seção Consequences pelo número.

### Portões (resumo)

| Portão | Resultado |
| --- | --- |
| Produto | N/A: o pedido é padronizar superfície, não mudar o que o produto faz |
| Escopo de arquitetura | passa: o ADR decide camada (`packages/elements`), forma, gancho e quem migra (D1–D8) |
| Decomposição | passa: cada unidade tem aceite, evidência e dependência próprias; T1 é a base, T2 a T5 migram um pattern ou família cada uma, T6 fecha docs |
| Fronteira | passa: `elements` importa só `@base-ui` e `@tc96/utils`; `packages/ui` não muda; `parttens` → `elements` já é a direção permitida |
| Apetite | definido acima, antes de qualquer estimativa; as estimativas vêm de quem executa (`frontend-developer`), não do plano |
| Aceite | passa em todas; T3 e T5 com os critérios de contraste do `qa-engineer` (2026-10-12) |

### Decisões fechadas no planejamento

1. **Borda do `WidgetShell`** (decidido por `software-architect`). `WidgetShell = <CardSurface render={render} className={cn('min-w-0 border-transparent', className)} {...props} />` em `widgets/shared/widget-shell.tsx`.
   - Não precisa de exceção registrada: `scripts/check-overrides.ts:27-28` trata `border-transparent` como neutro, e uma entrada nova falharia em `:329` por falta de uso.
   - `border-transparent`, não `border-0`: mantém a largura de 1px, então o raio da área de preenchimento continua R−1px e casa com `before:rounded-[calc(var(--card-surface-radius)-1px)]`. `border-0` deslocaria os cantos do realce em 1px e o conteúdo em 1px.
   - `not-dark:bg-clip-padding` fica; `shadow-xs/5` fica.
   - Depende de o `CardSurface` aplicar `className` depois das próprias classes via `cn`: o `tailwind-merge` resolve `border-border/80` contra `border-transparent` e a última vence. Invariante: teste unitário em `bun test packages/parttens/src/widgets` (ver T3).
2. **Rename sem apelido:** `CardWidgetShell`/`CardWidgetShellProps` → `WidgetShell`/`WidgetShellProps`, arquivo `widget-shell.tsx`. O baseline muda nos dois barrels (`docs/architecture/public-api-exports.json:410-411`, `:635-636`), regenerado com `bun scripts/verify-public-api.ts --record`. Todo widget que importa o shell é atualizado (28 arquivos de widgets e stories, mais docs e `AGENTS.md`; a lista exata sai de `grep -rn CardWidgetShell`).

3. **Coluna do Kanban e moldura da `ListView` não leem `--card-radius`** (dono, 2026-10-11). Continuam com o raio fixo de hoje (`kanban-column.tsx:289`, `list-view.tsx:113`), fora do `CardSurface` (D7). A candidata T7 sai do plano.
4. **`RecordGroup` envolve o `CardSurface`, não vira ele** (decidido por `software-architect` em 2026-10-12, esclarece D6 sem emendar o ADR). A `section` mantém `data-slot="record-group"` (contrato de `records/group/AGENTS.md:73`, usado em `record-group.stories.tsx:366` e `:522`), e o `CardSurface` mantém `data-slot="card"` (D4 (3) e as regras `in-[[data-slot=card]...]` de `packages/ui/src/card.tsx:87`). No `card`, o `CardSurface` é o único filho da `section` e envolve cabeçalho e painel; no `inset`, envolve só `record-group-content`, com cabeçalho e rodapé fora. Custo: um `div` a mais; o `className` do `RecordGroup` no `card` passa a estilizar a `section`, não o card visível, e o raio por instância vai por `[--card-radius:...]`, que o card herda da `section`.
5. **Exceções de anel e borda no `KanbanCard` ficam** (decidido por `software-architect` em 2026-10-12, sem emendar D8). O `overrides:check` classifica por categoria para todo componente com estilo (`scripts/check-overrides.ts:37-40`): `ring-*` conta como borda, `border-dashed` como estilo de borda, com ou sem prefixo de estado, como já acontece nos itens do COSS. As 15 entradas do `CardSurface` em `kanban-card.tsx` ficam, cada uma com o motivo do próprio estado (seleção, foco, `dimmed`); o check não muda.
6. **`Checklist` envolve o `ol` com o `CardSurface`, como o `RecordGroup`** (decidido por `software-architect` em 2026-10-12, esclarece D6). Estrutura do `card`: `CardSurface` (`div`, `data-slot="card"`) > `ol[data-slot="checklist-items"]`; o slot `checklist-items` é contrato público (`checklist/AGENTS.md:68` em HEAD, `checklist.stories.tsx:122`, `checklist.test.tsx:270`). As linhas leem `--card-surface-radius` herdada (`div > ol > li`), a alça em `-left-8` não é cortada (o `CardSurface` não tem `overflow-hidden`). Aceite de T5: no `card`, o `ol` mantém `data-slot="checklist-items"` sem `rounded-*`, `border` nem `bg-card`, e o pai dele é o único `[data-slot="card"]` dentro de `section[data-slot="checklist"]`; no `plain`, nenhum `[data-slot="card"]`.
7. **Sem story `CardRadius` no `KanbanCard`** (dono, 2026-10-12). As stories do `KanbanCard` mostram só a API do componente; a story de demonstração do raio saiu. A prova no navegador de que `--card-radius` num ancestral muda o raio do `CardSurface` e do `::before` fica na story `CardRadius` do `Checklist` (T5), que mede o card e os cantos das linhas.

### Lacunas em aberto

As duas lacunas de contraste foram fechadas pelo `qa-engineer` em 2026-10-12 (critérios em T3 e T5). Os valores de `stone` do Tailwind v4 vieram da memória do agente e batem com as razões já registradas na doc dentro de cerca de 0,03; o axe nos dois temas é a prova no navegador.


| Pergunta | decide | fecha-em | Quem espera |
| --- | --- | --- | --- |
| Item de CLI `card-surface` sem pattern; variáveis para borda e sombra | dono | quando um consumidor pedir | nenhuma; fora deste incremento |

### Order

- T1 primeiro: todas as outras dependem de `CardSurface` e da regra de `overrides:check`.
- T2, T3, T4 e T5 não dependem entre si e podem ir em paralelo depois de T1. T3 e T5 só passam pelo portão de aceite com os critérios de contraste preenchidos.
- T6 depois de T2–T5: é a verificação final das invariantes estáticas e o gate completo.

### Tasks

- [ ] **T1 · Criar `CardSurface`, o export e a regra de `overrides:check` [ENGINEERING]**
  - **Owner:** `tc96-frontend:frontend-developer`
  - **Depends on:** none
  - **Inputs:** ADR 0002 D1, D2, D3, D4, D5, D8
  - **Scope:**
    - `packages/elements/src/card-surface.tsx`: `CardSurface` e `CardSurfaceProps` por `useRender`, `div` padrão, `render` aberto, `data-slot="card"`, classes de `kanban-card.tsx:26` com o raio vindo de `[--card-surface-radius:var(--card-radius,var(--radius-lg))]`. `className` entra depois das classes próprias via `cn`.
    - Export de pacote: confere se `"./*": "./src/*.tsx"` em `packages/elements/package.json` já cobre; só edita se não cobrir.
    - `scripts/check-overrides.ts`: `CardSurface` passa a contar como componente com estilo (como um item COSS); raio, borda, sombra ou cor passados por um pattern em `className` exigem exceção registrada. `border-transparent` continua neutro.
    - Teste do componente em `packages/elements/src/card-surface.test.tsx` (com o `test/dom.ts` ou equivalente que `elements` já use; se não houver, o setup JSDOM mínimo).
    - Caso novo em `scripts/` para `bun test --isolate scripts`.
  - **Acceptance:**
    - `CardSurface` renderiza `data-slot="card"` e repassa `className` e `render` (por exemplo `render={<section />}` gera um `section`).
    - O raio vem de `--card-surface-radius`, resolvida de `--card-radius` com padrão `--radius-lg`, na raiz e no `before:`.
    - A classe `not-dark:bg-clip-padding` e as classes de sombra/realce existem só em `card-surface.tsx` (borda: modo escuro vem sem mudança de `kanban-card.tsx:26`).
    - Borda: `className` com `border-transparent` não exige exceção; `className` com `rounded-*`, `border-border`, `shadow-*` ou cor de fundo sem exceção registrada faz `overrides:check` falhar (caso novo em `scripts`).
    - Borda do ADR (card sem filhos): `CardSurface` não renderiza nada além do que recebe; estado vazio é do pattern.
    - `bun run check:coss` e `bun run boundaries:check` passam: `elements` importa só `@base-ui` e `@tc96/utils`.
  - **Evidence:** `bun test packages/elements` e `bun test --isolate scripts` verdes com os casos novos; `bun run boundaries:check && bun run check:coss && bun run overrides:check` passam; `bunx biome check` nos arquivos tocados; `bun run typecheck`.
  - **Test types:** static (boundaries, check:coss, grep da classe), unit (`bun test packages/elements`, `bun test --isolate scripts`). Sem componente aqui: a cascata de `--card-radius` só se prova no navegador, e isso fica em T2 (primeira story migrada).
  - **O que pode dar errado:** `cn` não resolver o conflito entre `rounded-(--card-surface-radius)` e um `rounded-*` do consumidor (não verificado no ADR; D4 (2) manda usar `[--card-radius:...]`, então o teste cobre esse caminho e não o `rounded-*`); `elements` ainda não ter ambiente de teste e o setup exigir arquivo novo.
  - **Out of this Task:** migrar qualquer pattern; docs; variantes, densidade ou hover.
  - **Ships alone safely because:** nenhum pattern importa `CardSurface` ainda; a regra nova só falha para quem o usar com sobrescrita.

- [ ] **T2 · Migrar `KanbanCard` para `CardSurface` [ENGINEERING]**
  - **Owner:** `tc96-frontend:frontend-developer`
  - **Depends on:** T1
  - **Inputs:** ADR 0002 D2, D6 (KanbanCard); `packages/parttens/src/collection-views/AGENTS.md:74`
  - **Scope:** a raiz de `kanban-card.tsx` vira `CardSurface` com `render` repassado e mantém `data-pattern="kanban-card"`, `data-variant`, `data-density`, `data-state`. Saem de `kanban-card.tsx:26` as classes de superfície; ficam densidade, `--card-padding`, `hover:`, `dimmed` (com `shadow-none` como estado próprio) e `selected`. Atualiza os testes do `kanban-card` que fixam classes.
  - **Acceptance:**
    - A raiz é `[data-slot="card"]` com `data-pattern="kanban-card"` e os três `data-*` de estado.
    - `dimmed` continua sem sombra e `selected` continua marcado.
    - O `render` do consumidor ainda substitui o elemento raiz.
    - Os testes dos views do Kanban que já passavam continuam passando; só mudam as asserções de classe que mudaram de dono.
    - Cascata no navegador: `--card-radius` definida num ancestral muda o raio da raiz e do `::before` (valor − 1px); sem ela, vale `--radius-lg`; axe passa em claro e escuro nas stories do Kanban.
  - **Evidence:** `bun test packages/parttens/src/collection-views`; `bun run storybook:test` focado nas stories do Kanban (a prova da cascata fica numa story ou teste de componente com ancestral que define `--card-radius`); capturas de tela claro e escuro das stories do Kanban (AGENTS.md, Visual work).
  - **Test types:** unit (`bun test` do pattern) e component (`storybook:test`, vitest browser + axe). Só o teste de componente pega a resolução da variável CSS e o `::before`, porque o JSDOM não resolve a cascata de custom properties nem pseudo-elementos.
  - **O que pode dar errado:** o `in-[[data-slot=card]:has(>[data-slot=card-panel])]` das partes deixar de casar se a raiz perder `data-slot="card"`; o `selected`/`hover:` perder precedência contra as classes do `CardSurface` por ordem de merge; regressão visual de 1px no realce.
  - **Out of this Task:** coluna do Kanban (fica com o raio fixo, decisão 3); os outros patterns.
  - **Ships alone safely because:** o resultado visual do `KanbanCard` é o mesmo de hoje (a forma aprovada foi extraída dele), e a variável opcional tem padrão igual ao raio atual.

- [ ] **T3 · Renomear para `WidgetShell` sobre `CardSurface` sem borda visível [ENGINEERING]**
  - **Owner:** `tc96-frontend:frontend-developer`
  - **Depends on:** T1, lacuna de contraste (2)
  - **Inputs:** ADR 0002 D3, D5, D6, D8, emenda do dono; decisões 1 e 2 acima
  - **Scope:**
    - `widgets/shared/card-widget-shell.tsx` → `widget-shell.tsx`, `WidgetShell` e `WidgetShellProps` por `CardSurface render={render}` com `min-w-0 border-transparent`; sem alias.
    - `widgets/shared/index.ts` e todos os widgets, stories e fixtures que importam o shell (a saída de `grep -rn CardWidgetShell`, hoje 32 arquivos incluindo docs).
    - Remover as duas exceções do shell em `scripts/override-exceptions.json:9-19`.
    - `bun scripts/verify-public-api.ts --record`: o diff deve ter só o rename nos dois barrels (`:410-411`, `:635-636`); se vier export alheio pendente, citar no resumo.
    - Atualizar `widgets.test.tsx:187-201` (hoje fixa `shadow-none` e `before:hidden`).
  - **Acceptance:**
    - `section[data-slot="card"]` do shell tem `border` e `border-transparent`; não tem `border-border/80` nem `border-0`; mantém `shadow-xs/5` e `not-dark:bg-clip-padding`.
    - `grep -rn CardWidgetShell packages apps docs AGENTS.md` não devolve nada fora de `.specs/`.
    - `bun run overrides:check` passa sem entrada do `WidgetShell` e sem as duas exceções antigas.
    - O baseline da API pública troca os dois nomes nos dois barrels e não muda mais nada por este incremento.
    - Separação do widget sobre `bg-background`, claro e escuro: sem limiar (critério 2 abaixo).
    - O realce `before:` sem borda visível fica alinhado: o canto do realce coincide com a área de preenchimento (borda de 1px transparente preservada); conferido em captura clara e escura.
  - **Contraste (lacuna 2, fechada por `qa-engineer` em 2026-10-12):**

    | Critério | Aceite | Tipo de teste |
    | --- | --- | --- |
    | Separação de widget sem borda sobre `bg-background` (claro e escuro) | nenhuma classe de borda visível no shell; `bg-card` e `shadow-xs/5` presentes; texto em `foreground` 15,20:1 (claro) e 15,27:1 (escuro) e `muted-foreground` 5,69:1 e 5,10:1 sobre o card; a separação card/fundo (1,04:1 claro, 1,05:1 escuro) fica registrada na doc como nota de token do consumidor, sem limiar: a borda do card não é objeto gráfico nem identifica componente (WCAG 1.4.11 não se aplica; precedente: borda decorativa de 1,17–1,19:1 em `docs/architecture/tc96-parttens.md:99`). A borda antiga `border-border/80` media só 1,15:1 (1,14:1 no escuro) | unit (classes do shell) e static (`overrides:check`); component (axe nos dois temas, para o texto); manual (captura clara e escura de um widget, porque a regra de contraste do axe não cobre bordas) |

  - **Evidence:** `bun test packages/parttens/src/widgets`; `bun run overrides:check`; `bun run verify:public-api` após `--record`; `bun run storybook:test` nas stories de widgets e `stats`; capturas claro e escuro.
  - **Test types:** static (`overrides:check`, grep do nome antigo, baseline), unit (`widgets.test.tsx`, classes do shell). Componente: a mesma prova de T2 já cobre a cascata; aqui só o axe e a captura (a separação sem borda é perceptiva e entra como manual até `qa-engineer` fixar o número).
  - **O que pode dar errado:** `cn` não resolver `border-border/80` contra `border-transparent` (o teste unitário do shell pega); widget dentro de contêiner com `bg-card` perder a separação (a sombra e o contraste do placeholder acima); rename esquecido numa story ou fixture quebra o typecheck do Storybook (`storybook:typecheck`); consumidor com `CardWidgetShell` copiado fica com o antigo até reinstalar (aceito na emenda).
  - **Out of this Task:** mexer no contraste do tema (nota para o consumidor, não correção em `packages/ui`); docs de D9 (T6).
  - **Ships alone safely because:** depende só de T1; widgets mudam de superfície, mas mantêm API e props, e o rename é a única quebra de nome, já aprovada.

- [ ] **T4 · Migrar `SettingsSection` e `RecordGroup` (`card` e `inset`) [ENGINEERING]**
  - **Owner:** `tc96-frontend:frontend-developer`
  - **Depends on:** T1
  - **Inputs:** ADR 0002 D6, D9 (parte de código), edge sweep (nome `card` dos variantes não muda); `surfaces/settings/AGENTS.md`, `records/group/AGENTS.md`
  - **Scope:**
    - `surfaces/settings/composition/settings-section/settings-section.tsx:14`: de `Card` do COSS para `CardSurface`; o invólucro `settings-section-rows`, `px-6`, linha de status e foco do `SettingsCollapsed` ficam.
    - `records/group/lib/variants.ts:6` (`card`) e `:35` (`inset`): a moldura sai das classes; o `CardSurface` entra como filho da `section` (decisão 4).
    - Nomes e tipos (`records/group/core.ts:5`) não mudam; só o desenho.
    - Atualiza os testes de `settings-section` e `record-group` que fixam `rounded-2xl`, `rounded-lg border bg-card` ou a borda antiga.
  - **Acceptance:**
    - `SettingsSection` renderiza `[data-slot="card"]` com a classe da superfície; `rounded-2xl` não aparece.
    - `RecordGroup` `card`: a `section` tem `data-slot="record-group"` e `data-variant="card"`, e o único filho elemento dela é um `[data-slot="card"]` com cabeçalho e painel. `inset`: exatamente um `[data-slot="card"]`, cujo único filho é `[data-slot="record-group-content"]`, com cabeçalho e rodapé fora. `plain`: nenhum `[data-slot="card"]`. `records/group/lib/variants.ts` não tem `rounded-*`, `border` nem `bg-card` (decisão 4).
    - Nenhum arquivo dos dois patterns importa a raiz `Card` de `@tc96/ui/card` (só partes).
    - `RecordGroup` `empty` continua sendo do pattern (`records/group/lib/variants.ts:29-32`); a superfície não decide estado vazio.
    - Foco e `data-*` existentes do `SettingsCollapsed` e do `RecordGroup` não mudam.
    - `RecordGroup` `inset` ganha borda `/80`, sombra e realce (mudança visual aprovada no ADR).
    - axe passa em claro e escuro nas stories de `Settings` e `Records/Group`.
  - **Evidence:** `bun test packages/parttens/src/surfaces/settings packages/parttens/src/records/group`; `bun run storybook:test` focado nas stories; capturas claro e escuro de ambas; a invariante estática do ADR: `grep -rnE "import \{[^}]*\bCard\b[^}]*\} from '@tc96/ui/card'" packages/parttens/src` sem resultado nesses dois patterns.
  - **Test types:** static (grep de import), unit (os dois `bun test`), component (axe e captura; sem prova nova de cascata, ela está em T2).
  - **O que pode dar errado:** o `inset` perder o `overflow` ou o divisor das linhas ao trocar o invólucro; o `px-6` do `SettingsSection` brigar com o `CardSurface`; o teste de `record-group` fixar a classe antiga e passar por engano se for só retirado.
  - **Out of this Task:** `Checklist` (T5); docs (T6).
  - **Ships alone safely because:** só depende de T1; os nomes e tipos públicos não mudam, e o custo visual (`rounded-2xl` → `rounded-lg`) já está aprovado.

- [ ] **T5 · Migrar o `Checklist` `card` e as linhas para `--card-surface-radius` [ENGINEERING]**
  - **Owner:** `tc96-frontend:frontend-developer`
  - **Depends on:** T1, lacuna de contraste (1)
  - **Inputs:** ADR 0002 D6 (Checklist), edge sweep (linhas arredondadas, `overflow-hidden` não serve); `checklist/AGENTS.md`
  - **Scope:** `checklist/lib/variants.ts:103` (o `ol` do variante `card` vira `CardSurface`, sem moldura própria `rounded-xl border-border/60`) e `:117` (linhas passam a `first:rounded-t-[calc(var(--card-surface-radius)-1px)]` e `last:rounded-b-[...]`). Atualiza `checklist.test.tsx:119` (fixa `rounded-xl`).
  - **Acceptance:**
    - O `ol` do variante `card` é `[data-slot="card"]`; a moldura `rounded-xl border-border/60` e `rounded-xl` saíram; o fundo agora é `bg-card`.
    - A primeira e a última linha leem `--card-surface-radius` (valor − 1px) e não usam `overflow-hidden`; a alça de arrastar do variante `card` continua fora da linha e visível.
    - Os outros variantes do `Checklist` não mudam.
    - Contraste do texto sobre `bg-card`, claro e escuro: critério 1 abaixo.
    - axe passa em claro e escuro nas stories do `Checklist`.
  - **Contraste (lacuna 1, fechada por `qa-engineer` em 2026-10-12):**

    | Critério | Aceite | Tipo de teste |
    | --- | --- | --- |
    | Texto do `Checklist` `card` sobre `bg-card` (claro e escuro) | `foreground` e `muted-foreground` ≥ 4,5:1 sobre o card nos dois temas, inclusive no hover `bg-muted/60` da linha (o par mais apertado, `muted-foreground` escuro, fica em cerca de 4,55:1, `docs/architecture/tc96-parttens.md:85`). Medido: 15,20:1 e 5,69:1 no claro, 15,27:1 e 5,10:1 no escuro (hoje, sobre a página: 14,56:1 e 5,45:1 no claro, 16,04:1 e 5,35:1 no escuro). Nenhum `bg-*` no item esconde o card | component (axe `color-contrast` nos projetos `storybook` e `storybook-dark`), com as razões registradas na doc em T6 |

  - **Evidence:** `bun test packages/parttens/src/checklist`; `bun run storybook:test` focado no `Checklist`; capturas claro e escuro, com `--card-radius` maior num ancestral para ver os cantos das linhas acompanharem.
  - **Test types:** unit (classes das linhas e do `ol`), component (cantos das linhas só se resolvem no navegador, porque `--card-surface-radius` é uma variável herdada do pai e o JSDOM não calcula `calc()` com ela), manual (captura).
  - **O que pode dar errado:** o canto da linha vazar para fora do raio do card quando `--card-radius` muda; a alça de arrastar cortada se alguém adicionar `overflow-hidden`; o contraste do texto de linhas desabilitadas ou riscadas sobre `bg-card` cair abaixo de 4,5:1 (é o que a lacuna mede).
  - **Out of this Task:** mudar propriedades de `fields/properties` ou `editable`; docs (T6).
  - **Ships alone safely because:** só o variante `card` muda, e os nomes e tipos não mudam. Ela só entra depois do número do `qa-engineer`.

- [ ] **T6 · Documentação (D9), `AGENTS.md` dos patterns e gate completo [ENGINEERING]**
  - **Owner:** `tc96-frontend:frontend-developer`
  - **Depends on:** T2, T3, T4, T5
  - **Inputs:** ADR 0002 D9, seção Consequences (invariantes)
  - **Scope:**
    - `docs/architecture/tc96-parttens.md`: `:75`, `:85`, `:105`, `:111`, `:203` (a superfície padrão é o `CardSurface`), `:231` (`elements` também guarda a superfície de card), e os dois lugares do nome antigo do shell; em português, datado de 2026-10-11, com os números de contraste que o `qa-engineer` entregar e a escala registrada.
    - `AGENTS.md`, seção Code conventions: decisões de raio, borda e sombra de card ficam no `CardSurface`; a linha "Widgets render through `CardWidgetShell`" vira `WidgetShell`.
    - `packages/parttens/src/widgets/AGENTS.md:31`, `:71`; `surfaces/settings/AGENTS.md:47`; `collection-views/AGENTS.md:74`; e o `AGENTS.md` de `checklist` e `records/group` se citarem a moldura antiga.
    - `records/group/AGENTS.md:73-74`: o `[data-slot="card"]` (`CardSurface`) é o único filho da `section` no `card` e envolve `record-group-content` no `inset`; o `className` estiliza a `section`, não o card visível, e o raio vai por `[--card-radius:...]` (decisão 4). `docs/architecture/tc96-parttens.md:75` e `:85`: no lugar das classes desenhadas à mão, "`CardSurface` dentro da `section` (`card`) ou em volta do conteúdo (`inset`)".
    - Gate: `bun run check`.
  - **Acceptance:**
    - Os textos citados deixam de afirmar a decisão antiga (`rounded-2xl` no `card`, `rounded-lg border bg-card` no `inset`, "o shell é o único lugar de raio, borda e sombra").
    - Invariantes estáticas do ADR passam: nenhum pattern importa a raiz `Card` de `@tc96/ui/card`; `not-dark:bg-clip-padding` só existe em `packages/elements/src/card-surface.tsx`.
    - Cada `AGENTS.md` tocado segue a ordem de seções e não copia lista de arquivos, props ou tipos.
    - `bun run check` termina em verde, ou cada falha é mostrada como existente em `main` sem estas mudanças (precedente: `records/dialog` › `ignores a second submit while pending`, registrado em `editable-display`).
  - **Evidence:** `grep -rn "not-dark:bg-clip-padding" packages/parttens/src packages/elements/src` só em `card-surface.tsx`; `grep -rnE "import \{[^}]*\bCard\b[^}]*\} from '@tc96/ui/card'" packages/parttens/src` vazio; `bun run check`.
  - **Test types:** static (grep, checks de boundaries, COSS, overrides, baseline de API), unit e component pela suíte completa. Sem teste novo aqui.
  - **O que pode dar errado:** doc em português citando número de linha que já se moveu; o gate completo falhar por teste que já falha em `main`.
  - **Out of this Task:** código de pattern.
  - **Ships alone safely because:** só texto e verificação.

### Notas de mudança de testes

Testes que fixam as classes antigas e mudam (ADR, Consequences): `widgets.test.tsx:187-201` (T3), `checklist.test.tsx:119` (T5), e os de `kanban-card` (T2), `record-group` e `settings-section` (T4). Cada um é atualizado na unidade dona, e a mudança de asserção é ligada à classe que passou a ser do `CardSurface`; não se apaga a asserção sem substituir pela invariante equivalente.

### Branch e git

Este incremento pede branch própria a partir de `main`. O trabalho aberto hoje (`feat/editable-display-field`) é de outra capacidade e não deve receber estes commits. A branch `feat/card-surface` foi criada a partir de `main` em 2026-10-11, com o sim do dono, e o ADR 0002 e este plano vieram junto, ainda sem commit. Commit, push e PR esperam o dono (AGENTS.md, Git).

### Done when

- T1, T2, T4 e T6 têm aceite escrito e evidência; T3 e T5 ficaram `Ready` com os critérios de contraste preenchidos em 2026-10-12 (`WF-CORE-09`).
- O dono moveu o plano de `Draft` para `Ready` em 2026-10-11.
- A soma das unidades cabe no apetite; se uma estourar, o plano volta à tabela de decisão.
