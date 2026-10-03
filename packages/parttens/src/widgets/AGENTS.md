# Widgets pattern

Guide for agents working in `packages/parttens/src/widgets`. The repo-wide rules in the root `AGENTS.md` still apply: no comments in code, Biome formatting, `cn` only at the boundary with an external `className`, COSS through `@tc96/ui/<component>`, no business rules inside the pattern. The folder is not split into `composition/` and `components/`: it is grouped by domain (`crm/`, `finance/`, `gamification/`, `productivity/`), with the pieces every domain shares in `shared/` and the cross-pattern types in `types/`. Six files in `shared/`, `finance/` and `types/` still carry Portuguese JSDoc from before the no-comments rule (`amount.tsx`, `trend-indicator.tsx`, `asset-list.tsx`, `market-share-widget.tsx`, `risk-score-widget.tsx`, `types/index.ts`); remove them when you next touch those files.

## What it is

Dashboard widgets: cards that show prepared numbers, lists, charts and progress, all mounted on the same frame (`CardWidgetShell`, the COSS `Card` rendered as a `section`) and the same building blocks (`WidgetHeader`, `Amount`, `TrendIndicator`, `WidgetPeriodToggle`, `StatList`, `AvatarStack`, `ExpandableList`, `ProgressRing`, `MetricPill`, `IconFrame`). The consumer passes values already computed and labelled; the widget only sums, derives shares and widths from what it receives, formats numbers through `@tc96/helpers/format` and times through `@tc96/helpers/time`, and reports period changes, expansion, subtask toggles, day selection and link copies through callbacks. Which tone a score deserves, which period is active and what the labels say are props.

## Files

Top level: the barrel, the shared types and the test that covers the shared pieces.

| File | Owns | Public |
| --- | --- | --- |
| `index.ts` | the barrel: re-exports the four domain barrels, `shared/index.ts` and the three types of `types/index.ts` | yes |
| `types/index.ts` | `TrendDirection`, `WidgetPeriodOption<TPeriod>`, `WidgetTone` (`destructive \| info \| success \| warning`) | through the barrel |
| `widgets.test.tsx` | JSDOM tests for `Amount`, `TrendIndicator`, `WidgetPeriodToggle`, `MarketShareWidget`, `RiskScoreWidget`, `AssetStatWidget`, `BalanceWidget`, `CardWidgetShell` and `ExpandableList` | — |

`shared/`: the frame and the pieces more than one domain uses. `shared/index.ts` also re-exports `IconFrame` from `@tc96/elements/icon-frame` and `formatAmount` from `@tc96/helpers/format`, so a consumer who copies the pattern gets both from the widgets barrel.

| File | Owns | Public |
| --- | --- | --- |
| `shared/index.ts` | the shared barrel, plus the re-exports of `IconFrame`, `IconFrameProps`, `IconFrameShape`, `IconFrameSize`, `IconFrameVariant`, `formatAmount` and `AmountFormatOptions` | through the barrel |
| `shared/card-widget-shell.tsx` | `CardWidgetShell`, `CardWidgetShellProps`: the COSS `Card` as `section` with the widget border, radius and no shadow | yes |
| `shared/widget-header.tsx` | `WidgetHeader`: `CardHeader` with the `CardTitle` (`id` for `aria-labelledby`) and an optional `CardAction` | no |
| `shared/amount.tsx` | `Amount`, `AmountProps`: integer and fraction split by `splitAmountAtDecimal`, fraction dimmed on `dimFraction` | yes |
| `shared/avatar-stack.tsx` | `AvatarStack`, `AvatarStackPerson`, `AvatarStackProps`: overlapping avatars with a `+N` overflow | yes |
| `shared/expandable-list.tsx` | `ExpandableList`, `ExpandableListProps`, `WidgetExpandProps`, `defaultVisibleCount` (5), `defaultExpandMaxHeight` (420) | yes |
| `shared/metric-pill.tsx` | `MetricPill`, `MetricPillProps`, `MetricPillTone` | yes |
| `shared/metric-widget.tsx` | `MetricWidget`, `MetricWidgetProps`: generic label, value, change, icon, `inverted` tone | yes |
| `shared/progress-ring.tsx` | `ProgressRing`, `ProgressRingProps`, `clampRatio` | yes |
| `shared/stat-list.tsx` | `StatList`, `StatListProps`, `WidgetStat`: label and value pairs in a `dl` | yes |
| `shared/trend-indicator.tsx` | `TrendIndicator`, `TrendIndicatorProps`, `TrendIndicatorLabels`; `trendDirection` is exported by the file only | `TrendIndicator` and its types yes; `trendDirection` no |
| `shared/widget-period-toggle.tsx` | `WidgetPeriodToggle`, `WidgetPeriodToggleProps`: the COSS `ToggleGroup` with one active period | yes |

`crm/`: sales and relationship widgets. `ActivityTimeline` is shared by `ActivityFeedWidget` and `ContactWidget`.

| File | Owns | Public |
| --- | --- | --- |
| `crm/index.ts` | the domain barrel | through the barrel |
| `crm/activity-feed-widget.tsx` | `ActivityFeedWidget`, `ActivityFeedWidgetProps` | yes |
| `crm/activity-timeline.tsx` | `ActivityTimeline`, `ActivityTimelineProps`, `Activity`: the `ol` of avatars, toned icons and times, with the empty `p` | yes |
| `crm/contact-widget.tsx` | `ContactWidget`, `ContactWidgetProps`, `ContactChannelLabels`, `ContactTag`, `whatsappHref` | yes |
| `crm/deals-widget.tsx` | `DealsWidget`, `DealsWidgetProps`, `DealList`, `DealListProps`, `DealListItem`, `DealListItemProps`, `Deal`, `DealStage` | yes |
| `crm/pipeline-widget.tsx` | `PipelineWidget`, `PipelineWidgetProps`, `PipelineStage` | yes |
| `crm/crm.test.tsx` | JSDOM tests for the four widgets | — |

