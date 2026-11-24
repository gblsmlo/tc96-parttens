import {
  ArrowSquareOutIcon,
  CalendarDotIcon,
  CopyIcon,
  DotsThreeIcon,
  MapPinIcon,
  PhoneIcon,
  PlusIcon,
  ProhibitIcon,
  VideoCameraIcon,
} from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { IconFrame } from '@tc96/ui/icon-frame'
import {
  Menu,
  MenuItem,
  MenuLinkItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@tc96/ui/menu'
import {
  RecordGroup,
  RecordGroupAction,
  RecordGroupFilter,
  RecordGroupItem,
  RecordGroupLink,
  type RecordGroupVariant,
  RecordStatusBadge,
} from '@tc96/ui/patterns'
import { type ReactNode, useState } from 'react'

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

const ignore = (..._values: unknown[]) => undefined
const onOpenEvent = ignore
const onCopyAddress = ignore
const onRescheduleEvent = ignore
const onAddEvent = ignore

const today = '2026-11-19'

const modalityIcon = {
  in_person: MapPinIcon,
  phone: PhoneIcon,
  video: VideoCameraIcon,
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

export function EventFrame({ event }: Readonly<{ event: AgendaEvent }>) {
  const Icon = modalityIcon[event.modality]
  return (
    <IconFrame color={modalityColor[event.modality]} shape="rounded" size="xs">
      <Icon aria-hidden />
    </IconFrame>
  )
}

export function EventBadge({ status }: Readonly<{ status: EventStatus }>) {
  const { color, label } = eventStatus[status]
  return <RecordStatusBadge color={color}>{label}</RecordStatusBadge>
}

export function EventTitle({
  children,
  status,
}: Readonly<{ children: ReactNode; status: EventStatus }>) {
  return status === 'cancelled' ? (
    <span className="text-muted-foreground line-through">{children}</span>
  ) : (
    children
  )
}

export function EventsGroup({
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

export function EventMenu({
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
        <DotsThreeIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        <MenuItem onClick={() => onOpenEvent(event.id)}>
          <ArrowSquareOutIcon aria-hidden="true" />
          Abrir
        </MenuItem>
        {open && event.meetingUrl ? (
          <MenuLinkItem
            href={event.meetingUrl}
            rel="noreferrer"
            target="_blank"
          >
            <VideoCameraIcon aria-hidden="true" />
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
            <CalendarDotIcon aria-hidden="true" />
            Remarcar
          </MenuItem>
        )}
        {open ? (
          <>
            <MenuSeparator />
            <MenuItem onClick={onCancel} variant="destructive">
              <ProhibitIcon aria-hidden="true" />
              Cancelar
            </MenuItem>
          </>
        ) : null}
      </MenuPopup>
    </Menu>
  )
}

export function EventsMenuGroup({
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
