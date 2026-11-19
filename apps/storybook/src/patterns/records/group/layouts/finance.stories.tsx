import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarFallback } from '@tc96/elements/avatar'
import { IconFrame } from '@tc96/elements/icon-frame'
import {
  RecordGroup,
  RecordGroupAction,
  RecordGroupDivider,
  RecordGroupFilter,
  RecordGroupItem,
  RecordGroupLink,
  RecordGroupRow,
  RecordGroupSubgroup,
  type RecordGroupVariant,
  RecordStatusBadge,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@tc96/ui/menu'
import {
  ArrowDownLeftIcon,
  ArrowLeftRightIcon,
  ArrowUpRightIcon,
  BanIcon,
  CircleCheckIcon,
  ClockIcon,
  EllipsisIcon,
  ExternalLinkIcon,
  HandCoinsIcon,
  LandmarkIcon,
  type LucideIcon,
  PaperclipIcon,
  PlusIcon,
  QrCodeIcon,
  ReceiptTextIcon,
  Undo2Icon,
} from 'lucide-react'
import { type ComponentType, Fragment, type ReactNode, useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../../.storybook/docs-page.tsx'
import { recordGroupArgTypes } from '../../../../test-utils/story-arg-types'

interface FinanceArgs {
  variant: RecordGroupVariant
}

type Direction = 'in' | 'out' | 'transfer'

type Situation = 'open' | 'overdue' | 'settled' | 'renegotiated' | 'canceled'

interface FinanceEntry {
  amountCents: number
  date: string
  description: string
  dueOn: string
  direction: Direction
  href: string
  id: string
  situation: Situation
}

interface Installment {
  amountCents: number
  due: string
  href: string
  id: string
  number: number
  situation: Situation
}

interface Expense {
  amountCents: number
  date: string
  description: string
  href: string
  id: string
  receipts: number
  reimbursable: boolean
  settled: boolean
}

const hidden = { table: { disable: true } } as const
const onOpenEntry = fn()
const onSettleEntry = fn()
const onIssueCharge = fn()
const onReverseEntry = fn()
const onCancelEntry = fn()
const onAddReceipt = fn()
const onAddFinance = fn()

const money = new Intl.NumberFormat('pt-BR', {
  currency: 'BRL',
  style: 'currency',
})

const formatCents = (cents: number) => money.format(cents / 100)

const directionIcon = {
  in: ArrowDownLeftIcon,
  out: ArrowUpRightIcon,
  transfer: ArrowLeftRightIcon,
} as const

const situationStatus = {
  canceled: {
    color: 'var(--muted-foreground)',
    label: 'Cancelado',
  },
  open: {
    color: 'var(--muted-foreground)',
    label: 'Em aberto',
  },
  overdue: {
    color: 'var(--destructive-foreground)',
    label: 'Vencido',
  },
  renegotiated: {
    color: 'var(--muted-foreground)',
    label: 'Renegociado',
  },
  settled: {
    color: 'var(--success-foreground)',
    label: 'Quitado',
  },
} as const

const entries: readonly FinanceEntry[] = [
  {
    amountCents: 250_000,
    date: '10/11/2026',
    dueOn: '2026-11-10',
    description: 'Honorários contratuais',
    direction: 'in',
    href: '#/financeiro/lancamentos/honorarios-novembro',
    id: 'fee',
    situation: 'overdue',
  },
  {
    amountCents: 38_550,
    date: '12/11/2026',
    dueOn: '2026-11-12',
    description: 'Custas de distribuição',
    direction: 'out',
    href: '#/financeiro/lancamentos/custas',
    id: 'court-costs',
    situation: 'settled',
  },
  {
    amountCents: 500_000,
    date: '14/11/2026',
    dueOn: '2026-11-14',
    description: 'Repasse ao cliente',
    direction: 'transfer',
    href: '#/financeiro/lancamentos/repasse',
    id: 'client-transfer',
    situation: 'settled',
  },
  {
    amountCents: 1_250_000,
    date: '05/12/2026',
    dueOn: '2026-12-05',
    description: 'Honorários de êxito da ação revisional bancária',
    direction: 'in',
    href: '#/financeiro/lancamentos/exito',
    id: 'success-fee',
    situation: 'open',
  },
]

type EntriesSort = 'due-asc' | 'due-desc' | 'amount-desc'

const directionOptions: readonly { label: string; value: Direction }[] = [
  { label: 'Entradas', value: 'in' },
  { label: 'Saídas', value: 'out' },
  { label: 'Transferências', value: 'transfer' },
]

const entriesSortOptions: readonly { label: string; value: EntriesSort }[] = [
  { label: 'Vencimento mais próximo', value: 'due-asc' },
  { label: 'Vencimento mais distante', value: 'due-desc' },
  { label: 'Maior valor', value: 'amount-desc' },
]

function useEntriesView() {
  const [directions, setDirections] = useState<Direction[]>(
    directionOptions.map((option) => option.value),
  )
  const [sort, setSort] = useState<EntriesSort>('due-asc')
  const visible = entries
    .filter((entry) => directions.includes(entry.direction))
    .sort((a, b) => {
      if (sort === 'amount-desc') return b.amountCents - a.amountCents
      const byDue = a.dueOn.localeCompare(b.dueOn)
      return sort === 'due-desc' ? -byDue : byDue
    })
  const filter = (
    <RecordGroupFilter
      filterLabel="Tipo"
      filterOptions={directionOptions}
      filterValue={directions}
      label="Filtrar e ordenar lançamentos"
      onFilterChange={(next) => setDirections(next as Direction[])}
      onSortChange={(next) => setSort(next as EntriesSort)}
      sortLabel="Ordenar por"
      sortOptions={entriesSortOptions}
      sortValue={sort}
    />
  )
  return { filter, visible }
}

function EmptyEntries({ show }: Readonly<{ show: boolean }>) {
  return show ? (
    <p className="text-muted-foreground text-sm">
      Nenhum lançamento com os tipos escolhidos
    </p>
  ) : null
}

const summary = [
  { cents: 750_000, label: 'Recebido' },
  { cents: 1_000_000, label: 'Em aberto' },
  { cents: 250_000, label: 'Vencido' },
  { cents: 1_250_000, label: 'A faturar' },
] as const

const installments: readonly Installment[] = (
  [
    {
      amountCents: 250_000,
      due: '10/09/2026',
      number: 1,
      situation: 'settled',
    },
    {
      amountCents: 250_000,
      due: '10/10/2026',
      number: 2,
      situation: 'settled',
    },
    {
      amountCents: 250_000,
      due: '10/11/2026',
      number: 3,
      situation: 'overdue',
    },
    { amountCents: 250_000, due: '10/12/2026', number: 4, situation: 'open' },
    { amountCents: 250_000, due: '10/01/2027', number: 5, situation: 'open' },
    { amountCents: 250_000, due: '10/02/2027', number: 6, situation: 'open' },
  ] satisfies Omit<Installment, 'href' | 'id'>[]
).map((installment) => ({
  ...installment,
  href: `#/financeiro/lancamentos/parcela-${installment.number}`,
  id: `installment-${installment.number}`,
}))

const expenses: readonly Expense[] = [
  {
    amountCents: 38_550,
    date: '12/11/2026',
    description: 'Custas de distribuição',
    href: '#/financeiro/lancamentos/custas',
    id: 'court-costs',
    receipts: 2,
    reimbursable: true,
    settled: true,
  },
  {
    amountCents: 12_000,
    date: '14/11/2026',
    description: 'Cópias autenticadas',
    href: '#/financeiro/lancamentos/copias',
    id: 'copies',
    receipts: 1,
    reimbursable: true,
    settled: false,
  },
  {
    amountCents: 21_490,
    date: '18/11/2026',
    description: 'Deslocamento para audiência',
    href: '#/financeiro/lancamentos/deslocamento',
    id: 'travel',
    receipts: 0,
    reimbursable: false,
    settled: false,
  },
]

interface Person {
  initials: string
  name: string
}

type Billing = 'billed' | 'to-bill' | 'non-billable'

interface TimeEntry {
  billing: Billing
  date: string
  dateLabel: string
  description: string
  href: string
  id: string
  minutes: number
  user: Person
}

type Risk = 'probable' | 'possible' | 'remote'

interface Reimbursement {
  amountCents: number
  description: string
  href: string
  id: string
  reimbursed: boolean
}

type FinanceSection =
  | 'fees'
  | 'entries'
  | 'expenses'
  | 'hours'
  | 'valuation'
  | 'reimbursements'

const marcos = { initials: 'MR', name: 'Marcos Ribeiro' }
const ana = { initials: 'AS', name: 'Ana Souza' }
const gabriel = { initials: 'GM', name: 'Gabriel Melo' }

const hourlyRateCents = 40_000

const billingStatus = {
  billed: { color: 'var(--success-foreground)', label: 'Faturado' },
  'non-billable': {
    color: 'var(--muted-foreground)',
    label: 'Não faturável',
  },
  'to-bill': { color: 'var(--warning-foreground)', label: 'A faturar' },
} as const

const timeEntries: readonly TimeEntry[] = [
  {
    billing: 'to-bill',
    date: '2026-11-18',
    dateLabel: '18/11',
    description: 'Redação da contestação',
    href: '#/financeiro/horas/contestacao',
    id: 'answer',
    minutes: 270,
    user: marcos,
  },
  {
    billing: 'to-bill',
    date: '2026-11-16',
    dateLabel: '16/11',
    description: 'Análise dos extratos bancários',
    href: '#/financeiro/horas/extratos',
    id: 'statements',
    minutes: 150,
    user: ana,
  },
  {
    billing: 'non-billable',
    date: '2026-11-14',
    dateLabel: '14/11',
    description: 'Pesquisa de jurisprudência sobre juros remuneratórios',
    href: '#/financeiro/horas/pesquisa',
    id: 'research',
    minutes: 45,
    user: ana,
  },
  {
    billing: 'billed',
    date: '2026-11-12',
    dateLabel: '12/11',
    description: 'Reunião com o cliente',
    href: '#/financeiro/horas/reuniao',
    id: 'meeting',
    minutes: 90,
    user: gabriel,
  },
]

const formatMinutes = (total: number) => {
  const hours = Math.floor(total / 60)
  const minutes = total % 60
  if (hours === 0) return `${minutes}min`
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}min`
}

const hoursTotals = (
  [
    { billing: 'to-bill', label: 'A faturar' },
    { billing: 'billed', label: 'Faturado' },
  ] as const
).map(({ billing, label }) => {
  const minutes = timeEntries
    .filter((entry) => entry.billing === billing)
    .reduce((total, entry) => total + entry.minutes, 0)
  return {
    label,
    value: `${formatMinutes(minutes)} · ${formatCents((minutes / 60) * hourlyRateCents)}`,
  }
})

const riskStatus = {
  possible: { color: 'var(--warning-foreground)', label: 'Possível' },
  probable: { color: 'var(--destructive-foreground)', label: 'Provável' },
  remote: { color: 'var(--success-foreground)', label: 'Remoto' },
} as const

const valuation = [
  { cents: 18_000_000, label: 'Valor da causa' },
  { cents: 21_348_000, label: 'Valor corrigido' },
  { cents: 10_674_000, label: 'Provisão' },
] as const

const risk: Risk = 'possible'

const reimbursements: readonly Reimbursement[] = [
  {
    amountCents: 38_550,
    description: 'Cobrança de reembolso nº 12',
    href: '#/financeiro/reembolsos/12',
    id: 'reimbursement-12',
    reimbursed: true,
  },
  {
    amountCents: 12_000,
    description: 'Cobrança de reembolso nº 13',
    href: '#/financeiro/reembolsos/13',
    id: 'reimbursement-13',
    reimbursed: false,
  },
]

const reimbursementStatus = (reimbursed: boolean) =>
  reimbursed
    ? { color: 'var(--success-foreground)', label: 'Reembolsado' }
    : { color: 'var(--warning-foreground)', label: 'A reembolsar' }

const sectionOptions: readonly { label: string; value: FinanceSection }[] = [
  { label: 'Honorários', value: 'fees' },
  { label: 'Lançamentos', value: 'entries' },
  { label: 'Despesas', value: 'expenses' },
  { label: 'Horas', value: 'hours' },
  { label: 'Valores e provisão', value: 'valuation' },
  { label: 'Reembolsos', value: 'reimbursements' },
]

const sumCents = (list: readonly Expense[]) =>
  list.reduce((total, expense) => total + expense.amountCents, 0)

const expenseTotals = [
  {
    cents: sumCents(expenses.filter((e) => e.reimbursable && e.settled)),
    label: 'Reembolsado',
  },
  {
    cents: sumCents(expenses.filter((e) => e.reimbursable && !e.settled)),
    label: 'A reembolsar',
  },
  { cents: sumCents(expenses), label: 'Total' },
]

const usage = `
import { IconFrame } from '@acme/elements/icon-frame'
import {
  RecordGroup,
  RecordGroupAction,
  RecordGroupLink,
  RecordGroupRow,
  RecordStatusBadge,
} from '@acme/patterns'

<RecordGroup title="Fees">
  {totals.map((total) => (
    <RecordGroupRow align="between" key={total.label} label={total.label}>
      {formatCents(total.cents)}
    </RecordGroupRow>
  ))}
</RecordGroup>

<RecordGroup
  actions={<RecordGroupAction icon={PlusIcon} label="Add entry" onClick={addEntry} />}
  title="Entries"
>
  {entries.map((entry) => (
    <RecordGroupLink
      href={entry.url}
      key={entry.id}
      leading={
        <IconFrame color={situationColor[entry.situation]} shape="rounded" size="xs">
          <DirectionIcon direction={entry.direction} />
        </IconFrame>
      }
      meta={
        <span className="flex items-center gap-2">
          {formatCents(entry.amountCents)}
          <RecordStatusBadge color={situationColor[entry.situation]}>
            {situationLabel[entry.situation]}
          </RecordStatusBadge>
        </span>
      }
    >
      {entry.description}
    </RecordGroupLink>
  ))}
</RecordGroup>
`

const docs = {
  api: [
    {
      description:
        'Totals (received, open, overdue, to bill) are `RecordGroupRow` with `align="between"`: the label on the left and the amount the consumer formats on the right. The same rows sit in the `footer` when the totals close a list, as in `Expenses`.',
      name: 'RecordGroupRow',
    },
    {
      description:
        'An entry or an installment that opens its own page is a `RecordGroupLink`: an `IconFrame` `xs` in `leading` whose icon is the direction (in, out, transfer) and whose color is the situation, the description as content and, in `meta`, the amount and the situation as a `RecordStatusBadge`. One color per situation (success when settled, destructive when overdue, muted otherwise) feeds both the frame and the badge. The badge is text, so the link name reads the description, the amount and the situation.',
      name: 'RecordGroupLink',
    },
    {
      description:
        'A row with a menu is a `RecordGroupItem`, since a link row cannot hold a button: the description is a link in `title`, and `children` holds the amount, the situation or the date, and the three-dots button. The menu offers the actions the situation allows, such as Quitar for an open entry and Estornar for a settled one.',
      name: 'RecordGroupItem',
    },
  ],
  description: {
    component:
      'The finance of a record (a contract, a case, a lawsuit or a contact), modeled on the Lemind finance groups. The consumer computes every total and every situation and formats every amount; the pattern only lays the rows out. Generic: `Summary` totals the money of the record, `Entries` lists its entries with the direction, the amount and the situation, with a `RecordGroupFilter` in `actions` that filters by direction and sorts by due date or amount, `With Menu` adds the actions of each entry, and `With Filter And Menu` puts both together. `Grouped` is one `Financeiro` group whose children are collapsible `RecordGroupSubgroup`s split by `RecordGroupDivider`: Honorários, Lançamentos and Despesas, then three subgroups still planned in Lemind: Horas (the timesheet of US-23 and US-F20, each entry with its billing status, closed by the hours and amounts to bill and billed), Valores e provisão (US-24: the claim value, the corrected value, the provision and the risk as a `RecordStatusBadge`) and Reembolsos (the reimbursement charges sent to the client for the reimbursable expenses). The header holds a `RecordGroupFilter` whose `Exibir` section picks the subgroups (the story drops the divider of a hidden one, as `Layouts/Matter` does) and the only `+`, whose menu groups what can be added: the entry types and hours under Lançamento, a court release under Processo. Specific: `Installments` lists the installments of a contract (`N de M` and the amount, then the due date and the situation), and `Expenses` lists the expenses of a case with their situation and receipts and closes with the reimbursement totals in the `footer`. `Behavior` is under test.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

function SituationFrame({
  icon: Icon,
  situation,
}: Readonly<{ icon: LucideIcon; situation: Situation }>) {
  return (
    <IconFrame
      color={situationStatus[situation].color}
      shape="rounded"
      size="xs"
    >
      <Icon aria-hidden />
    </IconFrame>
  )
}

function SituationBadge({ situation }: Readonly<{ situation: Situation }>) {
  const { color, label } = situationStatus[situation]
  return <RecordStatusBadge color={color}>{label}</RecordStatusBadge>
}

function TitleLink({
  children,
  href,
}: Readonly<{ children: ReactNode; href: string }>) {
  return (
    <a
      className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      href={href}
    >
      {children}
    </a>
  )
}

function RowMenu({
  children,
  label,
}: Readonly<{ children: ReactNode; label: string }>) {
  return (
    <Menu>
      <MenuTrigger
        aria-label={label}
        render={<Button size="icon-sm" variant="ghost" />}
      >
        <EllipsisIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">{children}</MenuPopup>
    </Menu>
  )
}

function SummaryGroup({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  return (
    <RecordGroup title={title} variant={variant}>
      {summary.map((total) => (
        <RecordGroupRow align="between" key={total.label} label={total.label}>
          {formatCents(total.cents)}
        </RecordGroupRow>
      ))}
    </RecordGroup>
  )
}

function EntriesGroup({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  const { filter, visible } = useEntriesView()

  return (
    <RecordGroup
      actions={
        <>
          {filter}
          <RecordGroupAction icon={PlusIcon} label="Adicionar lançamento" />
        </>
      }
      empty={visible.length === 0}
      title={title}
      variant={variant}
    >
      <EmptyEntries show={visible.length === 0} />
      {visible.map((entry) => (
        <RecordGroupLink
          href={entry.href}
          key={entry.id}
          leading={
            <SituationFrame
              icon={directionIcon[entry.direction]}
              situation={entry.situation}
            />
          }
          meta={
            <span className="flex items-center gap-2">
              {formatCents(entry.amountCents)}
              <SituationBadge situation={entry.situation} />
            </span>
          }
        >
          {entry.description}
        </RecordGroupLink>
      ))}
    </RecordGroup>
  )
}

function EntriesMenuGroup({
  title,
  variant,
  withFilter = false,
}: Readonly<{
  title: string
  variant: RecordGroupVariant
  withFilter?: boolean
}>) {
  const { filter, visible } = useEntriesView()
  const rows = withFilter ? visible : entries

  return (
    <RecordGroup
      actions={
        <>
          {withFilter ? filter : null}
          <RecordGroupAction icon={PlusIcon} label="Adicionar lançamento" />
        </>
      }
      empty={rows.length === 0}
      title={title}
      variant={variant}
    >
      <EmptyEntries show={rows.length === 0} />
      {rows.map((entry) => {
        const open = entry.situation === 'open' || entry.situation === 'overdue'
        return (
          <RecordGroupItem
            interactive
            key={entry.id}
            leading={
              <SituationFrame
                icon={directionIcon[entry.direction]}
                situation={entry.situation}
              />
            }
            title={<TitleLink href={entry.href}>{entry.description}</TitleLink>}
          >
            <span className="truncate text-muted-foreground">
              {formatCents(entry.amountCents)}
            </span>
            <SituationBadge situation={entry.situation} />
            <RowMenu label={`Ações de ${entry.description}`}>
              <MenuItem onClick={() => onOpenEntry(entry.id)}>
                <ExternalLinkIcon aria-hidden="true" />
                Abrir
              </MenuItem>
              {open ? (
                <>
                  <MenuItem onClick={() => onSettleEntry(entry.id)}>
                    <CircleCheckIcon aria-hidden="true" />
                    Quitar
                  </MenuItem>
                  {entry.direction === 'in' ? (
                    <MenuItem onClick={() => onIssueCharge(entry.id)}>
                      <QrCodeIcon aria-hidden="true" />
                      Emitir cobrança
                    </MenuItem>
                  ) : null}
                  <MenuSeparator />
                  <MenuItem
                    onClick={() => onCancelEntry(entry.id)}
                    variant="destructive"
                  >
                    <BanIcon aria-hidden="true" />
                    Cancelar lançamento
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuSeparator />
                  <MenuItem
                    onClick={() => onReverseEntry(entry.id)}
                    variant="destructive"
                  >
                    <Undo2Icon aria-hidden="true" />
                    Estornar
                  </MenuItem>
                </>
              )}
            </RowMenu>
          </RecordGroupItem>
        )
      })}
    </RecordGroup>
  )
}

function InstallmentsGroup({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  return (
    <RecordGroup title={title} variant={variant}>
      {installments.map((installment) => (
        <RecordGroupLink
          href={installment.href}
          key={installment.id}
          leading={
            <SituationFrame
              icon={directionIcon.in}
              situation={installment.situation}
            />
          }
          meta={
            <span className="flex items-center gap-2">
              {installment.due}
              <SituationBadge situation={installment.situation} />
            </span>
          }
        >
          {`${installment.number} de ${installments.length} · ${formatCents(installment.amountCents)}`}
        </RecordGroupLink>
      ))}
    </RecordGroup>
  )
}

function ExpensesGroup({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  return (
    <RecordGroup
      actions={<RecordGroupAction icon={PlusIcon} label="Adicionar despesa" />}
      footer={expenseTotals.map((total) => (
        <RecordGroupRow align="between" key={total.label} label={total.label}>
          {formatCents(total.cents)}
        </RecordGroupRow>
      ))}
      title={title}
      variant={variant}
    >
      {expenses.map((expense) => (
        <RecordGroupItem
          interactive
          key={expense.id}
          leading={
            <SituationFrame
              icon={ReceiptTextIcon}
              situation={expense.settled ? 'settled' : 'open'}
            />
          }
          title={
            <TitleLink href={expense.href}>{expense.description}</TitleLink>
          }
        >
          <span className="truncate text-muted-foreground">
            {formatCents(-expense.amountCents)}
          </span>
          <SituationBadge situation={expense.settled ? 'settled' : 'open'} />
          <RowMenu label={`Ações de ${expense.description}`}>
            <MenuItem onClick={() => onOpenEntry(expense.id)}>
              <ExternalLinkIcon aria-hidden="true" />
              Abrir
            </MenuItem>
            <MenuItem onClick={() => onAddReceipt(expense.id)}>
              <PaperclipIcon aria-hidden="true" />
              {expense.receipts === 0
                ? 'Adicionar comprovante'
                : `Adicionar comprovante (${expense.receipts})`}
            </MenuItem>
            {expense.settled ? (
              <>
                <MenuSeparator />
                <MenuItem
                  onClick={() => onReverseEntry(expense.id)}
                  variant="destructive"
                >
                  <Undo2Icon aria-hidden="true" />
                  Estornar
                </MenuItem>
              </>
            ) : null}
          </RowMenu>
        </RecordGroupItem>
      ))}
    </RecordGroup>
  )
}

const addGroups: readonly {
  items: readonly { icon: LucideIcon; label: string; value: string }[]
  label: string
}[] = [
  {
    items: [
      { icon: ArrowDownLeftIcon, label: 'Receita', value: 'income' },
      { icon: ArrowUpRightIcon, label: 'Despesa', value: 'expense' },
      { icon: ArrowLeftRightIcon, label: 'Transferência', value: 'transfer' },
      { icon: ClockIcon, label: 'Lançar horas', value: 'time-entry' },
    ],
    label: 'Lançamento',
  },
  {
    items: [
      { icon: LandmarkIcon, label: 'Registrar alvará', value: 'court-release' },
    ],
    label: 'Processo',
  },
]

function AddFinanceMenu() {
  return (
    <Menu>
      <MenuTrigger
        aria-label="Adicionar ao financeiro"
        render={<Button size="icon-sm" variant="ghost" />}
      >
        <PlusIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        {addGroups.map((group, index) => (
          <MenuGroup key={group.label}>
            {index > 0 ? <MenuSeparator /> : null}
            <MenuGroupLabel>{group.label}</MenuGroupLabel>
            {group.items.map(({ icon: Icon, label, value }) => (
              <MenuItem key={value} onClick={() => onAddFinance(value)}>
                <Icon aria-hidden="true" />
                {label}
              </MenuItem>
            ))}
          </MenuGroup>
        ))}
      </MenuPopup>
    </Menu>
  )
}

function UserAvatar({ user }: Readonly<{ user: Person }>) {
  return (
    <Avatar aria-hidden size="sm">
      <AvatarFallback>{user.initials}</AvatarFallback>
    </Avatar>
  )
}

function TotalRows({
  totals,
}: Readonly<{ totals: readonly { label: string; value: string }[] }>) {
  return totals.map((total) => (
    <RecordGroupRow align="between" key={total.label} label={total.label}>
      {total.value}
    </RecordGroupRow>
  ))
}

const centsTotals = (list: readonly { cents: number; label: string }[]) =>
  list.map((total) => ({ label: total.label, value: formatCents(total.cents) }))

function GroupedFinance({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  const [sections, setSections] = useState<FinanceSection[]>(
    sectionOptions.map((option) => option.value),
  )
  const children: { content: ReactNode; key: FinanceSection }[] = [
    {
      content: (
        <RecordGroupSubgroup
          count={summary.length}
          defaultOpen
          title="Honorários"
        >
          <TotalRows totals={centsTotals(summary)} />
        </RecordGroupSubgroup>
      ),
      key: 'fees' as const,
    },
    {
      content: (
        <RecordGroupSubgroup count={entries.length} title="Lançamentos">
          {entries.map((entry) => (
            <RecordGroupLink
              href={entry.href}
              key={entry.id}
              leading={
                <SituationFrame
                  icon={directionIcon[entry.direction]}
                  situation={entry.situation}
                />
              }
              meta={
                <span className="flex items-center gap-2">
                  {formatCents(entry.amountCents)}
                  <SituationBadge situation={entry.situation} />
                </span>
              }
            >
              {entry.description}
            </RecordGroupLink>
          ))}
        </RecordGroupSubgroup>
      ),
      key: 'entries' as const,
    },
    {
      content: (
        <RecordGroupSubgroup count={expenses.length} title="Despesas">
          {expenses.map((expense) => (
            <RecordGroupLink
              href={expense.href}
              key={expense.id}
              leading={
                <SituationFrame
                  icon={ReceiptTextIcon}
                  situation={expense.settled ? 'settled' : 'open'}
                />
              }
              meta={
                <span className="flex items-center gap-2">
                  {formatCents(-expense.amountCents)}
                  <SituationBadge
                    situation={expense.settled ? 'settled' : 'open'}
                  />
                </span>
              }
            >
              {expense.description}
            </RecordGroupLink>
          ))}
          <TotalRows totals={centsTotals(expenseTotals)} />
        </RecordGroupSubgroup>
      ),
      key: 'expenses' as const,
    },
    {
      content: (
        <RecordGroupSubgroup count={timeEntries.length} title="Horas">
          {timeEntries.map((entry) => (
            <RecordGroupItem
              interactive
              key={entry.id}
              leading={<UserAvatar user={entry.user} />}
              title={
                <TitleLink href={entry.href}>{entry.description}</TitleLink>
              }
            >
              <span className="truncate text-muted-foreground tabular-nums">
                <time dateTime={entry.date}>{entry.dateLabel}</time> ·{' '}
                {formatMinutes(entry.minutes)}
              </span>
              <RecordStatusBadge color={billingStatus[entry.billing].color}>
                {billingStatus[entry.billing].label}
              </RecordStatusBadge>
            </RecordGroupItem>
          ))}
          <TotalRows totals={hoursTotals} />
        </RecordGroupSubgroup>
      ),
      key: 'hours' as const,
    },
    {
      content: (
        <RecordGroupSubgroup title="Valores e provisão">
          <TotalRows totals={centsTotals(valuation)} />
          <RecordGroupRow align="between" label="Risco">
            <RecordStatusBadge color={riskStatus[risk].color}>
              {riskStatus[risk].label}
            </RecordStatusBadge>
          </RecordGroupRow>
        </RecordGroupSubgroup>
      ),
      key: 'valuation' as const,
    },
    {
      content: (
        <RecordGroupSubgroup count={reimbursements.length} title="Reembolsos">
          {reimbursements.map((reimbursement) => {
            const status = reimbursementStatus(reimbursement.reimbursed)
            return (
              <RecordGroupItem
                interactive
                key={reimbursement.id}
                leading={
                  <SituationFrame
                    icon={HandCoinsIcon}
                    situation={reimbursement.reimbursed ? 'settled' : 'open'}
                  />
                }
                title={
                  <TitleLink href={reimbursement.href}>
                    {reimbursement.description}
                  </TitleLink>
                }
              >
                <span className="truncate text-muted-foreground">
                  {formatCents(reimbursement.amountCents)}
                </span>
                <RecordStatusBadge color={status.color}>
                  {status.label}
                </RecordStatusBadge>
              </RecordGroupItem>
            )
          })}
        </RecordGroupSubgroup>
      ),
      key: 'reimbursements' as const,
    },
  ].filter((child) => sections.includes(child.key))

  return (
    <RecordGroup
      actions={
        <>
          <RecordGroupFilter
            label="Filtrar o financeiro"
            sections={[
              {
                label: 'Exibir',
                onChange: (next) => setSections(next as FinanceSection[]),
                options: sectionOptions,
                value: sections,
              },
            ]}
          />
          <AddFinanceMenu />
        </>
      }
      empty={children.length === 0}
      title={title}
      variant={variant}
    >
      {children.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Nada a exibir com os filtros escolhidos
        </p>
      ) : null}
      {children.map((child, index) => (
        <Fragment key={child.key}>
          {index > 0 ? <RecordGroupDivider /> : null}
          {child.content}
        </Fragment>
      ))}
    </RecordGroup>
  )
}

const meta = {
  args: { variant: 'plain' },
  argTypes: { variant: recordGroupArgTypes.variant },
  component: RecordGroupLink as unknown as ComponentType<FinanceArgs>,
  decorators: [
    (Story) => (
      <div className="w-96 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  title: 'Patterns/Records/Group/Layouts/Finance',
} satisfies Meta<FinanceArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Summary: Story = {
  render: ({ variant }) => (
    <SummaryGroup title="Honorários" variant={variant} />
  ),
}

export const Entries: Story = {
  render: ({ variant }) => (
    <EntriesGroup title="Lançamentos" variant={variant} />
  ),
}

export const WithMenu: Story = {
  render: ({ variant }) => (
    <EntriesMenuGroup title="Lançamentos" variant={variant} />
  ),
}

export const WithFilterAndMenu: Story = {
  render: ({ variant }) => (
    <EntriesMenuGroup title="Lançamentos" variant={variant} withFilter />
  ),
}

export const Grouped: Story = {
  render: ({ variant }) => (
    <GroupedFinance title="Financeiro" variant={variant} />
  ),
}

export const Installments: Story = {
  render: ({ variant }) => (
    <InstallmentsGroup title="Parcelas" variant={variant} />
  ),
}

export const Expenses: Story = {
  render: ({ variant }) => <ExpensesGroup title="Despesas" variant={variant} />,
}

const rowsFit = async (region: HTMLElement) => {
  for (const row of region.querySelectorAll<HTMLElement>(
    '[data-slot="record-group-row"], [data-slot="record-group-item"], [data-slot="record-group-link"]',
  )) {
    await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth)
  }
}

const menuItemsFor = async (
  group: ReturnType<typeof within>,
  label: string,
) => {
  await userEvent.click(group.getByRole('button', { name: label }))
  const items = (await screen.findAllByRole('menuitem')).map(
    (item) => item.textContent,
  )
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  return items
}

export const Behavior: Story = {
  argTypes: { variant: hidden },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const summaryRegion = canvas.getByRole('region', { name: 'Honorários' })
    const entriesRegion = canvas.getByRole('region', { name: 'Lançamentos' })
    const menuRegion = canvas.getByRole('region', {
      name: 'Lançamentos com menu',
    })
    const installmentsRegion = canvas.getByRole('region', { name: 'Parcelas' })
    const expensesRegion = canvas.getByRole('region', { name: 'Despesas' })

    for (const region of [
      summaryRegion,
      entriesRegion,
      menuRegion,
      installmentsRegion,
      expensesRegion,
    ]) {
      await rowsFit(region)
    }

    const terms = within(summaryRegion).getAllByRole('term')
    await expect(terms.map((term) => term.textContent)).toEqual(
      summary.map((total) => total.label),
    )
    await expect(
      within(summaryRegion)
        .getAllByRole('definition')
        .map((value) => value.textContent),
    ).toEqual(summary.map((total) => formatCents(total.cents)))

    const entryLinks = within(entriesRegion).getAllByRole('link')
    for (const [index, entry] of entries.entries()) {
      await expect(entryLinks[index]).toHaveAccessibleName(
        `${entry.description} ${formatCents(entry.amountCents)} ${situationStatus[entry.situation].label}`,
      )
      await expect(entryLinks[index]).toHaveAttribute('href', entry.href)
    }
    const probe = document.createElement('span')
    canvasElement.append(probe)
    for (const [index, link] of entryLinks.entries()) {
      const frame = link.querySelector(
        '[data-slot="icon-frame"]',
      ) as HTMLElement
      const badge = link.querySelector('[data-slot="badge"]') as HTMLElement
      const status = situationStatus[entries[index]?.situation ?? 'open']
      probe.style.color = status.color
      await expect(getComputedStyle(frame).color).toBe(
        getComputedStyle(probe).color,
      )
      await expect(badge.getAttribute('style')).toContain(status.color)
    }
    probe.remove()
    for (const badge of canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="badge"]',
    )) {
      await expect(badge.getBoundingClientRect().height).toBe(
        (
          canvasElement.querySelector('[data-slot="badge"]') as HTMLElement
        ).getBoundingClientRect().height,
      )
    }
    const longName = (entryLinks[3] as HTMLElement).querySelector(
      '[data-slot="record-group-link-name"]',
    ) as HTMLElement
    await expect(longName.scrollWidth).toBeGreaterThan(longName.clientWidth)

    const menuGroup = within(menuRegion)
    await expect(
      await menuItemsFor(menuGroup, 'Ações de Honorários contratuais'),
    ).toEqual(['Abrir', 'Quitar', 'Emitir cobrança', 'Cancelar lançamento'])
    await expect(
      await menuItemsFor(menuGroup, 'Ações de Custas de distribuição'),
    ).toEqual(['Abrir', 'Estornar'])
    onSettleEntry.mockClear()
    await userEvent.click(
      menuGroup.getByRole('button', {
        name: 'Ações de Honorários contratuais',
      }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Quitar' }),
    )
    await expect(onSettleEntry).toHaveBeenCalledWith('fee')

    const filterRegion = canvas.getByRole('region', {
      name: 'Lançamentos com filtro e menu',
    })
    const filterGroup = within(filterRegion)
    const titlesIn = () =>
      [
        ...filterRegion.querySelectorAll('[data-slot="record-group-item"] a'),
      ].map((link) => link.textContent)
    await userEvent.click(
      filterGroup.getByRole('button', {
        name: 'Filtrar e ordenar lançamentos',
      }),
    )
    const dialog = within(await screen.findByRole('dialog'))
    await userEvent.click(dialog.getByRole('checkbox', { name: 'Saídas' }))
    await userEvent.click(
      dialog.getByRole('checkbox', { name: 'Transferências' }),
    )
    await userEvent.click(dialog.getByRole('radio', { name: 'Maior valor' }))
    await expect(titlesIn()).toEqual([
      'Honorários de êxito da ação revisional bancária',
      'Honorários contratuais',
    ])
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(
      await menuItemsFor(
        filterGroup,
        'Ações de Honorários de êxito da ação revisional bancária',
      ),
    ).toEqual(['Abrir', 'Quitar', 'Emitir cobrança', 'Cancelar lançamento'])

    const installmentLinks = within(installmentsRegion).getAllByRole('link')
    await expect(installmentLinks).toHaveLength(installments.length)
    await expect(installmentLinks[2]).toHaveAccessibleName(
      `3 de 6 · ${formatCents(250_000)} 10/11/2026 Vencido`,
    )

    const footer = expensesRegion.querySelector(
      '[data-slot="record-group-footer"]',
    ) as HTMLElement
    const totals = within(footer).getAllByRole('term')
    await expect(totals.map((term) => term.textContent)).toEqual([
      'Reembolsado',
      'A reembolsar',
      'Total',
    ])
    await expect(
      within(footer)
        .getAllByRole('definition')
        .map((value) => value.textContent),
    ).toEqual(expenseTotals.map((total) => formatCents(total.cents)))
    await expect(
      await menuItemsFor(
        within(expensesRegion),
        'Ações de Deslocamento para audiência',
      ),
    ).toEqual(['Abrir', 'Adicionar comprovante'])

    const groupedRegion = canvas.getByRole('region', { name: 'Financeiro' })
    const grouped = within(groupedRegion)
    const headings = () =>
      grouped.queryAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    await expect(headings()).toEqual([
      `Honorários${summary.length}`,
      `Lançamentos${entries.length}`,
      `Despesas${expenses.length}`,
      `Horas${timeEntries.length}`,
      'Valores e provisão',
      `Reembolsos${reimbursements.length}`,
    ])
    await expect(grouped.getAllByRole('separator')).toHaveLength(5)
    const header = groupedRegion.querySelector(
      '[data-slot="record-group-header"]',
    ) as HTMLElement
    await expect(
      grouped
        .getAllByRole('button')
        .filter((button) => button.getAttribute('aria-haspopup') === 'menu'),
    ).toHaveLength(1)
    await expect(
      within(header)
        .getAllByRole('button')
        .map((button) => button.getAttribute('aria-label'))
        .filter(Boolean),
    ).toEqual(['Filtrar o financeiro', 'Adicionar ao financeiro'])
    onAddFinance.mockClear()
    await userEvent.click(
      within(header).getByRole('button', { name: 'Adicionar ao financeiro' }),
    )
    const addMenuElement = await screen.findByRole('menu')
    await waitFor(() => expect(addMenuElement).toBeVisible())
    const addMenu = within(addMenuElement)
    await expect(addMenu.getAllByRole('group')).toHaveLength(addGroups.length)
    await expect(
      addMenu.getAllByRole('menuitem').map((item) => item.textContent),
    ).toEqual(addGroups.flatMap((g) => g.items.map((item) => item.label)))
    await userEvent.click(addMenu.getByRole('menuitem', { name: 'Despesa' }))
    await expect(onAddFinance).toHaveBeenCalledWith('expense')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    for (const [name, value] of [
      ['Lançar horas', 'time-entry'],
      ['Registrar alvará', 'court-release'],
    ]) {
      await userEvent.click(
        within(header).getByRole('button', {
          name: 'Adicionar ao financeiro',
        }),
      )
      await userEvent.click(await screen.findByRole('menuitem', { name }))
      await expect(onAddFinance).toHaveBeenLastCalledWith(value)
      await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    }

    await expect(grouped.queryAllByRole('link')).toHaveLength(0)
    await userEvent.click(
      grouped.getByRole('button', { name: `Lançamentos ${entries.length}` }),
    )
    const groupedLinks = await grouped.findAllByRole('link')
    await expect(groupedLinks).toHaveLength(entries.length)

    await userEvent.click(
      grouped.getByRole('button', { name: `Horas ${timeEntries.length}` }),
    )
    for (const entry of timeEntries) {
      const link = await grouped.findByRole('link', {
        name: entry.description,
      })
      await expect(link).toHaveAttribute('href', entry.href)
      const row = link.closest('[data-slot="record-group-item"]') as HTMLElement
      await expect(row).toHaveAttribute('data-interactive', 'true')
      await expect(row.textContent).toContain(
        `${entry.dateLabel} · ${formatMinutes(entry.minutes)}${billingStatus[entry.billing].label}`,
      )
    }
    const hoursPanel = (
      grouped
        .getByRole('link', { name: 'Redação da contestação' })
        .closest('[data-slot="collapsible-panel"]') as HTMLElement
    ).querySelectorAll('[data-slot="record-group-row"]')
    await expect([...hoursPanel].map((row) => row.textContent)).toEqual(
      hoursTotals.map((total) => `${total.label}${total.value}`),
    )

    await userEvent.click(
      grouped.getByRole('button', { name: 'Valores e provisão' }),
    )
    const riskTerm = await grouped.findByText('Risco', {
      selector: 'dt span',
    })
    const valuationPanel = riskTerm.closest(
      '[data-slot="collapsible-panel"]',
    ) as HTMLElement
    await expect(
      within(valuationPanel)
        .getAllByRole('term')
        .map((term) => term.textContent),
    ).toEqual([...valuation.map((total) => total.label), 'Risco'])
    await expect(
      within(valuationPanel)
        .getAllByRole('definition')
        .slice(0, valuation.length)
        .map((value) => value.textContent),
    ).toEqual(valuation.map((total) => formatCents(total.cents)))
    const riskRow = riskTerm.closest('dl') as HTMLElement
    const riskBadge = riskRow.querySelector(
      '[data-slot="badge"]',
    ) as HTMLElement
    await expect(riskBadge).toHaveTextContent(riskStatus[risk].label)
    await expect(riskBadge.getAttribute('style')).toContain(
      riskStatus[risk].color,
    )

    await userEvent.click(
      grouped.getByRole('button', {
        name: `Reembolsos ${reimbursements.length}`,
      }),
    )
    for (const reimbursement of reimbursements) {
      const link = await grouped.findByRole('link', {
        name: reimbursement.description,
      })
      await expect(link).toHaveAttribute('href', reimbursement.href)
      await expect(
        (link.closest('[data-slot="record-group-item"]') as HTMLElement)
          .textContent,
      ).toContain(
        `${formatCents(reimbursement.amountCents)}${reimbursementStatus(reimbursement.reimbursed).label}`,
      )
    }
    for (const expense of expenses) {
      await expect(
        grouped.queryByRole('link', { name: expense.description }),
      ).toBeNull()
    }

    await rowsFit(groupedRegion)
    for (const row of groupedRegion.querySelectorAll<HTMLElement>(
      '[data-slot="collapsible-panel"] [data-slot="record-group-row"], [data-slot="collapsible-panel"] [data-slot="record-group-item"], [data-slot="collapsible-panel"] [data-slot="record-group-link"]',
    )) {
      const panel = row.closest(
        '[data-slot="collapsible-panel"]',
      ) as HTMLElement
      await expect(row.getBoundingClientRect().right).toBeLessThanOrEqual(
        panel.getBoundingClientRect().right + 0.5,
      )
    }

    await userEvent.click(
      within(header).getByRole('button', { name: 'Filtrar o financeiro' }),
    )
    const filterDialogElement = await screen.findByRole('dialog')
    await waitFor(() => expect(filterDialogElement).toBeVisible())
    const show = within(
      within(filterDialogElement).getByRole('group', { name: 'Exibir' }),
    )
    await expect(
      show
        .getAllByRole('checkbox')
        .map((box) => box.getAttribute('aria-checked')),
    ).toEqual(sectionOptions.map(() => 'true'))
    for (const option of ['Valores e provisão', 'Reembolsos']) {
      await userEvent.click(show.getByRole('checkbox', { name: option }))
    }
    await expect(headings()).toEqual([
      `Honorários${summary.length}`,
      `Lançamentos${entries.length}`,
      `Despesas${expenses.length}`,
      `Horas${timeEntries.length}`,
    ])
    await expect(grouped.getAllByRole('separator')).toHaveLength(3)
    await userEvent.click(show.getByRole('checkbox', { name: 'Honorários' }))
    await expect(headings()).toEqual([
      `Lançamentos${entries.length}`,
      `Despesas${expenses.length}`,
      `Horas${timeEntries.length}`,
    ])
    await expect(grouped.getAllByRole('separator')).toHaveLength(2)
    for (const option of ['Lançamentos', 'Despesas', 'Horas']) {
      await userEvent.click(show.getByRole('checkbox', { name: option }))
    }
    await expect(headings()).toHaveLength(0)
    await expect(grouped.queryAllByRole('separator')).toHaveLength(0)
    await expect(groupedRegion).toHaveAttribute('data-empty', 'true')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <SummaryGroup title="Honorários" variant="plain" />
      <EntriesGroup title="Lançamentos" variant="plain" />
      <EntriesMenuGroup title="Lançamentos com menu" variant="plain" />
      <EntriesMenuGroup
        title="Lançamentos com filtro e menu"
        variant="plain"
        withFilter
      />
      <InstallmentsGroup title="Parcelas" variant="plain" />
      <ExpensesGroup title="Despesas" variant="plain" />
      <GroupedFinance title="Financeiro" variant="plain" />
    </div>
  ),
}