`finance/`: personal and business finance widgets. `ShareBar` lives in `market-share-widget.tsx` and is reused by `InvoiceStatusWidget`.

| File | Owns | Public |
| --- | --- | --- |
| `finance/index.ts` | the domain barrel | through the barrel |
| `finance/asset-list.tsx` | `AssetList`, `AssetListProps`, `AssetListItem`, `AssetListItemProps` | yes |
| `finance/asset-stat-widget.tsx` | `AssetStatWidget`, `AssetStatWidgetProps` | yes |
| `finance/balance-widget.tsx` | `BalanceWidget`, `BalanceWidgetProps`, `BalancePoint`; `BalanceTooltip` stays internal | yes |
| `finance/budget-widget.tsx` | `BudgetWidget`, `BudgetWidgetProps`, `BudgetCategory` | yes |
| `finance/cash-flow-widget.tsx` | `CashFlowWidget`, `CashFlowWidgetProps`, `CashFlowPoint`; `CashFlowTooltip` stays internal | yes |
| `finance/invoice-status-widget.tsx` | `InvoiceStatusWidget`, `InvoiceStatusWidgetProps`, `InvoiceStatus` | yes |
| `finance/market-share-widget.tsx` | `MarketShareWidget`, `MarketShareWidgetProps`, `MarketShareSegment`, `ShareBar`, `ShareBarProps` | yes |
| `finance/risk-score-widget.tsx` | `RiskScoreWidget`, `RiskScoreWidgetProps`, `RiskScoreStat` (alias of `WidgetStat`) | yes |
| `finance/transactions-widget.tsx` | `TransactionsWidget`, `TransactionsWidgetProps`, `TransactionList`, `TransactionListProps`, `TransactionListItem`, `TransactionListItemProps`, `Transaction`, `TransactionKind`, `transactionKind` | yes |
| `finance/finance.test.tsx` | JSDOM tests for `BudgetWidget`, `CashFlowWidget`, `TransactionsWidget`, `InvoiceStatusWidget` | — |

`gamification/`: learning progress and engagement. The item types live in `gamification/types.ts`; `XpMeter` is the one internal piece.

| File | Owns | Public |
| --- | --- | --- |
| `gamification/index.ts` | the domain barrel | through the barrel |
| `gamification/types.ts` | `XpProgress`, `StreakDay`, `Achievement`, `Quest` | through the barrel |
| `gamification/achievements-widget.tsx` | `AchievementsWidget`, `AchievementsWidgetProps` | yes |
| `gamification/level-widget.tsx` | `LevelWidget`, `LevelWidgetProps` | yes |
| `gamification/progress-footer.tsx` | `ProgressFooter`, `ProgressFooterProps`, `ProgressFooterMetric`, `ProgressFooterScore`: a row for the foot of another card, no shell | yes |
| `gamification/progress-hud.tsx` | `ProgressHud`, `ProgressHudProps`: a one-line `section` outside the card, no shell | yes |
| `gamification/quests-widget.tsx` | `QuestsWidget`, `QuestsWidgetProps`, `orderQuests` | yes |
| `gamification/streak-widget.tsx` | `StreakWidget`, `StreakWidgetProps` | yes |
| `gamification/xp-meter.tsx` | `XpMeter`: the COSS `MeterPrimitive` with the XP clamped to `[0, max(target, 1)]` | no |
| `gamification/gamification.test.tsx` | JSDOM tests for the six public pieces | — |

`productivity/`: tasks and calendars.

| File | Owns | Public |
| --- | --- | --- |
| `productivity/index.ts` | the domain barrel | through the barrel |
| `productivity/agenda-widget.tsx` | `AgendaWidget`, `AgendaWidgetProps`, `AgendaEvent` | yes |
| `productivity/project-card-widget.tsx` | `ProjectCardWidget`, `ProjectCardWidgetProps`, `ProjectSubtask`, `ProjectTag` | yes |
| `productivity/task-progress-widget.tsx` | `TaskProgressWidget`, `TaskProgressWidgetProps`, `TaskProgressPoint`; `TaskProgressTooltip` stays internal | yes |
| `productivity/upcoming-event-widget.tsx` | `UpcomingEventWidget`, `UpcomingEventWidgetProps` | yes |
| `productivity/world-clock-widget.tsx` | `WorldClockWidget`, `WorldClockWidgetProps`, `WorldClock`; `useTickingNow` stays internal | yes |
| `productivity/productivity.test.tsx` | JSDOM tests for the five widgets | — |

Only what `index.ts` exports is public. The registry copies every file this barrel reaches (`packages/registry/src/manifest.ts` lists `widgets` as a pattern), so a new file must be imported from one of the domain barrels or from `shared/index.ts`, and `WidgetHeader`, `XpMeter`, `trendDirection` and the recharts tooltips stay internal until a reason is recorded in `docs/architecture/tc96-parttens.md`. The pattern has no `test/dom.ts` of its own: every test file imports `properties/test/dom`.

Import direction inside the folder: `<domain>/` → `shared/` and `types/`; `shared/` → `types/` (`trend-indicator.tsx`, `widget-period-toggle.tsx`); `shared/` never imports a domain and no domain imports another. Inside a domain, `invoice-status-widget.tsx` imports `ShareBar` from `./market-share-widget`, `activity-feed-widget.tsx` and `contact-widget.tsx` import `./activity-timeline`, and `level-widget.tsx` and `progress-hud.tsx` import `./xp-meter`. Outside the pattern the widgets import `@tc96/elements/icon-frame`, `@tc96/helpers/{format,initials,clipboard,time,calendar-date}`, `@tc96/ui/{avatar,badge,button,calendar,card,checkbox,meter,scroll-area,toggle-group}`, `@tc96/utils`, `lucide-react` and, in `balance-widget.tsx`, `cash-flow-widget.tsx` and `task-progress-widget.tsx`, `recharts`.

## Public API

