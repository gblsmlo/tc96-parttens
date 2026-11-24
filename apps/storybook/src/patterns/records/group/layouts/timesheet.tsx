import {
  ArrowSquareOutIcon,
  CheckCircleIcon,
  DotsThreeIcon,
  PencilSimpleIcon,
  PlusIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { Avatar, AvatarFallback } from '@tc96/ui/avatar'
import { Button } from '@tc96/ui/button'
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@tc96/ui/menu'
import {
  RecordGroup,
  RecordGroupAction,
  RecordGroupFilter,
  RecordGroupItem,
  RecordGroupRow,
  type RecordGroupVariant,
  RecordStatusBadge,
} from '@tc96/ui/patterns'
import { type ReactNode, useState } from 'react'

interface Person {
  initials: string
  name: string
}

type Billing = 'billed' | 'to-bill' | 'non-billable'

type EntriesSort = 'date-desc' | 'date-asc' | 'duration-desc'

interface TimeEntry {
  date: string
  dateLabel: string
  description: string
  href: string
  id: string
  minutes: number
  billing: Billing
  user: Person
}

const ignore = (..._values: unknown[]) => undefined
const onOpenEntry = ignore
const onEditEntry = ignore
const onMarkBilled = ignore
const onDeleteEntry = ignore

const marcos = { initials: 'MR', name: 'Marcos Ribeiro' }
const ana = { initials: 'AS', name: 'Ana Souza' }
const gabriel = { initials: 'GM', name: 'Gabriel Melo' }

const billingStatus = {
  billed: { color: 'var(--success-foreground)', label: 'Faturado' },
  'non-billable': {
    color: 'var(--muted-foreground)',
    label: 'Não faturável',
  },
  'to-bill': { color: 'var(--warning-foreground)', label: 'A faturar' },
} as const

const entries: readonly TimeEntry[] = [
  {
    billing: 'to-bill',
    date: '2026-11-18',
    dateLabel: '18/11',
    description: 'Redação da contestação',
    href: '#/processos/revisional/horas/contestacao',
    id: 'answer',
    minutes: 270,
    user: marcos,
  },
  {
    billing: 'billed',
    date: '2026-11-12',
    dateLabel: '12/11',
    description: 'Reunião com o cliente',
    href: '#/processos/revisional/horas/reuniao',
    id: 'meeting',
    minutes: 90,
    user: gabriel,
  },
  {
    billing: 'non-billable',
    date: '2026-11-14',
    dateLabel: '14/11',
    description: 'Pesquisa de jurisprudência sobre juros remuneratórios',
    href: '#/processos/revisional/horas/pesquisa',
    id: 'research',
    minutes: 45,
    user: ana,
  },
  {
    billing: 'to-bill',
    date: '2026-11-16',
    dateLabel: '16/11',
    description: 'Análise dos extratos bancários',
    href: '#/processos/revisional/horas/extratos',
    id: 'statements',
    minutes: 150,
    user: ana,
  },
  {
    billing: 'billed',
    date: '2026-11-10',
    dateLabel: '10/11',
    description: 'Petição inicial',
    href: '#/processos/revisional/horas/inicial',
    id: 'petition',
    minutes: 195,
    user: marcos,
  },
]

const billingOptions: readonly { label: string; value: Billing }[] = [
  { label: 'Faturado', value: 'billed' },
  { label: 'A faturar', value: 'to-bill' },
  { label: 'Não faturável', value: 'non-billable' },
]

const sortOptions: readonly { label: string; value: EntriesSort }[] = [
  { label: 'Data mais recente', value: 'date-desc' },
  { label: 'Data mais antiga', value: 'date-asc' },
  { label: 'Maior duração', value: 'duration-desc' },
]

const formatMinutes = (total: number) => {
  const hours = Math.floor(total / 60)
  const minutes = total % 60
  if (hours === 0) return `${minutes}min`
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}min`
}

const sumMinutes = (list: readonly TimeEntry[]) =>
  list.reduce((total, entry) => total + entry.minutes, 0)

const totals = [
  ...[marcos, ana, gabriel].map((user) => ({
    label: user.name,
    minutes: sumMinutes(entries.filter((entry) => entry.user === user)),
  })),
  { label: 'Total', minutes: sumMinutes(entries) },
]

const sortEntries = (list: readonly TimeEntry[], sort: EntriesSort) =>
  [...list].sort((a, b) => {
    if (sort === 'duration-desc') return b.minutes - a.minutes
    const byDate = a.date.localeCompare(b.date)
    return sort === 'date-asc' ? byDate : -byDate
  })

export function UserAvatar({ user }: Readonly<{ user: Person }>) {
  return (
    <Avatar
      aria-hidden
      className="[--avatar-size:--spacing(6)] text-[0.625rem]"
    >
      <AvatarFallback>{user.initials}</AvatarFallback>
    </Avatar>
  )
}

export function BillingBadge({ billing }: Readonly<{ billing: Billing }>) {
  const { color, label } = billingStatus[billing]
  return <RecordStatusBadge color={color}>{label}</RecordStatusBadge>
}

export function Muted({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <span className="truncate text-muted-foreground tabular-nums">
      {children}
    </span>
  )
}

export function SummaryGroup({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  return (
    <RecordGroup title={title} variant={variant}>
      {totals.map((total) => (
        <RecordGroupRow align="between" key={total.label} label={total.label}>
          {formatMinutes(total.minutes)}
        </RecordGroupRow>
      ))}
    </RecordGroup>
  )
}

export function EntriesGroup({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  return (
    <RecordGroup
      actions={<RecordGroupAction icon={PlusIcon} label="Lançar horas" />}
      title={title}
      variant={variant}
    >
      {entries.map((entry) => (
        <RecordGroupItem
          key={entry.id}
          leading={<UserAvatar user={entry.user} />}
          title={entry.description}
        >
          <Muted>
            <time dateTime={entry.date}>{entry.dateLabel}</time>
          </Muted>
          <Muted>{formatMinutes(entry.minutes)}</Muted>
          <BillingBadge billing={entry.billing} />
        </RecordGroupItem>
      ))}
    </RecordGroup>
  )
}

export function EntryMenu({ entry }: Readonly<{ entry: TimeEntry }>) {
  return (
    <Menu>
      <MenuTrigger
        aria-label={`Ações de ${entry.description}`}
        render={<Button size="icon-sm" variant="ghost" />}
      >
        <DotsThreeIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        <MenuItem onClick={() => onOpenEntry(entry.id)}>
          <ArrowSquareOutIcon aria-hidden="true" />
          Abrir
        </MenuItem>
        <MenuItem onClick={() => onEditEntry(entry.id)}>
          <PencilSimpleIcon aria-hidden="true" />
          Editar
        </MenuItem>
        {entry.billing === 'to-bill' ? (
          <MenuItem onClick={() => onMarkBilled(entry.id)}>
            <CheckCircleIcon aria-hidden="true" />
            Marcar como faturado
          </MenuItem>
        ) : null}
        <MenuSeparator />
        <MenuItem onClick={() => onDeleteEntry(entry.id)} variant="destructive">
          <TrashIcon aria-hidden="true" />
          Excluir
        </MenuItem>
      </MenuPopup>
    </Menu>
  )
}

export function EntriesMenuGroup({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  const [billings, setBillings] = useState<Billing[]>(
    billingOptions.map((option) => option.value),
  )
  const [sort, setSort] = useState<EntriesSort>('date-desc')
  const visible = sortEntries(
    entries.filter((entry) => billings.includes(entry.billing)),
    sort,
  )

  return (
    <RecordGroup
      actions={
        <>
          <RecordGroupFilter
            filterLabel="Faturamento"
            filterOptions={billingOptions}
            filterValue={billings}
            label="Filtrar e ordenar horas"
            onFilterChange={(next) => setBillings(next as Billing[])}
            onSortChange={(next) => setSort(next as EntriesSort)}
            sortLabel="Ordenar por"
            sortOptions={sortOptions}
            sortValue={sort}
          />
          <RecordGroupAction icon={PlusIcon} label="Lançar horas" />
        </>
      }
      empty={visible.length === 0}
      footer={
        <RecordGroupRow align="between" label="Total">
          {formatMinutes(sumMinutes(visible))}
        </RecordGroupRow>
      }
      title={title}
      variant={variant}
    >
      {visible.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Nenhum lançamento com os status escolhidos
        </p>
      ) : null}
      {visible.map((entry) => (
        <RecordGroupItem
          interactive
          key={entry.id}
          leading={<UserAvatar user={entry.user} />}
          title={
            <a
              className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              data-entry-title=""
              href={entry.href}
            >
              {entry.description}
            </a>
          }
        >
          <Muted>
            <time className="tabular-nums" dateTime={entry.date}>
              {entry.dateLabel}
            </time>{' '}
            · {formatMinutes(entry.minutes)}
          </Muted>
          <BillingBadge billing={entry.billing} />
          <EntryMenu entry={entry} />
        </RecordGroupItem>
      ))}
    </RecordGroup>
  )
}
