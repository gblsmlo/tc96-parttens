import {
  type BalancePoint,
  type BudgetCategory,
  type CashFlowPoint,
  IconFrame,
  type InvoiceStatus,
  type MarketShareSegment,
  type Transaction,
} from '@tc96/parttens'
import { Badge } from '@tc96/ui/badge'
import {
  BriefcaseIcon,
  CarIcon,
  CoffeeIcon,
  HouseIcon,
  ShoppingCartIcon,
  UtensilsIcon,
} from 'lucide-react'

export type MarketPeriod = 'month' | 'week'
export type BalancePeriod = '1m' | '6m' | '1y'
export type BudgetPeriod = 'month' | 'week'
export type CashFlowPeriod = 'quarter' | 'year'

export const brand = {
  bitcoin: '#f7931a',
  ethereum: '#627eea',
  zcash: '#a855f7',
}

export const category = {
  coffee: '#b45309',
  dining: '#d97706',
  groceries: '#0d9488',
  housing: '#2563eb',
  salary: '#059669',
  transport: '#7c3aed',
}

export const marketPeriods = [
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
] as const

export const marketSegments: Record<MarketPeriod, MarketShareSegment[]> = {
  month: [
    {
      change: 0.0044,
      color: brand.bitcoin,
      id: 'btc',
      label: 'Bitcoin',
      value: 66,
    },
    {
      change: 0.0056,
      color: '#7b91f0',
      id: 'eth',
      label: 'Ethereum',
      value: 20,
    },
    {
      change: 0.0102,
      color: 'var(--muted-foreground)',
      id: 'other',
      label: 'Others',
      value: 14,
    },
  ],
  week: [
    {
      change: -0.0021,
      color: brand.bitcoin,
      id: 'btc',
      label: 'Bitcoin',
      value: 61,
    },
    {
      change: 0.0113,
      color: '#7b91f0',
      id: 'eth',
      label: 'Ethereum',
      value: 25,
    },
    {
      change: 0.0038,
      color: 'var(--muted-foreground)',
      id: 'other',
      label: 'Others',
      value: 14,
    },
  ],
}

export const marketRange: Record<MarketPeriod, [string, string]> = {
  month: ['1 May', '31 May'],
  week: ['25 May', '31 May'],
}

export const balancePeriods = [
  { label: '1M', value: '1m' },
  { label: '6M', value: '6m' },
  { label: '1Y', value: '1y' },
] as const

export const balanceSeries: Record<BalancePeriod, BalancePoint[]> = {
  '1m': [
    { label: 'May 1', value: 45120 },
    { label: 'May 8', value: 46380 },
    { label: 'May 15', value: 45710 },
    { label: 'May 22', value: 47240 },
    { label: 'May 31', value: 48250.75 },
  ],
  '6m': [
    { label: 'Dec', value: 38200 },
    { label: 'Jan', value: 39950 },
    { label: 'Feb', value: 37810 },
    { label: 'Mar', value: 42400 },
    { label: 'Apr', value: 44890 },
    { label: 'May', value: 48250.75 },
  ],
  '1y': [
    { label: 'Jun', value: 29800 },
    { label: 'Aug', value: 31750 },
    { label: 'Oct', value: 30420 },
    { label: 'Dec', value: 38200 },
    { label: 'Feb', value: 37810 },
    { label: 'Apr', value: 44890 },
    { label: 'May', value: 48250.75 },
  ],
}

export const balanceChange: Record<BalancePeriod, number> = {
  '1m': 0.0694,
  '6m': 0.2631,
  '1y': 0.6191,
}

export const budgetPeriods = [
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
] as const

export const budgetCategories: Record<BudgetPeriod, BudgetCategory[]> = {
  month: [
    {
      color: category.housing,
      icon: <HouseIcon />,
      id: 'housing',
      label: 'Housing',
      limit: 1800,
      spent: 1800,
    },
    {
      color: category.groceries,
      icon: <ShoppingCartIcon />,
      id: 'groceries',
      label: 'Groceries',
      limit: 600,
      spent: 412.35,
    },
    {
      color: category.dining,
      icon: <UtensilsIcon />,
      id: 'dining',
      label: 'Dining out',
      limit: 250,
      spent: 318.4,
    },
    {
      color: category.transport,
      icon: <CarIcon />,
      id: 'transport',
      label: 'Transport',
      limit: 300,
      spent: 146.2,
    },
  ],
  week: [
    {
      color: category.groceries,
      icon: <ShoppingCartIcon />,
      id: 'groceries',
      label: 'Groceries',
      limit: 150,
      spent: 96.8,
    },
    {
      color: category.dining,
      icon: <UtensilsIcon />,
      id: 'dining',
      label: 'Dining out',
      limit: 60,
      spent: 74.5,
    },
    {
      color: category.transport,
      icon: <CarIcon />,
      id: 'transport',
      label: 'Transport',
      limit: 75,
      spent: 32,
    },
  ],
}