```ts
interface CardWidgetShellProps extends ComponentProps<typeof Card> {}   // render defaults to <section />

interface AmountProps extends Omit<ComponentProps<'span'>, 'children'> {
  dimFraction?: boolean          // fraction, suffix and symbol in text-muted-foreground
  format?: AmountFormatOptions
  value: number
}

interface AvatarStackPerson { fallback?: string; id: string; imageUrl?: string; label: string }
interface AvatarStackProps extends Omit<ComponentProps<'ul'>, 'children'> {
  'aria-label'?: string          // default 'Pessoas'
  max?: number                   // default 3; the rest becomes +N
  people: readonly AvatarStackPerson[]
  size?: 'default' | 'sm'
}

interface WidgetExpandProps {
  collapseLabel?: ReactNode      // default 'Ver menos'
  defaultExpanded?: boolean
  expandLabel?: (hidden: number) => ReactNode   // default `Ver todas (+${hidden})`
  expanded?: boolean             // controlled when set
  maxHeight?: number             // default 420, the ScrollArea height
  onExpandedChange?: (expanded: boolean) => void
  visibleCount?: number          // default 5; Infinity disables collapsing
}
interface ExpandableListProps<TItem> extends WidgetExpandProps {
  children: (items: readonly TItem[]) => ReactNode
  className?: string
  items: readonly TItem[]
}

type MetricPillTone = 'muted' | 'primary' | 'success' | 'warning'
interface MetricPillProps extends Omit<ComponentProps<'span'>, 'ref'> { as?: 'li' | 'span'; tone?: MetricPillTone }

interface MetricWidgetProps extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  change?: number; changeFormat?: AmountFormatOptions; changeLabel?: ReactNode
  children?: ReactNode
  format?: AmountFormatOptions
  icon?: ReactNode
  label: ReactNode
  tone?: 'default' | 'inverted'
  value: number | ReactNode      // a number goes through Amount
}

interface ProgressRingProps extends Omit<ComponentProps<'div'>, 'children'> {
  children?: ReactNode
  empty?: boolean                // dashed track, no value arc
  ratio: number                  // 0..1, see clampRatio(current, target)
  strokeWidth?: number           // default 10
}

interface WidgetStat { id: string; label: ReactNode; value: ReactNode }
interface StatListProps extends Omit<ComponentProps<'dl'>, 'children'> { stats: readonly WidgetStat[] }

interface TrendIndicatorLabels { down: string; flat: string; up: string }
interface TrendIndicatorProps {
  className?: string
  format?: AmountFormatOptions   // default { style: 'percent' }; value is a ratio
  labels?: TrendIndicatorLabels  // sr-only prefix; default 'Queda de' / 'Sem variação' / 'Alta de'
  variant?: 'badge' | 'plain'
  value: number
}

type TrendDirection = 'down' | 'flat' | 'up'
interface WidgetPeriodOption<TPeriod extends string = string> { label: string; value: TPeriod }
type WidgetTone = 'destructive' | 'info' | 'success' | 'warning'
interface WidgetPeriodToggleProps<TPeriod extends string = string> {
  'aria-label'?: string          // default 'Período'
  className?: string
  onValueChange?: (period: TPeriod) => void
  options: readonly WidgetPeriodOption<TPeriod>[]
  value?: TPeriod
}

// crm
interface Activity {
  description?: ReactNode; icon?: ReactNode; id: string
  person: AvatarStackPerson
  timeLabel: ReactNode; title: ReactNode
  tone?: WidgetTone              // colors the icon badge only
}
interface ActivityTimelineProps extends Omit<ComponentProps<'ol'>, 'children'> {
  'aria-label': string
  activities: readonly Activity[]
  emptyLabel?: ReactNode         // default 'Sem atividades'
  expand?: WidgetExpandProps
}
interface ActivityFeedWidgetProps extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  action?: ReactNode
  activities: readonly Activity[]
  expand?: WidgetExpandProps
  emptyLabel?: ReactNode
  listLabel?: string             // default: the title when it is a string, else 'Atividades'
  title: ReactNode
}
interface ContactChannelLabels { email: string; phone: string; whatsapp: string }
interface ContactTag { id: string; label: ReactNode }
interface ContactWidgetProps extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  action?: ReactNode
  activities?: readonly Activity[]   // undefined hides the section; [] shows emptyLabel
  activitiesLabel?: string           // default 'Atividade recente'
  channelLabels?: ContactChannelLabels
  company?: ReactNode; jobTitle?: ReactNode
  email?: string; phone?: string; whatsapp?: string   // each present value becomes a link
  expand?: WidgetExpandProps
  emptyLabel?: ReactNode
  person: AvatarStackPerson      // person.label is the region name
  tags?: readonly ContactTag[]
}
function whatsappHref(phone: string): string   // `https://wa.me/${digits}`
interface DealStage { label: ReactNode; tone?: WidgetTone }
interface Deal {
  closeLabel?: ReactNode; company?: ReactNode; icon?: ReactNode; id: string
  name: ReactNode; owner?: AvatarStackPerson; stage?: DealStage; value: number
}
interface DealListProps extends ComponentProps<'ul'> {}
interface DealListItemProps extends Omit<ComponentProps<'li'>, 'children' | 'title'> {
  closeLabel?: ReactNode; company?: ReactNode; format?: AmountFormatOptions; icon?: ReactNode
  name: ReactNode; owner?: AvatarStackPerson; ownerLabel?: string; stage?: DealStage; value: number
}
interface DealsWidgetProps extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  action?: ReactNode
  deals: readonly Deal[]
  emptyLabel?: ReactNode         // default 'Sem negócios'
  expand?: WidgetExpandProps
  format?: AmountFormatOptions
  listLabel?: string; ownerLabel?: string
  title: ReactNode
}
interface PipelineStage { color?: string; count: number; id: string; label: ReactNode; value: number }
interface PipelineWidgetProps<TPeriod extends string = string> extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  action?: ReactNode             // replaced by the period toggle when periods has items
  countLabel?: (count: number) => ReactNode
  expand?: WidgetExpandProps
  format?: AmountFormatOptions
  listLabel?: string
  onPeriodChange?: (period: TPeriod) => void; period?: TPeriod; periodLabel?: string
  periods?: readonly WidgetPeriodOption<TPeriod>[]
  stages: readonly PipelineStage[]
  title: ReactNode
  totalLabel?: ReactNode         // default 'Total no funil'
}

