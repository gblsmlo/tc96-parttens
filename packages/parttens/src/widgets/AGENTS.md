# Widgets pattern

Dashboard cards that show prepared numbers, lists, charts and progress, grouped by domain (`crm`, `finance`, `gamification`, `productivity`) and all mounted on one frame, `CardWidgetShell`, with the same building blocks (`WidgetHeader`, `Amount`, `TrendIndicator`, `WidgetPeriodToggle`, `StatList`, `AvatarStack`, `ExpandableList`, `ProgressRing`, `MetricPill`, `IconFrame`). The consumer passes values already computed and labelled, and receives period changes, expansion, subtask toggles, day selection and link copies through callbacks; which tone a score deserves, which period is active and what the labels say are props. The pattern never fetches, stores derived values or ships CSS; its only state is the uncontrolled expansion of lists, the uncontrolled selected day of `AgendaWidget` and the ticking clock of `WorldClockWidget`.

## Map

| Folder | Holds |
| --- | --- |
| `shared/` | the frame and every piece more than one domain uses; `shared/index.ts` also re-exports `IconFrame` and `formatAmount`, so a copied pattern gets both from the widgets barrel |
| `crm/`, `finance/`, `gamification/`, `productivity/` | one domain each, with its own `index.ts` barrel and one `<domain>.test.tsx` |
| `types/` | `TrendDirection`, `WidgetPeriodOption`, `WidgetTone`, shared by `shared/` and the domains |
| `widgets.test.tsx` | the tests of the shared pieces and the shell |

Import direction: `<domain>/` → `shared/`, `types/`, and files of the same domain only (`ShareBar` from `finance/market-share-widget.tsx`, `ActivityTimeline`, `XpMeter`); `shared/` → `types/`, never a domain; no domain imports another. Recharts is used only by the three chart widgets.

The pattern has no `test/dom.ts`: every test file imports `properties/test/dom.ts`, so moving that file breaks these tests. The folder is not split into `composition/` and `components/`; grouping by domain is the layout.

Six files still carry Portuguese JSDoc from before the no-comments rule (`shared/amount.tsx`, `shared/trend-indicator.tsx`, `finance/asset-list.tsx`, `finance/market-share-widget.tsx`, `finance/risk-score-widget.tsx`, `types/index.ts`); remove it when you next touch them.

## Dependents

- `packages/parttens/src/index.ts` re-exports `widgets/index`; the stories import from `@tc96/parttens`, not by path.
- `packages/registry/src/manifest.ts` and `scripts/test-patterns.ts` list `widgets`; `packages/registry/src/manifest.test.ts` asserts the path `parttens/src/widgets/index.ts`. Renaming the folder or the barrel breaks both.
- `scripts/override-exceptions.json` names `shared/card-widget-shell.tsx` by path; moving it fails `bun run overrides:check`.

## Invariants

Frame and regions:

- Every card widget renders `CardWidgetShell` with `aria-labelledby` pointing at a `useId()` title, so it is a `region` named by its title; tests query `getByRole('region', { name })`. Exceptions: `AssetStatWidget` is named by `name` plus `symbol`, `ContactWidget` by `person.label`, `WorldClockWidget` by `aria-label={label}`. `ProgressHud` (a `section` with a required `aria-label`) and `ProgressFooter` (a plain `div`) do not use the shell.
- `widgets.test.tsx` asserts the shell keeps `border-border/80`, `shadow-none`, `before:hidden` and the consumer's `className`, and drops the Card's `shadow-xs`.
- `tone="inverted"` on `MetricWidget`, `AssetStatWidget` and `TaskProgressWidget` wraps the card in `<div className="dark contents">` and sets `data-tone` on the shell; the dark palette comes from the consumer's theme, not from the pattern.

Numbers:

- Every number goes through `@tc96/helpers/format`. Percentages follow Intl semantics (`0.0934` is `9.34%`); with no `format` the tests render currency (`$48,250.75`). `Amount` dims the fraction only with `dimFraction`.
- `TrendIndicator` derives the direction from the sign, renders `Math.abs(value)` and prefixes an `sr-only` label (`Alta de`, `Queda de`, `Sem variação`).
- Derived values are computed in render, never stored. Bars and meters clamp: `PipelineWidget` sums `max(0, value)` and scales to the largest stage; `BudgetWidget` clamps at the limit and marks overspend; `XpMeter` clamps to `[0, max(target, 1)]` (test: `300/250` reads `250`, `Faltam 0 XP`).
- Shares are announced in `sr-only` text (`label: NN.NN%` in `ShareBar`, a bare percentage in `PipelineWidget` and `BudgetWidget`), with `locale` or `format.locale` passed on.

Periods and expansion:

