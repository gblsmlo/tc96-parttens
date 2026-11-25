import type {
  Dashboard7AccountBalance,
  Dashboard7Balances,
  Dashboard7CashFlowGrid,
  Dashboard7CashFlowMonth,
  Dashboard7CashFlowTotals,
  Dashboard7Category,
  Dashboard7ClientMoney,
  Dashboard7Entry,
  Dashboard7Indicators,
  Dashboard7Receivables,
} from '@tc96/ui/blocks/application/dashboard/dashboard-7'

export const financePeriodOptions = [
  { label: 'Este ano', value: 'year' },
  { label: 'Próximos 12 meses', value: 'next' },
  { label: 'Últimos 12 meses', value: 'last' },
]

export const initialFinancePeriod = 'year'

export const accountOptions = [
  { label: 'Todas as contas', value: 'all' },
  { label: 'Conta principal', value: 'principal' },
  { label: 'Caixa do escritório', value: 'caixa' },
]

export const initialAccount = 'all'

export const balances: Dashboard7Balances = {
  projections: [
    { cents: 2_500_000, date: '2026-12-25' },
    { cents: 2_180_000, date: '2027-01-24' },
    { cents: 1_940_000, date: '2027-02-23' },
  ],
  realizedCents: 3_000_000,
  scope: 'Todas as contas',
}

export const indicators: Dashboard7Indicators = {
  cashMargin: {
    detail: 'receitas menos despesas pagas, de ago. de 2026 até hoje',
    ratio: 0.3,
  },
  collectionDays: {
    days: 21,
    detail: 'dos últimos 3 meses fechados, de ago. a out. de 2026',
  },
  delinquency: {
    detail: 'receitas vencidas em aberto, de ago. a out. de 2026',
    ratio: 0.12,
  },
  runway: {
    detail: 'R$ 12.000,00 por mês, de ago. a out. de 2026',
    text: '2,5 meses',
  },
}

export const cashFlow: Dashboard7CashFlowMonth[] = [
  {
    column: 'realized',
    inflowCents: 4_200_000,
    month: '2026-08',
    outflowCents: 2_900_000,
  },
  {
    column: 'realized',
    inflowCents: 3_800_000,
    month: '2026-09',
    outflowCents: 3_100_000,
  },
  {
    column: 'realized',
    inflowCents: 4_600_000,
    month: '2026-10',
    outflowCents: 3_300_000,
  },
  {
    column: 'current',
    inflowCents: 3_900_000,
    month: '2026-11',
    outflowCents: 3_000_000,
  },
  {
    column: 'forecast',
    inflowCents: 4_100_000,
    month: '2026-12',
    outflowCents: 3_500_000,
  },
  {
    column: 'forecast',
    inflowCents: 3_600_000,
    month: '2027-01',
    outflowCents: 2_800_000,
  },
]

export const cashFlowTotals: Dashboard7CashFlowTotals = {
  inflowCents: 24_200_000,
  outflowCents: 18_600_000,
  resultCents: 5_600_000,
}

export const receivables: Dashboard7Receivables = {
  openCents: 5_000_000,
  overdueCents: 3_000_000,
  receivedCents: 12_400_000,
  totalCents: 20_400_000,
}

export const incomeByCategory: Dashboard7Category[] = [
  { cents: 14_500_000, id: 'income-4', name: 'Honorários', share: 0.6 },
  { cents: 7_200_000, id: 'income-5', name: 'Êxitos', share: 0.3 },
  { cents: 2_500_000, id: 'income-6', name: 'Consultas', share: 0.1 },
]

export const expenseByCategory: Dashboard7Category[] = [
  { cents: 9_300_000, id: 'expense-8', name: 'Folha', share: 0.5 },
  {
    cents: 5_600_000,
    id: 'expense-7',
    name: 'Despesas de escritório',
    share: 0.3,
  },
  {
    cents: 3_700_000,
    id: 'expense-6',
    name: 'Custas processuais',
    share: 0.2,
  },
]