// finance
interface AssetListProps extends ComponentProps<'ul'> {}
interface AssetListItemProps extends Omit<ComponentProps<'li'>, 'title' | 'value'> {
  icon?: ReactNode; meta?: ReactNode; name: ReactNode; value: ReactNode
}
interface AssetStatWidgetProps extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  change?: number; changeFormat?: AmountFormatOptions
  format?: AmountFormatOptions
  icon?: ReactNode
  label: ReactNode               // the caption above the value
  name: ReactNode; symbol?: ReactNode   // together they name the region
  tone?: 'default' | 'inverted'
  value: number
}
interface BalancePoint { label: string; value: number }
interface BalanceWidgetProps<TPeriod extends string = string> extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  change?: number; changeFormat?: AmountFormatOptions; changeLabel?: ReactNode
  chartLabel?: string            // role="img" name; default: string title, else 'Gráfico'
  color?: string                 // default 'var(--chart-1)'
  data: readonly BalancePoint[]
  format?: AmountFormatOptions
  height?: number                // default 160
  onPeriodChange?: (period: TPeriod) => void; period?: TPeriod; periodLabel?: string
  periods?: readonly WidgetPeriodOption<TPeriod>[]
  title: ReactNode
  value: number
}
interface BudgetCategory { color?: string; icon?: ReactNode; id: string; label: string; limit: number; spent: number }
interface BudgetWidgetProps<TPeriod extends string = string> extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  action?: ReactNode
  categories: readonly BudgetCategory[]
  expand?: WidgetExpandProps
  format?: AmountFormatOptions
  limitLabel?: ReactNode; spentLabel?: ReactNode   // defaults 'Limite' and 'Gasto'
  locale?: string                // for the sr-only share percentage
  onPeriodChange?: (period: TPeriod) => void; period?: TPeriod; periodLabel?: string
  periods?: readonly WidgetPeriodOption<TPeriod>[]
  title: ReactNode
}
interface CashFlowPoint { expenses: number; income: number; label: string }
interface CashFlowWidgetProps<TPeriod extends string = string> extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  chartLabel?: string
  data: readonly CashFlowPoint[]
  expensesColor?: string; incomeColor?: string     // defaults 'var(--chart-2)' and 'var(--chart-1)'
  expensesLabel?: ReactNode; incomeLabel?: ReactNode; netLabel?: ReactNode   // 'Saídas', 'Entradas', 'Saldo'
  format?: AmountFormatOptions
  height?: number                // default 160
  onPeriodChange?: (period: TPeriod) => void; period?: TPeriod; periodLabel?: string
  periods?: readonly WidgetPeriodOption<TPeriod>[]
  title: ReactNode
}
interface InvoiceStatus { count?: number; id: string; label: string; tone: WidgetTone; value: number }
interface InvoiceStatusWidgetProps extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  action?: ReactNode
  countLabel?: (count: number) => ReactNode
  expand?: WidgetExpandProps
  format?: AmountFormatOptions
  locale?: string
  statuses: readonly InvoiceStatus[]
  title: ReactNode
  totalLabel?: ReactNode         // default 'Total em aberto'
}
interface MarketShareSegment { change?: number; color?: string; id: string; label: string; value: number }
interface ShareBarProps extends Omit<ComponentProps<'ul'>, 'children'> {
  changeFormat?: AmountFormatOptions
  locale?: string
  segments: readonly MarketShareSegment[]
}
interface MarketShareWidgetProps<TPeriod extends string = string> extends Omit<ComponentProps<'div'>, 'title' | 'children'> {
  children?: ReactNode           // below the bar, usually an AssetList
  changeFormat?: AmountFormatOptions
  endLabel?: ReactNode; startLabel?: ReactNode
  locale?: string
  onPeriodChange?: (period: TPeriod) => void; period?: TPeriod; periodLabel?: string
  periods?: readonly WidgetPeriodOption<TPeriod>[]
  segments: readonly MarketShareSegment[]
  title: ReactNode
}
type RiskScoreStat = WidgetStat
interface RiskScoreWidgetProps extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  action?: ReactNode
  highLabel?: ReactNode; lowLabel?: ReactNode   // defaults 'Risco alto' and 'Risco baixo'
  max?: number; min?: number     // defaults 100 and 0
  meterLabel?: string            // default: string title, else 'Pontuação'
  score: number
  stats?: readonly RiskScoreStat[]
  title: ReactNode
  tone?: WidgetTone              // default 'success'; the widget does not judge the score
}
type TransactionKind = 'credit' | 'debit'
interface Transaction {
  amount: number; icon?: ReactNode; id: string
  kind?: TransactionKind         // default transactionKind(amount): credit when amount >= 0
  meta?: ReactNode; name: ReactNode; status?: ReactNode
}
interface TransactionListProps extends ComponentProps<'ul'> {}
interface TransactionListItemProps extends Omit<ComponentProps<'li'>, 'title'> {
  amount: number; format?: AmountFormatOptions; icon?: ReactNode
  kind?: TransactionKind; meta?: ReactNode; name: ReactNode; status?: ReactNode
}
function transactionKind(amount: number): TransactionKind
interface TransactionsWidgetProps extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  action?: ReactNode
  collapseLabel?: ReactNode; defaultExpanded?: boolean; expandLabel?: (hidden: number) => ReactNode
  expanded?: boolean; maxHeight?: number; onExpandedChange?: (expanded: boolean) => void; visibleCount?: number
  emptyLabel?: ReactNode         // default 'Sem transações'
  format?: AmountFormatOptions
  listLabel?: string
  title: ReactNode
  transactions: readonly Transaction[]
}

