import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarFallback } from '@tc96/elements/avatar'
import {
  RecordGroup,
  RecordGroupAction,
  RecordGroupFilter,
  RecordGroupItem,
  RecordGroupRow,
  type RecordGroupVariant,
  RecordStatusBadge,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@tc96/ui/menu'
import {
  CircleCheckIcon,
  EllipsisIcon,
  ExternalLinkIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from 'lucide-react'
import { type ComponentType, type ReactNode, useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../../.storybook/docs-page.tsx'
import { recordGroupArgTypes } from '../../../../test-utils/story-arg-types'

interface TimesheetArgs {
  variant: RecordGroupVariant
}

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

const hidden = { table: { disable: true } } as const
const onOpenEntry = fn()
const onEditEntry = fn()
const onMarkBilled = fn()
const onDeleteEntry = fn()

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

const usage = `
import { Avatar, AvatarFallback } from '@acme/elements/avatar'
import { RecordGroup, RecordGroupItem, RecordGroupRow, RecordStatusBadge } from '@acme/patterns'

<RecordGroup title="Hours">
  {totals.map((total) => (
    <RecordGroupRow align="between" key={total.label} label={total.label}>
      {formatMinutes(total.minutes)}
    </RecordGroupRow>
  ))}
</RecordGroup>

<RecordGroup
  footer={<RecordGroupRow align="between" label="Total">{formatMinutes(visibleMinutes)}</RecordGroupRow>}
  title="Time entries"
>
  {visible.map((entry) => (
    <RecordGroupItem
      key={entry.id}
      leading={
        <Avatar aria-hidden size="sm">
          <AvatarFallback>{entry.user.initials}</AvatarFallback>
        </Avatar>
      }
      title={entry.description}
    >
      <span className="text-muted-foreground">{formatMinutes(entry.minutes)}</span>
      <RecordStatusBadge color={billingColor[entry.billing]}>
        {billingLabel[entry.billing]}
      </RecordStatusBadge>
    </RecordGroupItem>
  ))}
</RecordGroup>
`

const docs = {
  api: [
    {
      description:
        'The hours of each user and the total are `RecordGroupRow` with `align="between"`: the name on the left and the hours the consumer formats (`12h 30min`) on the right. The same row closes a list of entries in the `footer`, totalling only the visible entries.',
      name: 'RecordGroupRow',
    },
    {
      description:
        'A time entry is a `RecordGroupItem`: the user `Avatar` (`sm`, 24px) in `leading`, the description as `title`, truncating first, and in `children` the date, the duration and the billing status as a `RecordStatusBadge` (success when billed, warning when to bill, muted when not billable). With a menu the description is a link and the date moves before it, so the trailing part keeps the duration, the badge and the three-dots button within half the row.',
      name: 'RecordGroupItem',
    },
    {
      description:
        'Filters by billing status and sorts by date or duration. The story keeps both values, passes the matching entries and recomputes the footer total; with none left it passes `empty` and a line of text.',
      name: 'RecordGroupFilter',
    },
  ],
  description: {
    component:
      'The hours logged on a case, from the Lemind time tracking stories (US-23: hours per case and per user; US-F20: billable hours feed the client charge). `Summary` totals the hours per user and overall. `Entries` lists each entry with the user, the description, the date, the duration and the billing status. `With Menu` adds the actions of each entry (`Marcar como faturado` only for an entry to bill) and a `RecordGroupFilter` by billing status and by date or duration, with the total of the visible entries in the `footer`. The pattern never sums, filters or formats; the story does. `Behavior` is under test.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

function UserAvatar({ user }: Readonly<{ user: Person }>) {
  return (
    <Avatar aria-hidden size="sm">
      <AvatarFallback>{user.initials}</AvatarFallback>
    </Avatar>
  )
}

function BillingBadge({ billing }: Readonly<{ billing: Billing }>) {
  const { color, label } = billingStatus[billing]
  return <RecordStatusBadge color={color}>{label}</RecordStatusBadge>
}

function Muted({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <span className="truncate text-muted-foreground tabular-nums">
      {children}
    </span>
  )
}

function SummaryGroup({
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

function EntriesGroup({
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

function EntryMenu({ entry }: Readonly<{ entry: TimeEntry }>) {
  return (
    <Menu>
      <MenuTrigger
        aria-label={`Ações de ${entry.description}`}
        render={<Button size="icon-sm" variant="ghost" />}
      >
        <EllipsisIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        <MenuItem onClick={() => onOpenEntry(entry.id)}>
          <ExternalLinkIcon aria-hidden="true" />
          Abrir
        </MenuItem>
        <MenuItem onClick={() => onEditEntry(entry.id)}>
          <PencilIcon aria-hidden="true" />
          Editar
        </MenuItem>
        {entry.billing === 'to-bill' ? (
          <MenuItem onClick={() => onMarkBilled(entry.id)}>
            <CircleCheckIcon aria-hidden="true" />
            Marcar como faturado
          </MenuItem>
        ) : null}
        <MenuSeparator />
        <MenuItem onClick={() => onDeleteEntry(entry.id)} variant="destructive">
          <Trash2Icon aria-hidden="true" />
          Excluir
        </MenuItem>
      </MenuPopup>
    </Menu>
  )
}

function EntriesMenuGroup({
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

const meta = {
  args: { variant: 'plain' },
  argTypes: { variant: recordGroupArgTypes.variant },
  component: RecordGroupItem as unknown as ComponentType<TimesheetArgs>,
  decorators: [
    (Story) => (
      <div className="w-96 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  title: 'Patterns/Records/Group/Layouts/Timesheet',
} satisfies Meta<TimesheetArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Summary: Story = {
  render: ({ variant }) => <SummaryGroup title="Horas" variant={variant} />,
}

export const Entries: Story = {
  render: ({ variant }) => (
    <EntriesGroup title="Lançamentos de horas" variant={variant} />
  ),
}

export const WithMenu: Story = {
  render: ({ variant }) => (
    <EntriesMenuGroup title="Lançamentos de horas" variant={variant} />
  ),
}

const rowsFit = async (region: HTMLElement) => {
  for (const row of region.querySelectorAll<HTMLElement>(
    '[data-slot="record-group-row"], [data-slot="record-group-item"]',
  )) {
    await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth)
  }
}

const menuItemsFor = async (
  group: ReturnType<typeof within>,
  label: string,
) => {
  await userEvent.click(group.getByRole('button', { name: label }))
  const menu = await screen.findByRole('menu')
  await waitFor(() => expect(menu).toBeVisible())
  const items = within(menu)
    .getAllByRole('menuitem')
    .map((item) => item.textContent)
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  return items
}

const entryTitlesIn = (region: HTMLElement) =>
  Array.from(
    region.querySelectorAll('[data-entry-title]'),
    (title) => title.textContent,
  )

const footerTotalOf = (region: HTMLElement) =>
  (
    region.querySelector(
      '[data-slot="record-group-footer"] [data-slot="record-group-row-value"]',
    ) as HTMLElement
  ).textContent

export const Behavior: Story = {
  argTypes: { variant: hidden },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const summaryRegion = canvas.getByRole('region', { name: 'Horas' })
    const entriesRegion = canvas.getByRole('region', {
      name: 'Lançamentos de horas',
    })
    const menuRegion = canvas.getByRole('region', {
      name: 'Lançamentos com menu',
    })

    await expect(
      within(summaryRegion)
        .getAllByRole('term')
        .map((term) => term.textContent),
    ).toEqual(['Marcos Ribeiro', 'Ana Souza', 'Gabriel Melo', 'Total'])
    await expect(
      within(summaryRegion)
        .getAllByRole('definition')
        .map((value) => value.textContent),
    ).toEqual(['7h 45min', '3h 15min', '1h 30min', '12h 30min'])

    const badges = Array.from(
      entriesRegion.querySelectorAll<HTMLElement>('[data-slot="badge"]'),
    )
    await expect(badges.map((badge) => badge.textContent)).toEqual(
      entries.map((entry) => billingStatus[entry.billing].label),
    )
    for (const [index, badge] of badges.entries()) {
      const entry = entries[index] as TimeEntry
      await expect(badge).toHaveAttribute('data-color', 'custom')
      await expect(badge.getAttribute('style')).toContain(
        billingStatus[entry.billing].color,
      )
    }
    await expect(
      Array.from(entriesRegion.querySelectorAll('time'), (time) =>
        time.getAttribute('datetime'),
      ),
    ).toEqual(entries.map((entry) => entry.date))
    const longTitle = entriesRegion.querySelectorAll<HTMLElement>(
      '[data-slot="record-group-item-title"]',
    )[2] as HTMLElement
    await expect(longTitle.scrollWidth).toBeGreaterThan(longTitle.clientWidth)

    const menuGroup = within(menuRegion)
    await expect(
      await menuItemsFor(menuGroup, 'Ações de Redação da contestação'),
    ).toEqual(['Abrir', 'Editar', 'Marcar como faturado', 'Excluir'])
    await expect(
      await menuItemsFor(menuGroup, 'Ações de Reunião com o cliente'),
    ).toEqual(['Abrir', 'Editar', 'Excluir'])
    await expect(
      await menuItemsFor(
        menuGroup,
        'Ações de Pesquisa de jurisprudência sobre juros remuneratórios',
      ),
    ).toEqual(['Abrir', 'Editar', 'Excluir'])
    onMarkBilled.mockClear()
    await userEvent.click(
      menuGroup.getByRole('button', {
        name: 'Ações de Análise dos extratos bancários',
      }),
    )
    const menu = await screen.findByRole('menu')
    await waitFor(() => expect(menu).toBeVisible())
    await userEvent.click(
      within(menu).getByRole('menuitem', { name: 'Marcar como faturado' }),
    )
    await expect(onMarkBilled).toHaveBeenCalledWith('statements')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())

    await expect(entryTitlesIn(menuRegion)).toEqual(
      sortEntries(entries, 'date-desc').map((entry) => entry.description),
    )
    await expect(footerTotalOf(menuRegion)).toBe('12h 30min')

    await userEvent.click(
      menuGroup.getByRole('button', { name: 'Filtrar e ordenar horas' }),
    )
    const dialogElement = await screen.findByRole('dialog')
    await waitFor(() => expect(dialogElement).toBeVisible())
    const dialog = within(dialogElement)
    await userEvent.click(dialog.getByRole('checkbox', { name: 'Faturado' }))
    await userEvent.click(
      dialog.getByRole('checkbox', { name: 'Não faturável' }),
    )
    await expect(entryTitlesIn(menuRegion)).toEqual([
      'Redação da contestação',
      'Análise dos extratos bancários',
    ])
    await expect(footerTotalOf(menuRegion)).toBe('7h')
    await userEvent.click(
      dialog.getByRole('radio', { name: 'Data mais antiga' }),
    )
    await expect(entryTitlesIn(menuRegion)).toEqual([
      'Análise dos extratos bancários',
      'Redação da contestação',
    ])
    await userEvent.click(dialog.getByRole('checkbox', { name: 'Faturado' }))
    await userEvent.click(dialog.getByRole('radio', { name: 'Maior duração' }))
    await expect(entryTitlesIn(menuRegion)).toEqual([
      'Redação da contestação',
      'Petição inicial',
      'Análise dos extratos bancários',
      'Reunião com o cliente',
    ])
    await expect(footerTotalOf(menuRegion)).toBe('11h 45min')
    await userEvent.click(dialog.getByRole('checkbox', { name: 'Faturado' }))
    await userEvent.click(dialog.getByRole('checkbox', { name: 'A faturar' }))
    await expect(entryTitlesIn(menuRegion)).toEqual([])
    await expect(menuRegion).toHaveAttribute('data-empty', 'true')
    await expect(
      menuGroup.getByText('Nenhum lançamento com os status escolhidos'),
    ).toBeInTheDocument()
    await expect(footerTotalOf(menuRegion)).toBe('0min')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())

    for (const region of [summaryRegion, entriesRegion, menuRegion]) {
      await rowsFit(region)
    }
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <SummaryGroup title="Horas" variant="plain" />
      <EntriesGroup title="Lançamentos de horas" variant="plain" />
      <EntriesMenuGroup title="Lançamentos com menu" variant="plain" />
    </div>
  ),
}