export const dueSoon: Dashboard7Entry[] = [
  {
    amountCents: 60_000,
    description: 'Honorários Silva',
    dueDate: '2026-11-26',
    href: '/financeiro/lancamentos/e1',
    id: 'e1',
    kind: 'Receita',
    status: { label: 'Em aberto', tone: 'info' },
  },
  {
    amountCents: -12_000,
    description: 'Custas do processo',
    dueDate: '2026-11-27',
    href: '/financeiro/lancamentos/e2',
    id: 'e2',
    kind: 'Despesa',
    status: { label: 'Vencido', tone: 'error' },
  },
  {
    amountCents: -5_000,
    description: 'Entre contas',
    dueDate: '2026-11-30',
    href: '/financeiro/lancamentos/e3',
    id: 'e3',
    kind: 'Transferência',
    status: { label: 'Em aberto', tone: 'info' },
  },
]

export const accountBalances: Dashboard7AccountBalance[] = [
  {
    cents: 2_650_000,
    href: '/financeiro/contas/principal',
    id: 'principal',
    name: 'Conta principal',
  },
  {
    cents: 350_000,
    href: '/financeiro/contas/caixa',
    id: 'caixa',
    name: 'Caixa do escritório',
  },
]

export const clientMoney: Dashboard7ClientMoney[] = [
  {
    heldCents: 700_000,
    href: '/contatos/pessoas/4',
    id: 'c4',
    name: 'Maria Silva',
  },
  {
    heldCents: 12_050,
    href: '/contatos/empresas/9',
    id: 'c9',
    name: 'Banco Alfa',
  },
  {
    heldCents: 180_000,
    href: '/contatos/pessoas/11',
    id: 'c11',
    name: 'Helena Prado Siqueira',
  },
  {
    heldCents: 95_500,
    href: '/contatos/pessoas/12',
    id: 'c12',
    name: 'Marcos Vinícius Albuquerque',
  },
  {
    heldCents: 42_000,
    href: '/contatos/empresas/13',
    id: 'c13',
    name: 'Padaria Estrela do Bairro Ltda',
  },
]

export const cashFlowGrid: Dashboard7CashFlowGrid = {
  months: [
    { column: 'realized', month: '2026-08' },
    { column: 'realized', month: '2026-09' },
    { column: 'realized', month: '2026-10' },
    { column: 'current', month: '2026-11' },
    { column: 'forecast', month: '2026-12' },
    { column: 'forecast', month: '2027-01' },
  ],
  rows: [
    {
      cells: [
        10_000_000, 11_300_000, 12_000_000, 13_300_000, 14_200_000, 14_800_000,
      ],
      id: 'previous',
      kind: 'total',
      label: 'Saldo anterior',
    },
    { cells: [], id: 'income', kind: 'section', label: 'Entradas' },
    {
      cells: [3_000_000, 2_600_000, 3_100_000, 2_700_000, 2_900_000, 2_500_000],
      id: 'income:4',
      kind: 'line',
      label: 'Honorários',
      selectable: true,
    },
    {
      cells: [1_200_000, 1_200_000, 1_500_000, 1_200_000, 1_200_000, null],
      id: 'income:5',
      kind: 'line',
      label: 'Êxitos',
      selectable: true,
    },
    { cells: [], id: 'expense', kind: 'section', label: 'Saídas' },
    {
      cells: [-900_000, -1_000_000, -1_100_000, -900_000, -1_300_000, -800_000],
      id: 'expense:6',
      kind: 'line',
      label: 'Custas processuais',
      selectable: true,
    },
    {
      cells: [
        -2_000_000, -2_100_000, -2_200_000, -2_100_000, -2_200_000, -2_000_000,
      ],
      id: 'expense:7',
      kind: 'line',
      label: 'Despesas de escritório',
      selectable: true,
    },
    {
      cells: [1_300_000, 700_000, 1_300_000, 900_000, 600_000, 800_000],
      id: 'period',
      kind: 'total',
      label: 'Saldo do período',
      selectable: true,
    },
    {
      cells: [
        11_300_000, 12_000_000, 13_300_000, 14_200_000, 14_800_000, 15_600_000,
      ],
      id: 'closing',
      kind: 'total',
      label: 'Saldo final',
    },
  ],
}

export const emptyFinance = {
  accountBalances: [],
  balances: undefined,
  cashFlow: [],
  cashFlowGrid: { months: [], rows: [] },
  cashFlowTotals: undefined,
  clientMoney: [],
  dueSoon: [],
  expenseByCategory: [],
  incomeByCategory: [],
  indicators: {},
  receivables: undefined,
}