// gamification
interface XpProgress { current: number; target: number; total: number }
interface StreakDay { active: boolean; id: string; label: string; today?: boolean }
interface Achievement {
  detail: string; icon: ReactNode; id: string; label: string
  progress?: { current: number; target: number }   // shown while locked
  unlocked: boolean
}
interface Quest {
  detail?: ReactNode; done: boolean; icon: ReactNode; id: string; label: string
  progress?: { current: number; target: number }   // meter while open
}
interface AchievementsWidgetProps extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  achievements: readonly Achievement[]
  action?: ReactNode             // default: the `${unlocked} de ${total}` count
  color?: string                 // default 'var(--warning-foreground)'
  countLabel?: (unlocked: number, total: number) => ReactNode
  expand?: WidgetExpandProps     // visibleCount defaults to 6 here
  lockedLabel?: string; unlockedLabel?: string   // sr-only state, 'bloqueada' / 'conquistada'
  title: ReactNode
}
interface LevelWidgetProps extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  action?: ReactNode
  format?: AmountFormatOptions   // default { maximumFractionDigits: 0, style: 'decimal' }
  level: number
  levelLabel?: (level: number) => ReactNode
  meterLabel?: (nextLevel: number) => string
  remainingLabel?: (remaining: string, nextLevel: number) => ReactNode
  ringLabel?: ReactNode          // default 'Nível'
  title: ReactNode
  totalLabel?: (total: string) => ReactNode
  xp: XpProgress
}
interface ProgressFooterMetric { icon: ReactNode; id: string; tone?: MetricPillTone; value: ReactNode }
interface ProgressFooterScore {
  display: ReactNode
  max: number
  srLabel: string                // read after display, only when value is not null
  value: number | null           // null renders the ring as empty
}
interface ProgressFooterProps extends Omit<ComponentProps<'div'>, 'children'> {
  metrics: readonly ProgressFooterMetric[]
  score: ProgressFooterScore
}
interface ProgressHudProps extends Omit<ComponentProps<'section'>, 'children'> {
  achievements?: { total: number; unlocked: number }
  achievementsLabel?: string     // default 'conquistas'
  'aria-label': string
  format?: AmountFormatOptions
  level: number
  levelLabel?: (level: number) => ReactNode
  meterLabel?: (nextLevel: number) => string
  streakDays?: number
  streakLabel?: (days: number) => string
  xp: XpProgress
}
interface QuestsWidgetProps extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  action?: ReactNode             // default: description, when given
  description?: ReactNode
  doneColor?: string             // default 'var(--success-foreground)'
  doneLabel?: ReactNode          // default 'Concluída'
  expand?: WidgetExpandProps
  quests: readonly Quest[]
  title: ReactNode
}
function orderQuests(quests: readonly Quest[]): Quest[]   // open first, then done
interface StreakWidgetProps extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  action?: ReactNode
  activeLabel?: string; inactiveLabel?: string; todayLabel?: string   // sr-only day state
  color?: string                 // default 'var(--warning-foreground)'
  days: number
  daysLabel?: (days: number) => ReactNode
  listLabel?: string             // default 'Dias de estudo'
  title: ReactNode
  week: readonly StreakDay[]
  weekLabel?: ReactNode          // default 'Últimos 7 dias'
}

