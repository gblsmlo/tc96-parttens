import { Avatar, AvatarFallback } from '@tc96/elements/avatar'
import { IconFrame } from '@tc96/elements/icon-frame'
import {
  RecordGroup,
  RecordGroupFilter,
  RecordGroupItem,
  type RecordGroupVariant,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { ArrowRightIcon, BotIcon } from 'lucide-react'
import { useState } from 'react'

interface Person {
  initials: string
  name: string
}

type ActivityKind = 'change' | 'phase' | 'document' | 'system'

type ActivitySort = 'newest' | 'oldest'

interface ActivityEvent {
  actor: Person | null
  ago: string
  at: string
  absolute: string
  id: string
  kind: ActivityKind
  object: string
  value?: string
  verb: string
}

interface PhaseChange {
  ago: string
  at: string
  absolute: string
  by: Person
  from: string | null
  id: string
  to: string
}

const systemActor = 'Sistema'

const gabriel = { initials: 'GM', name: 'Gabriel Melo' }
const ana = { initials: 'AS', name: 'Ana Souza' }
const marcos = { initials: 'MR', name: 'Marcos Ribeiro' }

const events: readonly ActivityEvent[] = [
  {
    absolute: '19/11/2026 09:12',
    actor: null,
    ago: 'há 2 horas',
    at: '2026-11-19T09:12',
    id: 'publications',
    kind: 'system',
    object: '3 publicações do DJEN',
    verb: 'importou',
  },
  {
    absolute: '17/11/2026 16:40',
    actor: gabriel,
    ago: 'há 2 dias',
    at: '2026-11-17T16:40',
    id: 'phase',
    kind: 'phase',
    object: 'Fase',
    value: 'Instrução',
    verb: 'alterou',
  },
  {
    absolute: '16/11/2026 11:05',
    actor: ana,
    ago: 'há 3 dias',
    at: '2026-11-16T11:05',
    id: 'document',
    kind: 'document',
    object: 'Contestação.pdf',
    verb: 'adicionou',
  },
  {
    absolute: '14/11/2026 15:30',
    actor: ana,
    ago: 'há 5 dias',
    at: '2026-11-14T15:30',
    id: 'subject',
    kind: 'change',
    object: 'Objeto',
    value:
      'Revisão de cláusulas abusivas do contrato de financiamento de veículo com pedido de tutela de urgência',
    verb: 'alterou',
  },
  {
    absolute: '12/11/2026 10:00',
    actor: marcos,
    ago: 'há 1 semana',
    at: '2026-11-12T10:00',
    id: 'owner',
    kind: 'change',
    object: 'Responsável',
    value: 'Gabriel Melo',
    verb: 'alterou',
  },
  {
    absolute: '10/11/2026 08:00',
    actor: null,
    ago: 'há 1 semana',
    at: '2026-11-10T08:00',
    id: 'monitoring',
    kind: 'system',
    object: 'o monitoramento do processo',
    verb: 'ativou',
  },
  {
    absolute: '09/11/2026 14:20',
    actor: gabriel,
    ago: 'há 10 dias',
    at: '2026-11-09T14:20',
    id: 'created',
    kind: 'change',
    object: 'o processo',
    verb: 'criou',
  },
]

const phaseChanges: readonly PhaseChange[] = [
  {
    absolute: '17/11/2026 16:40',
    ago: 'há 2 dias',
    at: '2026-11-17T16:40',
    by: gabriel,
    from: 'Conhecimento',
    id: 'instruction',
    to: 'Instrução',
  },
  {
    absolute: '30/09/2026 10:15',
    ago: 'há 2 meses',
    at: '2026-09-30T10:15',
    by: ana,
    from: 'Distribuição',
    id: 'knowledge',
    to: 'Conhecimento',
  },
  {
    absolute: '02/09/2026 09:00',
    ago: 'há 3 meses',
    at: '2026-09-02T09:00',
    by: marcos,
    from: null,
    id: 'distribution',
    to: 'Distribuição',
  },
]

const kindOptions: readonly { label: string; value: ActivityKind }[] = [
  { label: 'Alterações', value: 'change' },
  { label: 'Fases', value: 'phase' },
  { label: 'Documentos', value: 'document' },
  { label: 'Sistema', value: 'system' },
]

const sortOptions: readonly { label: string; value: ActivitySort }[] = [
  { label: 'Mais recentes', value: 'newest' },
  { label: 'Mais antigas', value: 'oldest' },
]

const pageSize = 3

const actorName = (event: ActivityEvent) => event.actor?.name ?? systemActor

export function ActorMark({ actor }: Readonly<{ actor: Person | null }>) {
  if (!actor)
    return (
      <IconFrame
        color="var(--muted-foreground)"
        data-actor="system"
        shape="circle"
        size="xs"
      >
        <BotIcon aria-hidden />
      </IconFrame>
    )
  return (
    <Avatar aria-hidden data-actor="person" size="sm">
      <AvatarFallback>{actor.initials}</AvatarFallback>
    </Avatar>
  )
}

export function When({
  absolute,
  ago,
  at,
}: Readonly<{ absolute: string; ago: string; at: string }>) {
  return (
    <time
      className="truncate text-muted-foreground"
      dateTime={at}
      title={absolute}
    >
      {ago}
    </time>
  )
}

export function ActivityRow({ event }: Readonly<{ event: ActivityEvent }>) {
  return (
    <RecordGroupItem
      leading={<ActorMark actor={event.actor} />}
      title={
        <>
          {actorName(event)}{' '}
          <span className="text-muted-foreground">{event.verb}</span>{' '}
          {event.object}
          {event.value ? (
            <>
              {' '}
              <span className="text-muted-foreground">para</span> {event.value}
            </>
          ) : null}
        </>
      }
    >
      <When absolute={event.absolute} ago={event.ago} at={event.at} />
    </RecordGroupItem>
  )
}

export function ActivityGroup({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  return (
    <RecordGroup title={title} variant={variant}>
      {events.map((event) => (
        <ActivityRow event={event} key={event.id} />
      ))}
    </RecordGroup>
  )
}

export function PhaseHistoryGroup({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  return (
    <RecordGroup title={title} variant={variant}>
      {phaseChanges.map((change) => (
        <RecordGroupItem
          key={change.id}
          leading={<ActorMark actor={change.by} />}
          title={
            change.from ? (
              <>
                {change.from} <span className="sr-only">para</span>
                <ArrowRightIcon
                  aria-hidden
                  className="inline size-3.5 align-middle text-muted-foreground"
                />{' '}
                {change.to}
              </>
            ) : (
              <>
                <span className="text-muted-foreground">Início em</span>{' '}
                {change.to}
              </>
            )
          }
        >
          <span className="truncate text-muted-foreground">
            {change.by.name}
          </span>
          <When absolute={change.absolute} ago={change.ago} at={change.at} />
        </RecordGroupItem>
      ))}
    </RecordGroup>
  )
}

export function FilteredActivityGroup({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  const [kinds, setKinds] = useState<ActivityKind[]>(
    kindOptions.map((option) => option.value),
  )
  const [sort, setSort] = useState<ActivitySort>('newest')
  const visible = events
    .filter((event) => kinds.includes(event.kind))
    .sort((a, b) =>
      sort === 'oldest' ? a.at.localeCompare(b.at) : b.at.localeCompare(a.at),
    )

  return (
    <RecordGroup
      actions={
        <RecordGroupFilter
          filterLabel="Tipo"
          filterOptions={kindOptions}
          filterValue={kinds}
          label="Filtrar e ordenar atividades"
          onFilterChange={(next) => setKinds(next as ActivityKind[])}
          onSortChange={(next) => setSort(next as ActivitySort)}
          sortLabel="Ordenar por"
          sortOptions={sortOptions}
          sortValue={sort}
        />
      }
      empty={visible.length === 0}
      title={title}
      variant={variant}
    >
      {visible.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Nenhuma atividade com os tipos escolhidos
        </p>
      ) : null}
      {visible.map((event) => (
        <ActivityRow event={event} key={event.id} />
      ))}
    </RecordGroup>
  )
}

export function PagedActivityGroup({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  const [shown, setShown] = useState(pageSize)
  const visible = events.slice(0, shown)

  return (
    <RecordGroup
      defaultOpen={false}
      footer={
        shown < events.length ? (
          <Button
            onClick={() => setShown((count) => count + pageSize)}
            size="xs"
            variant="ghost"
          >
            Ver mais
          </Button>
        ) : undefined
      }
      title={title}
      variant={variant}
    >
      {visible.map((event) => (
        <ActivityRow event={event} key={event.id} />
      ))}
    </RecordGroup>
  )
}