- `WidgetPeriodToggle` holds a one-item `value` array and emits only when a period is selected; clicking the active item emits nothing (tested). The six widgets with `periods` are controlled through `period` and `onPeriodChange` and put the toggle in the header: `PipelineWidget` and `BudgetWidget` drop `action` when `periods` has items, `TaskProgressWidget` moves the trend into the panel and shows it in the header only when there are no periods.
- `ExpandableList` is the single collapse mechanism, and widgets forward `expand` to it. `AchievementsWidget` spreads `visibleCount={6}` before `expand`, so the consumer can still override it. `TransactionsWidget` keeps its own copy of the same logic with the expand props flattened and sets `data-expanded` on the shell; both copies are tested.
- `ContactWidget` hides the activity section when `activities` is `undefined` and shows the empty `p` when it is `[]`. No widget has a loading or skeleton state.

Charts, time and markup:

- `BalanceWidget`, `CashFlowWidget` and `TaskProgressWidget` render recharts with `accessibilityLayer={false}` and `isAnimationActive={false}` inside a `div role="img"` named by `chartLabel`, the string title or `Gráfico`. The tests stub `ResizeObserver` for `ResponsiveContainer`.
- `WorldClockWidget` renders every clock from one instant; without `now` it ticks every second, with `now` it never ticks. `AgendaWidget` keys events by `calendarDateKey` and `calendarProps` cannot override `mode`, `modifiers`, `onSelect` or `selected`.
- `UpcomingEventWidget` defaults the window to 30 minutes on each side and calls `copyToClipboard(joinHref)` before `onCopy(joinHref)`.
- `ContactWidget` builds a channel link only for a value it receives and renders it as a COSS `Button` through `render={<a />}`; WhatsApp opens with `target="_blank" rel="noreferrer"`.
- Every avatar (`AvatarStack`, `ActivityTimeline`, `ContactWidget`) sits in a `rounded-full border border-input bg-card` wrapper so the COSS fallback stays visible on the card.
- `ProgressFooter` renders the ring `empty` and omits `srLabel` when `score.value` is `null`.
- Default labels are pt-BR strings exposed as props; the CRM, finance and productivity stories pass English labels, the gamification stories keep the defaults.

## Styling

No class is keyed on a `data-*` attribute (no `data-*:` or `group-data-*:` variant, no `cva`): the component picks the class in JS from a plain map, and the attribute is the hook for consumers and tests.

| Attribute | Where |
| --- | --- |
| `data-widget="<name>"` | the shell of every card widget, `ProgressHud`, `ProgressFooter` |
| `data-tone="default\|inverted"` | the shell of `MetricWidget`, `AssetStatWidget`, `TaskProgressWidget` |
| `data-tone="muted\|primary\|success\|warning"` | `[data-slot=metric-pill]` |
| `data-tone="destructive\|info\|success\|warning"` | `[data-slot=deal-stage]`, `[data-slot=invoice-status-item]`, the indicator of `[data-slot=risk-score-meter]` |
| `data-direction="up\|down\|flat"` | `[data-slot=trend-indicator]` |
| `data-expanded="true\|false"` | `[data-slot=expandable-list]` and the `TransactionsWidget` shell, only when items exceed `visibleCount` |
| `data-empty`, `data-over`, `data-kind`, `data-done`, `data-unlocked`, `data-active`, `data-today`, `data-channel` | progress ring, budget category, transaction item, quest, achievement, streak day, contact channel |

- `CardWidgetShell` is the only place for card radius, border and shadow. `scripts/override-exceptions.json` has two entries for it (`component: "Card"`): `border-border/80`, because the widget gives up the Card shadow and needs a lighter border, and `rounded-lg`, to match the Kanban card and column `--radius` instead of the Card's `rounded-2xl`. Changing either class requires updating its entry; `shadow-none before:hidden` is a neutral override and needs none.
- Colors only from theme tokens and the `--chart-1` to `--chart-5` variables, never palette classes. An item without `color` gets `var(--chart-${(index % 5) + 1})`; gamification defaults to `var(--warning-foreground)` and `var(--success-foreground)`.
- The `sm` `AvatarStack` uses `text-[0.625rem]`, the single spelling for ~10px text across the patterns until the consumer adds a `--text-2xs` token.

## Verify

```bash
bun test --isolate packages/parttens/src/widgets
bunx biome check packages/parttens/src/widgets
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/widgets/
```

Stories in `apps/storybook/src/patterns/widgets/` run axe with `test: 'error'`; `crm`, `finance` and `productivity` declare `color-contrast` exceptions on specific stories.

## Pointers

- Public API: `index.ts` and the `widgets` entry of `docs/architecture/public-api-exports.json`. Props and defaults are in each file. The registry ships every file the barrel reaches, so a new file must be imported from a domain barrel or `shared/index.ts`; `WidgetHeader`, `XpMeter`, `trendDirection` and the recharts tooltips stay internal until a reason is recorded in the architecture doc.
- Decisions: `docs/architecture/tc96-parttens.md`, sections "Estrutura interna dos patterns" (the `widgets/` paragraph: type scale, shell, `ExpandableList` rule, avatar wrapper, `IconFrame` sizes and measured contrast ratios; record new scale decisions there), "Acessibilidade dos patterns" (the `text-[0.625rem]` decision) and "Validação proposta" (the reasons for the `color-contrast` exceptions).
