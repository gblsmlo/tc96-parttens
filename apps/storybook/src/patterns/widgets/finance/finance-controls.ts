import type { ArgTypes } from '@storybook/react-vite'
import type { WidgetTone } from '@tc96/ui/patterns'

export const financeWidgetNames = [
  'market-share',
  'balance',
  'budget',
  'cash-flow',
  'transactions',
  'invoice-status',
  'risk-score',
  'asset-stat',
] as const

export type FinanceWidgetName = (typeof financeWidgetNames)[number]

export const financeTones = ['default', 'inverted'] as const

export type FinanceTone = (typeof financeTones)[number]

export const riskTones: readonly WidgetTone[] = [
  'success',
  'warning',
  'destructive',
  'info',
]

export interface FinanceControls {
  action: boolean
  empty: boolean
  periods: boolean
  riskTone: WidgetTone
  title: string
  tone: FinanceTone
  visibleCount: number
  widget: FinanceWidgetName
}

export const financeControlArgs: FinanceControls = {
  action: true,
  empty: false,
  periods: true,
  riskTone: 'success',
  title: '',
  tone: 'default',
  visibleCount: 5,
  widget: 'market-share',
}

export const financeControlArgTypes: Partial<ArgTypes<FinanceControls>> = {
  action: {
    control: 'boolean',
    description:
      'Adds the `action` of the widget: `Send reminders` on `InvoiceStatusWidget`, `Rebalance with AI` on `RiskScoreWidget`, `View all` on `TransactionsWidget` and `BudgetWidget`. The other widgets have no `action`, and `BudgetWidget` drops it while `periods` has items.',
  },
  empty: {
    control: 'boolean',
    description:
      'Passes no items to `TransactionsWidget` (its `emptyLabel` shows), `BudgetWidget` (no categories) and `InvoiceStatusWidget` (no statuses). The other widgets keep their data.',
  },
  periods: {
    control: 'boolean',
    description:
      'Passes `periods` to `MarketShareWidget`, `BalanceWidget`, `BudgetWidget` and `CashFlowWidget`, which adds the period toggle to the header. Each composition keeps its own `period`.',
  },
  riskTone: {
    control: 'inline-radio',
    description:
      'The `tone` of `RiskScoreWidget`: the color of the filled part of the meter. The widget never reads the score to pick it.',
    options: riskTones,
  },
  title: {
    control: 'text',
    description:
      'The `title` of the card. Empty keeps the title of the widget; `AssetStatWidget` has no `title`, its `name` and `symbol` name it.',
  },
  tone: {
    control: 'inline-radio',
    description:
      'The `tone` of `AssetStatWidget`: `inverted` renders the card in the dark palette of the theme. The other widgets of the family have no tone.',
    options: financeTones,
  },
  visibleCount: {
    control: { max: 10, min: 1, type: 'number' },
    description:
      'The `visibleCount` of the list in `TransactionsWidget`, `BudgetWidget` and `InvoiceStatusWidget`: how many rows show before the rest folds under `Ver todas`.',
  },
  widget: {
    control: 'select',
    description: 'Picks the widget of the family to render.',
    options: financeWidgetNames,
  },
}
