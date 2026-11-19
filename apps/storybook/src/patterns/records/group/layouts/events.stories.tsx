import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconFrame } from '@tc96/elements/icon-frame'
import {
  RecordGroup,
  RecordGroupAction,
  RecordGroupFilter,
  RecordGroupItem,
  RecordGroupLink,
  type RecordGroupVariant,
  RecordStatusBadge,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import {
  Menu,
  MenuItem,
  MenuLinkItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@tc96/ui/menu'
import {
  BanIcon,
  CalendarClockIcon,
  CopyIcon,
  EllipsisIcon,
  ExternalLinkIcon,
  MapPinIcon,
  PhoneIcon,
  PlusIcon,
  VideoIcon,
} from 'lucide-react'
import { type ComponentType, type ReactNode, useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../../.storybook/docs-page.tsx'
import { recordGroupArgTypes } from '../../../../test-utils/story-arg-types'

interface EventsArgs {
  variant: RecordGroupVariant
}

type Modality = 'in_person' | 'video' | 'phone'

type EventStatus = 'scheduled' | 'today' | 'cancelled' | 'done'

type EventsPeriod = 'upcoming' | 'past'

type EventsSort = 'date-asc' | 'date-desc'

interface AgendaEvent {
  href: string
  id: string
  location?: string
  meetingUrl?: string
  modality: Modality
  startsAt: string
  status: EventStatus
  time: string
  title: string
}

const hidden = { table: { disable: true } } as const
const onOpenEvent = fn()
const onCopyAddress = fn()
const onRescheduleEvent = fn()
const onAddEvent = fn()

const today = '2026-11-19'

const modalityIcon = {
  in_person: MapPinIcon,
  phone: PhoneIcon,
  video: VideoIcon,
} as const

const modalityColor = {
  in_person: '#ea580c',
  phone: '#059669',
  video: '#2563eb',
} as const

const eventStatus = {
  cancelled: { color: 'var(--muted-foreground)', label: 'Cancelado' },
  done: { color: 'var(--success-foreground)', label: 'Realizado' },
  scheduled: { color: 'var(--info-foreground)', label: 'Agendado' },
  today: { color: 'var(--warning-foreground)', label: 'Hoje' },
} as const

const modalityOptions: readonly { label: string; value: Modality }[] = [
  { label: 'Presencial', value: 'in_person' },
  { label: 'Vídeo', value: 'video' },
  { label: 'Telefone', value: 'phone' },
]

const periodOptions: readonly { label: string; value: EventsPeriod }[] = [
  { label: 'Próximos', value: 'upcoming' },
  { label: 'Passados', value: 'past' },
]

const sortOptions: readonly { label: string; value: EventsSort }[] = [
  { label: 'Data mais próxima', value: 'date-asc' },
  { label: 'Data mais distante', value: 'date-desc' },
]

const events: readonly AgendaEvent[] = [
  {
    href: '#/agenda/audiencia-de-conciliacao',
    id: 'conciliation',
    location: 'Fórum Central, sala 304',
    modality: 'in_person',
    startsAt: '2026-11-19T14:00',
    status: 'today',
    time: '19/11 14:00',
    title: 'Audiência de conciliação',
  },
  {
    href: '#/agenda/reuniao-com-o-cliente',
    id: 'client-meeting',
    meetingUrl: 'https://meet.example.com/abc-defg-hij',
    modality: 'video',
    startsAt: '2026-11-27T10:30',
    status: 'scheduled',
    time: '27/11 10:30',
    title: 'Reunião com o cliente',
  },
  {
    href: '#/agenda/ligacao-com-o-perito',
    id: 'expert-call',
    modality: 'phone',
    startsAt: '2026-12-02T09:00',
    status: 'scheduled',
    time: '02/12 09:00',
    title: 'Ligação com o perito',
  },
  {
    href: '#/agenda/audiencia-de-instrucao',
    id: 'instruction',
    location: 'Fórum Central, sala 210',
    modality: 'in_person',
    startsAt: '2026-12-10T15:00',
    status: 'cancelled',
    time: '10/12 15:00',
    title: 'Audiência de instrução e julgamento',
  },
  {
    href: '#/agenda/reuniao-de-alinhamento',
    id: 'alignment',
    meetingUrl: 'https://meet.example.com/xyz-abcd-efg',
    modality: 'video',
    startsAt: '2026-11-12T16:00',
    status: 'done',
    time: '12/11 16:00',
    title: 'Reunião de alinhamento',
  },
  {
    href: '#/agenda/sessao-de-mediacao',
    id: 'mediation',
    location: 'Cejusc, sala 2',
    modality: 'in_person',
    startsAt: '2026-11-05T09:30',
    status: 'done',
    time: '05/11 09:30',
    title: 'Sessão de mediação',
  },
]

const isPast = (event: AgendaEvent) => event.startsAt.slice(0, 10) < today

const upcoming = events
  .filter((event) => !isPast(event))
  .sort((a, b) => a.startsAt.localeCompare(b.startsAt))

const usage = `
import { IconFrame } from '@acme/elements/icon-frame'
import {
  RecordGroup,
  RecordGroupAction,
  RecordGroupLink,
  RecordStatusBadge,
} from '@acme/patterns'

<RecordGroup
  actions={<RecordGroupAction icon={PlusIcon} label="Schedule event" onClick={schedule} />}
  title="Events"
>
  {events.map((event) => (
    <RecordGroupLink
      href={event.url}
      key={event.id}
      leading={
        <IconFrame color={modalityColor[event.modality]} shape="rounded" size="xs">
          <ModalityIcon modality={event.modality} />
        </IconFrame>
      }
      meta={
        <span className="flex items-center gap-2">
          {formatTime(event.startsAt)}
          <RecordStatusBadge color={statusColor[event.status]}>
            {statusLabel[event.status]}
          </RecordStatusBadge>
        </span>
      }
    >
      {event.title}
    </RecordGroupLink>
  ))}
</RecordGroup>
`

const docs = {
  api: [
    {
      description:
        'An event that opens its own page: an `IconFrame` `xs` in `leading` whose icon is the modality (in person, video, phone), with one fixed color per modality, as `Layouts/Documents` gives one color per file type, the event as content and, in `meta`, the date and time the consumer formats and the state as a `RecordStatusBadge`. Only the badge carries the state color (info when scheduled, warning today, success when held, muted when cancelled), so the frame tells the modality and the badge the state; a cancelled event also strikes its title.',
      name: 'RecordGroupLink',
    },
    {
      description:
        'An event with a menu is a `RecordGroupItem`, since a link row cannot hold a button: the event is a link in `title`, and `children` holds the time, the state and the three-dots menu. The menu offers what the modality and the state allow: join the meeting for a video event, copy the address for an in-person one, reschedule and cancel only while the event has not happened.',
      name: 'RecordGroupItem',
    },
    {
      description:
        'In `With Menu`, the filter has two checkbox `sections`, Modalidade and Período (upcoming, past), and the sort orders by date; the consumer applies them.',
      name: 'RecordGroupFilter',
    },
  ],
  description: {
    component:
      'The hearings and events of a record, such as a lawsuit, modeled on the Lemind agenda (start, modality, location or meeting link, cancellation). `Events` lists the upcoming events with the modality icon, the date and time and the state. `With Menu` lists every event with its actions and a `RecordGroupFilter` by modality and period with a sort by date. The pattern never formats a date, derives a state, filters or sorts: the story does. `Behavior` is under test.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

function EventFrame({ event }: Readonly<{ event: AgendaEvent }>) {
  const Icon = modalityIcon[event.modality]
  return (
    <IconFrame color={modalityColor[event.modality]} shape="rounded" size="xs">
      <Icon aria-hidden />
    </IconFrame>
  )
}

function EventBadge({ status }: Readonly<{ status: EventStatus }>) {
  const { color, label } = eventStatus[status]
  return <RecordStatusBadge color={color}>{label}</RecordStatusBadge>
}

function EventTitle({
  children,
  status,
}: Readonly<{ children: ReactNode; status: EventStatus }>) {
  return status === 'cancelled' ? (
    <span className="text-muted-foreground line-through">{children}</span>
  ) : (
    children
  )
}

function EventsGroup({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  return (
    <RecordGroup
      actions={
        <RecordGroupAction
          icon={PlusIcon}
          label="Agendar evento"
          onClick={onAddEvent}
        />
      }
      title={title}
      variant={variant}
    >
      {upcoming.map((event) => (
        <RecordGroupLink
          href={event.href}
          key={event.id}
          leading={<EventFrame event={event} />}
          meta={
            <span className="flex items-center gap-2">
              {event.time}
              <EventBadge status={event.status} />
            </span>
          }
        >
          <EventTitle status={event.status}>{event.title}</EventTitle>
        </RecordGroupLink>
      ))}
    </RecordGroup>
  )
}

function EventMenu({
  event,
  onCancel,
}: Readonly<{ event: AgendaEvent; onCancel: () => void }>) {
  const open = !isPast(event) && event.status !== 'cancelled'
  return (
    <Menu>
      <MenuTrigger
        aria-label={`Ações de ${event.title}`}
        render={<Button size="icon-sm" variant="ghost" />}
      >
        <EllipsisIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        <MenuItem onClick={() => onOpenEvent(event.id)}>
          <ExternalLinkIcon aria-hidden="true" />
          Abrir
        </MenuItem>
        {open && event.meetingUrl ? (
          <MenuLinkItem
            href={event.meetingUrl}
            rel="noreferrer"
            target="_blank"
          >
            <VideoIcon aria-hidden="true" />
            Entrar na reunião
          </MenuLinkItem>
        ) : null}
        {open && event.location ? (
          <MenuItem onClick={() => onCopyAddress(event.location)}>
            <CopyIcon aria-hidden="true" />
            Copiar endereço
          </MenuItem>
        ) : null}
        {isPast(event) ? null : (
          <MenuItem onClick={() => onRescheduleEvent(event.id)}>
            <CalendarClockIcon aria-hidden="true" />
            Remarcar
          </MenuItem>
        )}
        {open ? (
          <>
            <MenuSeparator />
            <MenuItem onClick={onCancel} variant="destructive">
              <BanIcon aria-hidden="true" />
              Cancelar
            </MenuItem>
          </>
        ) : null}
      </MenuPopup>
    </Menu>
  )
}

function EventsMenuGroup({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  const [list, setList] = useState(events)
  const [modalities, setModalities] = useState<Modality[]>(
    modalityOptions.map((option) => option.value),
  )
  const [periods, setPeriods] = useState<EventsPeriod[]>(
    periodOptions.map((option) => option.value),
  )
  const [sort, setSort] = useState<EventsSort>('date-asc')
  const visible = list
    .filter(
      (event) =>
        modalities.includes(event.modality) &&
        periods.includes(isPast(event) ? 'past' : 'upcoming'),
    )
    .sort((a, b) =>
      sort === 'date-desc'
        ? b.startsAt.localeCompare(a.startsAt)
        : a.startsAt.localeCompare(b.startsAt),
    )
  const cancel = (id: string) =>
    setList((current) =>
      current.map((event) =>
        event.id === id ? { ...event, status: 'cancelled' } : event,
      ),
    )

  return (
    <RecordGroup
      actions={
        <>
          <RecordGroupFilter
            label="Filtrar e ordenar eventos"
            sections={[
              {
                label: 'Modalidade',
                onChange: (next) => setModalities(next as Modality[]),
                options: modalityOptions,
                value: modalities,
              },
              {
                label: 'Período',
                onChange: (next) => setPeriods(next as EventsPeriod[]),
                options: periodOptions,
                value: periods,
              },
            ]}
            onSortChange={(next) => setSort(next as EventsSort)}
            sortLabel="Ordenar por"
            sortOptions={sortOptions}
            sortValue={sort}
          />
          <RecordGroupAction
            icon={PlusIcon}
            label="Agendar evento"
            onClick={onAddEvent}
          />
        </>
      }
      empty={visible.length === 0}
      title={title}
      variant={variant}
    >
      {visible.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Nenhum evento com os filtros escolhidos
        </p>
      ) : null}
      {visible.map((event) => (
        <RecordGroupItem
          interactive
          key={event.id}
          leading={<EventFrame event={event} />}
          title={
            <a
              className="truncate rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href={event.href}
            >
              <EventTitle status={event.status}>{event.title}</EventTitle>
            </a>
          }
        >
          <span className="truncate text-muted-foreground">{event.time}</span>
          <EventBadge status={event.status} />
          <EventMenu event={event} onCancel={() => cancel(event.id)} />
        </RecordGroupItem>
      ))}
    </RecordGroup>
  )
}

const rgbOf = (hex: string) =>
  `rgb(${[1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16)).join(', ')})`

const meta = {
  args: { variant: 'plain' },
  argTypes: { variant: recordGroupArgTypes.variant },
  component: RecordGroupLink as unknown as ComponentType<EventsArgs>,
  decorators: [
    (Story) => (
      <div className="w-96 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  title: 'Patterns/Records/Group/Layouts/Events',
} satisfies Meta<EventsArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Events: Story = {
  render: ({ variant }) => <EventsGroup title="Eventos" variant={variant} />,
}

export const WithMenu: Story = {
  render: ({ variant }) => (
    <EventsMenuGroup title="Eventos" variant={variant} />
  ),
}

const rowsFit = async (region: HTMLElement) => {
  for (const row of region.querySelectorAll<HTMLElement>(
    '[data-slot="record-group-item"], [data-slot="record-group-link"]',
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
    const eventsRegion = canvas.getByRole('region', { name: 'Eventos' })
    const menuRegion = canvas.getByRole('region', { name: 'Eventos com menu' })

    await rowsFit(eventsRegion)
    const links = within(eventsRegion).getAllByRole('link')
    await expect(links).toHaveLength(upcoming.length)
    for (const [index, event] of upcoming.entries()) {
      const link = links[index] as HTMLElement
      const status = eventStatus[event.status]
      await expect(link).toHaveAccessibleName(
        `${event.title} ${event.time} ${status.label}`,
      )
      await expect(link).toHaveAttribute('href', event.href)
      const frame = link.querySelector(
        '[data-slot="icon-frame"]',
      ) as HTMLElement
      const badge = link.querySelector('[data-slot="badge"]') as HTMLElement
      await expect(getComputedStyle(frame).color).toBe(
        rgbOf(modalityColor[event.modality]),
      )
      await expect(badge.getAttribute('style')).toContain(status.color)
    }
    await expect(
      within(eventsRegion).getByText('Audiência de instrução e julgamento'),
    ).toHaveClass('line-through')
    await expect(
      within(eventsRegion).getByText('Reunião com o cliente'),
    ).not.toHaveClass('line-through')

    const menuGroup = within(menuRegion)
    await rowsFit(menuRegion)
    await expect(
      await menuItemsFor(menuGroup, 'Ações de Reunião com o cliente'),
    ).toEqual(['Abrir', 'Entrar na reunião', 'Remarcar', 'Cancelar'])
    await expect(
      await menuItemsFor(menuGroup, 'Ações de Audiência de conciliação'),
    ).toEqual(['Abrir', 'Copiar endereço', 'Remarcar', 'Cancelar'])
    await expect(
      await menuItemsFor(menuGroup, 'Ações de Ligação com o perito'),
    ).toEqual(['Abrir', 'Remarcar', 'Cancelar'])
    await expect(
      await menuItemsFor(
        menuGroup,
        'Ações de Audiência de instrução e julgamento',
      ),
    ).toEqual(['Abrir', 'Remarcar'])
    await expect(
      await menuItemsFor(menuGroup, 'Ações de Reunião de alinhamento'),
    ).toEqual(['Abrir'])

    const row = (name: string) =>
      menuGroup
        .getByRole('link', { name })
        .closest('[data-slot="record-group-item"]') as HTMLElement
    await expect(
      within(row('Ligação com o perito')).getByText('Agendado'),
    ).toBeVisible()
    await userEvent.click(
      menuGroup.getByRole('button', { name: 'Ações de Ligação com o perito' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Cancelar' }),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    await expect(
      within(row('Ligação com o perito')).getByText('Cancelado'),
    ).toBeVisible()
    await expect(menuGroup.getByText('Ligação com o perito')).toHaveClass(
      'line-through',
    )
    await expect(
      await menuItemsFor(menuGroup, 'Ações de Ligação com o perito'),
    ).toEqual(['Abrir', 'Remarcar'])

    const titlesIn = () =>
      [...menuRegion.querySelectorAll('[data-slot="record-group-item"] a')].map(
        (link) => link.textContent,
      )
    await expect(titlesIn()).toEqual([
      'Sessão de mediação',
      'Reunião de alinhamento',
      'Audiência de conciliação',
      'Reunião com o cliente',
      'Ligação com o perito',
      'Audiência de instrução e julgamento',
    ])
    await userEvent.click(
      menuGroup.getByRole('button', { name: 'Filtrar e ordenar eventos' }),
    )
    const dialog = within(await screen.findByRole('dialog'))
    await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
    await expect(
      dialog.getByRole('group', { name: 'Modalidade' }),
    ).toBeVisible()
    await expect(
      within(dialog.getByRole('group', { name: 'Período' })).getAllByRole(
        'checkbox',
      ),
    ).toHaveLength(2)
    await userEvent.click(dialog.getByRole('checkbox', { name: 'Passados' }))
    await expect(titlesIn()).toEqual([
      'Audiência de conciliação',
      'Reunião com o cliente',
      'Ligação com o perito',
      'Audiência de instrução e julgamento',
    ])
    await userEvent.click(dialog.getByRole('checkbox', { name: 'Presencial' }))
    await userEvent.click(
      dialog.getByRole('radio', { name: 'Data mais distante' }),
    )
    await expect(titlesIn()).toEqual([
      'Ligação com o perito',
      'Reunião com o cliente',
    ])
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await rowsFit(menuRegion)
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <EventsGroup title="Eventos" variant="plain" />
      <EventsMenuGroup title="Eventos com menu" variant="plain" />
    </div>
  ),
}