export const transactions: Transaction[] = [
  {
    amount: 4850,
    icon: (
      <IconFrame color={category.salary} shape="rounded">
        <BriefcaseIcon />
      </IconFrame>
    ),
    id: 'salary',
    meta: 'Salary · May 30',
    name: 'Northwind Labs',
    status: <Badge variant="success">Cleared</Badge>,
  },
  {
    amount: -1800,
    icon: (
      <IconFrame color={category.housing} shape="rounded">
        <HouseIcon />
      </IconFrame>
    ),
    id: 'rent',
    meta: 'Housing · May 31',
    name: 'Rent',
  },
  {
    amount: -86.4,
    icon: (
      <IconFrame color={category.groceries} shape="rounded">
        <ShoppingCartIcon />
      </IconFrame>
    ),
    id: 'market',
    meta: 'Groceries · Jun 1',
    name: 'Whole Market',
  },
  {
    amount: -5.75,
    icon: (
      <IconFrame color={category.coffee} shape="rounded">
        <CoffeeIcon />
      </IconFrame>
    ),
    id: 'coffee',
    meta: 'Dining out · Jun 2',
    name: 'Corner Coffee',
    status: <Badge variant="secondary">Pending</Badge>,
  },
  {
    amount: -42.9,
    icon: (
      <IconFrame color={category.transport} shape="rounded">
        <CarIcon />
      </IconFrame>
    ),
    id: 'fuel',
    meta: 'Transport · Jun 2',
    name: 'Shell Station',
  },
  {
    amount: -64.2,
    icon: (
      <IconFrame color={category.dining} shape="rounded">
        <UtensilsIcon />
      </IconFrame>
    ),
    id: 'dinner',
    meta: 'Dining out · Jun 3',
    name: 'Osteria Nova',
  },
  {
    amount: 320.5,
    icon: (
      <IconFrame color={category.salary} shape="rounded">
        <BriefcaseIcon />
      </IconFrame>
    ),
    id: 'freelance',
    meta: 'Freelance · Jun 4',
    name: 'Design sprint',
  },
  {
    amount: -129,
    icon: (
      <IconFrame color={category.groceries} shape="rounded">
        <ShoppingCartIcon />
      </IconFrame>
    ),
    id: 'market-2',
    meta: 'Groceries · Jun 6',
    name: 'Farmers Market',
  },
  {
    amount: -18.5,
    icon: (
      <IconFrame color={category.transport} shape="rounded">
        <CarIcon />
      </IconFrame>
    ),
    id: 'parking',
    meta: 'Transport · Jun 7',
    name: 'City Parking',
  },
  {
    amount: -210,
    icon: (
      <IconFrame color={category.housing} shape="rounded">
        <HouseIcon />
      </IconFrame>
    ),
    id: 'utilities',
    meta: 'Housing · Jun 8',
    name: 'Utilities',
    status: <Badge variant="secondary">Pending</Badge>,
  },
]

export const cashFlowPeriods = [
  { label: 'Quarter', value: 'quarter' },
  { label: 'Year', value: 'year' },
] as const

export const cashFlowSeries: Record<CashFlowPeriod, CashFlowPoint[]> = {
  quarter: [
    { expenses: 38200, income: 52400, label: 'Mar' },
    { expenses: 41650, income: 48900, label: 'Apr' },
    { expenses: 36980, income: 57300, label: 'May' },
  ],
  year: [
    { expenses: 112400, income: 141200, label: 'Q1' },
    { expenses: 118900, income: 139600, label: 'Q2' },
    { expenses: 124300, income: 158750, label: 'Q3' },
    { expenses: 131050, income: 171900, label: 'Q4' },
  ],
}

export const invoiceStatuses: InvoiceStatus[] = [
  { count: 18, id: 'paid', label: 'Paid', tone: 'success', value: 64200 },
  { count: 7, id: 'due', label: 'Due', tone: 'warning', value: 23850 },
  {
    count: 3,
    id: 'overdue',
    label: 'Overdue',
    tone: 'destructive',
    value: 9400,
  },
  { count: 4, id: 'draft', label: 'Draft', tone: 'info', value: 6100 },
]
