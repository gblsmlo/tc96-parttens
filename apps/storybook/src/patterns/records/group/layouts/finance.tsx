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
import { Fragment, type ReactNode, useState } from 'react'

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

const ignore = (..._values: unknown[]) => undefined
const onOpenEntry = ignore
const onSettleEntry = ignore
const onIssueCharge = ignore
const onReverseEntry = ignore
const onCancelEntry = ignore
const onAddReceipt = ignore
const onAddFinance = ignore

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

export function useEntriesView() {
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

export function EmptyEntries({ show }: Readonly<{ show: boolean }>) {
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

export function SituationFrame({
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

export function SituationBadge({
  situation,
}: Readonly<{ situation: Situation }>) {
  const { color, label } = situationStatus[situation]
  return <RecordStatusBadge color={color}>{label}</RecordStatusBadge>
}

export function TitleLink({
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

export function RowMenu({
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

export function SummaryGroup({
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

export function EntriesGroup({
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

export function EntriesMenuGroup({
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

export function InstallmentsGroup({
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

export function ExpensesGroup({
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

export function AddFinanceMenu() {
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

export function UserAvatar({ user }: Readonly<{ user: Person }>) {
  return (
    <Avatar aria-hidden size="sm">
      <AvatarFallback>{user.initials}</AvatarFallback>
    </Avatar>
  )
}

export function TotalRows({
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

export function GroupedFinance({
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