// productivity
interface AgendaEvent { color?: string; date: string; endLabel?: ReactNode; id: string; startLabel?: ReactNode; title: ReactNode }
interface AgendaWidgetProps extends Omit<ComponentProps<'div'>, 'children' | 'onSelect' | 'title'> {
  action?: ReactNode
  calendarProps?: Omit<ComponentProps<typeof Calendar>, 'mode' | 'modifiers' | 'modifiersClassNames' | 'onSelect' | 'selected'>
  defaultSelected?: Date         // default new Date()
  emptyLabel?: ReactNode         // default 'Sem eventos'
  expand?: WidgetExpandProps
  events: readonly AgendaEvent[] // date is a calendarDateKey (YYYY-MM-DD)
  listLabel?: string             // default 'Eventos do dia'
  onSelect?: (date: Date) => void
  selected?: Date                // controlled when set
  title: ReactNode
}
interface ProjectSubtask { done: boolean; id: string; label: string }
interface ProjectTag { id: string; label: ReactNode }
interface ProjectCardWidgetProps extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  action?: ReactNode
  description?: ReactNode
  endLabel?: ReactNode; startLabel?: ReactNode
  expand?: WidgetExpandProps
  footer?: ReactNode
  locale?: string
  meta?: ReactNode
  onSubtaskToggle?: (id: string, done: boolean) => void   // absent makes the checkboxes readOnly
  people?: readonly AvatarStackPerson[]; peopleLabel?: string
  progress?: number              // 0..1; default done / total of the subtasks
  progressLabel?: ReactNode      // default 'Progresso'
  subtasks?: readonly ProjectSubtask[]; subtasksLabel?: string
  tags?: readonly ProjectTag[]
  title: ReactNode
}
interface TaskProgressPoint { label: string; value: number }
interface TaskProgressWidgetProps<TPeriod extends string = string> extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  change?: number; changeFormat?: AmountFormatOptions; changeLabel?: ReactNode
  chartLabel?: string
  color?: string                 // default 'var(--chart-1)'
  data: readonly TaskProgressPoint[]
  format?: AmountFormatOptions
  height?: number                // default 140
  onPeriodChange?: (period: TPeriod) => void; period?: TPeriod; periodLabel?: string
  periods?: readonly WidgetPeriodOption<TPeriod>[]
  stats?: readonly WidgetStat[]
  title: ReactNode
  tone?: 'default' | 'inverted'
}
interface UpcomingEventWidgetProps extends Omit<ComponentProps<'div'>, 'children' | 'onCopy' | 'title'>, TimeOfDayOptions {
  copyLabel?: string             // default 'Copiar link'
  end: Date; start: Date
  eyebrow?: ReactNode
  joinHref?: string; joinLabel?: ReactNode; joinText?: ReactNode
  live?: boolean                 // red dot before the eyebrow
  onCopy?: (href: string) => void
  provider?: ReactNode
  timelineLabel?: string         // default `${start} – ${end}` via formatTimeOfDay
  title: ReactNode
  windowEnd?: Date; windowStart?: Date   // default end + 30 min and start - 30 min
}
interface WorldClock { id: string; label: ReactNode; meta?: ReactNode; timeZone: string }
interface WorldClockWidgetProps extends Omit<ComponentProps<'div'>, 'children' | 'title'>, Omit<TimeOfDayOptions, 'timeZone'> {
  clocks: readonly WorldClock[]
  label?: string                 // the region name; default 'Relógios'
  now?: Date                     // fixed instant; without it the widget ticks every second
  showSeconds?: boolean          // default true
}
```

Shared building blocks and their status: `CardWidgetShell`, `Amount`, `AvatarStack`, `ExpandableList`, `MetricPill`, `MetricWidget`, `ProgressRing` with `clampRatio`, `StatList`, `TrendIndicator` and `WidgetPeriodToggle` are public through `shared/index.ts`, and so are the re-exports of `IconFrame` (`@tc96/elements/icon-frame`) and `formatAmount` (`@tc96/helpers/format`). `WidgetHeader`, `XpMeter` and `trendDirection` are internal.

Behavior worth knowing before changing it:

- Every card widget mounts `CardWidgetShell` with `aria-labelledby` pointing at a `useId()` title, so each one is a `region` named by its title; the tests query `getByRole('region', { name })`. `AssetStatWidget` names the region with `name` plus `symbol`, `ContactWidget` with `person.label`, `WorldClockWidget` with `aria-label={label}`. `ProgressHud` is a `section` with a required `aria-label` and `ProgressFooter` a plain `div`; neither uses the shell.
- The shell is the COSS `Card` rendered as `section` with `min-w-0 rounded-lg border-border/80 shadow-none before:hidden`. `widgets.test.tsx` asserts the class list keeps `border-border/80`, `shadow-none`, `before:hidden` and the consumer's `className`, and drops the Card's `shadow-xs`.
- Numbers go through `@tc96/helpers/format`: `Amount` uses `splitAmountAtDecimal` and dims the fraction when `dimFraction` (test: `09.34%` with `.34%` in `text-muted-foreground`); every other number is `formatAmount(value, format)`. Percentages follow Intl semantics (`0.0934` is `9.34%`), and with no `format` the tests render currency (`$48,250.75`). Shares are announced in `sr-only` text as `label: NN.NN%` (`ShareBar`), or as a bare percentage (`PipelineWidget`, `BudgetWidget`), with `locale` or `format.locale` passed on.
- `TrendIndicator` derives the direction from the sign, renders `Math.abs(value)` and prefixes an `sr-only` label (`Alta de`, `Queda de`, `Sem variação`). `badge` maps to the COSS `Badge` `lg` with `success`, `error` or `secondary`; `plain` maps to `text-success-foreground`, `text-destructive-foreground`, `text-muted-foreground`.
- `WidgetPeriodToggle` wraps the COSS `ToggleGroup` with a one-item `value` array and emits only when a period is selected; clicking the active item emits nothing (test). The six widgets with `periods` (`PipelineWidget`, `BalanceWidget`, `BudgetWidget`, `CashFlowWidget`, `MarketShareWidget`, `TaskProgressWidget`) are controlled through `period` and `onPeriodChange` and put the toggle in the header action; `PipelineWidget` and `BudgetWidget` drop `action` when `periods` has items, `TaskProgressWidget` falls back to the trend when it has none.
- `ExpandableList` is the single collapse mechanism: `hidden = items.length - visibleCount`; collapsed, it renders the first `visibleCount` items under a `from-card` gradient with an outline `Button` `Ver todas (+N)`; expanded, it renders every item inside the Base UI `ScrollArea` capped at `maxHeight` plus a ghost `Ver menos`. `expanded` is controlled when passed, otherwise `defaultExpanded` seeds local state. Widgets forward `expand` (`WidgetExpandProps`); `AchievementsWidget` spreads `visibleCount={6}` before `expand`. `TransactionsWidget` keeps its own copy of the same logic with the expand props flattened and sets `data-expanded` on the shell instead of on a list root; both copies are tested.
- Empty states are a `p` with a `data-slot` and a default label: `activity-feed-empty` (`Sem atividades`), `deals-empty` (`Sem negócios`), `transactions-empty` (`Sem transações`), `agenda-empty` (`Sem eventos`). `ContactWidget` hides the activity section when `activities` is `undefined` and shows the empty `p` when it is `[]`. No widget has a loading or skeleton state.
- `tone="inverted"` on `MetricWidget`, `AssetStatWidget` and `TaskProgressWidget` wraps the card in `<div className="dark contents" data-slot="*-widget-scope">` and sets `data-tone` on the shell; the dark palette comes from the consumer's theme, not from the pattern (tests assert the `dark` class on the scope).
- Charts: `BalanceWidget` (`AreaChart`), `CashFlowWidget` (`BarChart`) and `TaskProgressWidget` (`BarChart`) use recharts with `accessibilityLayer={false}` and `isAnimationActive={false}` inside a `div role="img"` named by `chartLabel`, the string title or `Gráfico`; ticks are `var(--muted-foreground)` at 12px, cursors `var(--border)` or `var(--muted)`, tooltips use `bg-popover text-popover-foreground`. The tests stub `ResizeObserver` for `ResponsiveContainer`.
- Derived values are computed in render, never stored: `PipelineWidget` sums `max(0, value)` and scales each bar to the largest stage (test: `80%`, `100%`, `20%`); `BudgetWidget` sums spent and limit, clamps the meter at the limit and marks `spent > limit` with `data-over`, `bg-destructive` and `text-destructive-foreground`; `CashFlowWidget` totals income, expenses and net and colors a negative net `text-destructive-foreground`; `InvoiceStatusWidget` totals the statuses and feeds `ShareBar`; `ProjectCardWidget` uses `progress` or `done / total`, rounded to a percent on the COSS `Meter`; `LevelWidget` shows `max(target - current, 0)` remaining and `XpMeter` clamps the value to `[0, max(target, 1)]` (test: `300/250` reads `250`, `Faltam 0 XP`).
- Colors default to the theme chart scale: a `PipelineStage`, `BudgetCategory` or `MarketShareSegment` without `color` gets `var(--chart-${(index % 5) + 1})`, an `AgendaEvent` gets `var(--chart-1)`. `InvoiceStatus.tone` maps to `var(--destructive|info|success|warning)`, `RiskScoreWidget.tone` to `bg-destructive|info|success|warning` on the meter indicator, `DealStage.tone` to the `Badge` variants (`destructive` becomes `error`; default `info`), `Activity.tone` to `text-*-foreground` on the icon only. Gamification defaults are `var(--warning-foreground)` for streak and medals and `var(--success-foreground)` for a done quest. `BudgetWidget` wraps `category.icon` in an `IconFrame` with the same `color` as its bar (test: both read `rgb(37, 99, 235)`).
- Meters are the COSS `MeterPrimitive` with an `aria-label`: the category label (`BudgetWidget`), the quest label (`QuestsWidget`), `meterLabel(nextLevel)` (`XpMeter`, default `Progresso para o nível N`), `meterLabel` or the string title (`RiskScoreWidget`, fallback `Pontuação`). `ProjectCardWidget` uses the styled `Meter` with `MeterValue` and names it only when `progressLabel` is a string.
- `AvatarStack` shows `people.slice(0, max)` and a `+N` overflow whose hidden names are `sr-only`; every avatar (also in `ActivityTimeline` and `ContactWidget`) sits in a `rounded-full border border-input bg-card` wrapper so the COSS fallback stays visible on the card.
- `ContactWidget` builds channel links only for the values it receives (`mailto:`, `tel:`, `whatsappHref`, which strips non-digits), renders them as COSS `Button` `outline` through `render={<a />}`, and opens WhatsApp with `target="_blank" rel="noreferrer"`.
- `UpcomingEventWidget` defaults the window to `start - 30 min` and `end + 30 min`, draws a tick every 30 minutes, positions the slot by ratio (test: `left: 20%`, `width: 60%`), labels window start, start, end and window end through `formatTimeOfDay` (duplicates by ratio removed), and on copy calls `copyToClipboard(joinHref)` then `onCopy(joinHref)`.
- `WorldClockWidget` renders each clock from one instant through `splitTimeOfDay`; without `now` it ticks every second with `setInterval`, with `now` it never ticks. `AgendaWidget` keys events by `calendarDateKey`, marks busy days through `modifiersClassNames` (typography only), filters the list to the selected day and is controlled when `selected` is passed; `calendarProps` cannot override `mode`, `modifiers`, `onSelect` or `selected`.
- `QuestsWidget` renders `orderQuests(quests)` (open before done) and marks a done quest with the `doneColor` `IconFrame`, a `Badge` `success` and `line-through`. `StreakWidget` and `AchievementsWidget` announce each item's state in `sr-only` (`seg: estudou`, `ter, hoje: sem estudo`, `conquistada`, `bloqueada`). `ProgressFooter` renders the ring `empty` and omits `srLabel` when `score.value` is `null`.
- Default labels are pt-BR strings exposed as props; the CRM, finance and productivity stories pass English labels, the gamification stories keep the defaults.

## Styling contract

State lives in `data-*` attributes. In this pattern no class is keyed on them (there is no `data-*:` or `group-data-*:` variant and no `cva`): the component picks the class in JS from a plain map, and the attribute is the hook for consumers and tests.

| Attribute | Where | Styled by |
| --- | --- | --- |
| `data-widget="<name>"` | the shell of every card widget, the `section` of `ProgressHud`, the `div` of `ProgressFooter` | consumers; values `achievements`, `activity-feed`, `agenda`, `asset-stat`, `balance`, `budget`, `cash-flow`, `contact`, `deals`, `invoice-status`, `level`, `market-share`, `metric`, `pipeline`, `progress-footer`, `progress-hud`, `project-card`, `quests`, `risk-score`, `streak`, `task-progress`, `transactions`, `upcoming-event`, `world-clock` |
| `data-tone="default\|inverted"` | the shell of `MetricWidget`, `AssetStatWidget`, `TaskProgressWidget` | consumers; the `.dark.contents` scope wrapper applies the inverted theme |
| `data-tone="muted\|primary\|success\|warning"` | `[data-slot=metric-pill]` | `tones` map in `metric-pill.tsx` |
| `data-tone="destructive\|info\|success\|warning"` | `[data-slot=deal-stage]`, `[data-slot=invoice-status-item]`, the `MeterPrimitive.Indicator` of `risk-score-meter` | `stageVariants`, `toneColors`, `indicatorTones` maps in their files; consumers |
| `data-direction="up\|down\|flat"` | `[data-slot=trend-indicator]` | `badgeVariants` and `plainTones` maps in `trend-indicator.tsx`; consumers |
| `data-expanded="true\|false"` | `[data-slot=expandable-list]`; the shell of `TransactionsWidget` | consumers; only present when items exceed `visibleCount` |
| `data-empty="true"` | `[data-slot=progress-ring]` | consumers; the dashed `stroke-input` track is chosen by the `empty` prop |
| `data-over="true"` | `[data-slot=budget-category]` | consumers; `bg-destructive` and `text-destructive-foreground` are chosen in JS |
| `data-kind="credit\|debit"` | `[data-slot=transaction-list-item]` | consumers; `text-success-foreground` and `signDisplay: 'always'` are chosen in JS |
| `data-done="true"` | `[data-slot=quest]` | consumers |
| `data-unlocked="true"` | `[data-slot=achievement]` | consumers |
| `data-active="true"`, `data-today="true"` | each `li` of `[data-slot=streak-week]` | consumers; the `ring-ring` today ring is chosen in JS |
| `data-channel="email\|phone\|whatsapp"` | each `Button` of `[data-slot=contact-channels]` | consumers |

The frame decisions live in `CardWidgetShell` and nowhere else: card radius, border and shadow (root `AGENTS.md`). Two of its classes override the COSS `Card` and are registered in `scripts/override-exceptions.json`, both with `"file": "packages/parttens/src/widgets/shared/card-widget-shell.tsx"` and `"component": "Card"`: `border-border/80` (the widget gives up the Card shadow and needs a lighter border than the Card's; the token stays, at 80%) and `rounded-lg` (the same `--radius` as the Kanban card and column, instead of the Card's `rounded-2xl`). Any change to either class must update its entry or `bun run overrides:check` fails; `shadow-none before:hidden` is a neutral override and needs no entry.

Design axes are plain maps, not `cva`: `sizes` in `avatar-stack.tsx` (`default` is `size-7 text-xs`, `sm` is `size-6 text-[0.625rem]`), `tones` in `metric-pill.tsx`, `badgeVariants` and `plainTones` in `trend-indicator.tsx`, `iconTones` in `activity-timeline.tsx`, `stageVariants` in `deals-widget.tsx`, `toneColors` in `invoice-status-widget.tsx`, `indicatorTones` in `risk-score-widget.tsx`. The only `cva` the widgets render is `iconFrameVariants` in `@tc96/elements/icon-frame` (`shape`, `size`, `variant`). Every class is a complete string. Colors come only from theme tokens (`text-muted-foreground`, `text-success-foreground`, `text-destructive-foreground`, `text-warning-foreground`, `text-info-foreground`, `bg-muted`, `bg-card`, `bg-primary`, `bg-destructive`, `bg-success`, `bg-warning`, `bg-info`, `bg-popover`, `border-border/80`, `border-border/40`, `divide-border/40`, `border-input`, `ring-ring`, `stroke-primary`, `stroke-muted`, `stroke-input`, the `/10` and `/15` tints of `primary`, `success`, `warning` and `info`) and from the CSS variables `--chart-1` to `--chart-5`, `--muted-foreground`, `--border`, `--card`, `--muted`, `--info`, `--destructive`, `--success`, `--warning`, `--warning-foreground`, `--success-foreground`; no palette colors. The `text-[0.625rem]` of the `sm` `AvatarStack` is the single spelling adopted for ~10px text across the patterns, pending a consumer `--text-2xs: 0.625rem` token (decided 2026-10-03, `docs/architecture/tc96-parttens.md`, section "Acessibilidade dos patterns").

The type scale, the shell, the `ExpandableList` rule, the avatar wrapper, the `IconFrame` sizes and the measured contrast ratios of every token used here are recorded in `docs/architecture/tc96-parttens.md`, section "Estrutura interna dos patterns" (the `widgets/` paragraph); read it before changing a size, a tone or the frame, and record a new scale decision there. Refining a widget includes auditing contrast (4.5:1 text, 3:1 graphics, with the numeric ratios), spacing and composition on a light and a dark screenshot of the story (root `AGENTS.md`); token findings are notes for the consumer, not fixes in `packages/ui`.

`data-slot` names set by the pattern: `amount`, `avatar-stack`, `avatar-stack-overflow`, `expandable-list`, `expandable-list-scroll`, `scroll-area-viewport`, `scroll-area-content`, `metric-pill`, `metric-widget-scope`, `progress-ring`, `stat-list`, `trend-indicator`, `widget-period-toggle`; `activity-feed-list`, `activity-feed-item`, `activity-feed-icon`, `activity-feed-empty`, `contact-tags`, `contact-channels`, `deal-list`, `deal-list-item`, `deal-stage`, `deals-empty`, `pipeline-stages`, `pipeline-stage`; `asset-list`, `asset-list-item`, `asset-stat-widget-scope`, `balance-widget-chart`, `budget-list`, `budget-category`, `budget-meter`, `cash-flow-widget-chart`, `cash-flow-legend`, `invoice-status-list`, `invoice-status-item`, `share-bar`, `share-bar-segment`, `risk-score-meter`, `transaction-list`, `transaction-list-item`, `transaction-amount`, `transactions-empty`, `transactions-collapsed`, `transactions-scroll`; `achievement-list`, `achievement`, `progress-footer-score`, `hud-streak`, `hud-achievements`, `quest-list`, `quest`, `quest-meter`, `streak-week`, `xp-meter`; `agenda-events`, `agenda-event`, `agenda-empty`, `project-card-tags`, `project-card-subtasks`, `project-card-progress`, `project-card-meta`, `task-progress-chart`, `task-progress-widget-scope`, `upcoming-event-live`, `upcoming-event-timeline`, `upcoming-event-slot`, `upcoming-event-join`, `upcoming-event-provider`, `world-clock-item`. `card`, `icon-frame` and `meter-indicator` appear in the tests but are set by the COSS `Card`, by `IconFrame` and by the COSS `Meter`.

## Verify

```bash
bun test --isolate packages/parttens/src/widgets
bunx biome check packages/parttens/src/widgets
bun run typecheck && bun run boundaries:check && bun run overrides:check && bun run verify:public-api
cd apps/storybook && bunx vitest run --project=storybook src/patterns/widgets/
```

`bun run test:patterns` (`scripts/test-patterns.ts`) runs the same `bun test --isolate` for `widgets` among the other patterns. The stories live in `apps/storybook/src/patterns/widgets/` and run axe with `test: 'error'`: `Patterns/Widgets/CRM` (`crm.stories.tsx`), `Patterns/Widgets/Finance` (`finance.stories.tsx`), `Patterns/Widgets/Gamification` (`gamification.stories.tsx`) and `Patterns/Widgets/Productivity` (`productivity.stories.tsx`). `crm`, `finance` and `productivity` declare `color-contrast` rule exceptions on specific stories for COSS contrast and for the inverted widget's `muted-foreground`; the reasons are listed in `docs/architecture/tc96-parttens.md`, section "Validação proposta".
