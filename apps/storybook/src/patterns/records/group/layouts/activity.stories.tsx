import type { Meta, StoryObj } from '@storybook/react-vite'
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
import { type ComponentType, useState } from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../../.storybook/docs-page.tsx'
import { recordGroupArgTypes } from '../../../../test-utils/story-arg-types'

interface ActivityArgs {
  variant: RecordGroupVariant
}

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

const hidden = { table: { disable: true } } as const

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

const sentenceOf = (event: ActivityEvent) =>
  [
    actorName(event),
    event.verb,
    event.object,
    ...(event.value ? ['para', event.value] : []),
  ].join(' ')

const phaseSentenceOf = (change: PhaseChange) =>
  change.from ? `${change.from} para ${change.to}` : `Início em ${change.to}`

const usage = `
import { Avatar, AvatarFallback } from '@acme/elements/avatar'
import { IconFrame } from '@acme/elements/icon-frame'
import { RecordGroup, RecordGroupFilter, RecordGroupItem } from '@acme/patterns'

<RecordGroup
  actions={<RecordGroupFilter filterOptions={kinds} label="Filter activity" sortOptions={sorts} {...filterState} />}
  empty={visible.length === 0}
  title="Activity"
>
  {visible.map((event) => (
    <RecordGroupItem
      key={event.id}
      leading={
        event.actor ? (
          <Avatar aria-hidden size="sm">
            <AvatarFallback>{event.actor.initials}</AvatarFallback>
          </Avatar>
        ) : (
          <IconFrame size="xs"><BotIcon aria-hidden /></IconFrame>
        )
      }
      title={<>{name} <span className="text-muted-foreground">{event.verb}</span> {event.object}</>}
    >
      <time className="text-muted-foreground" dateTime={event.at} title={event.absolute}>
        {event.ago}
      </time>
    </RecordGroupItem>
  ))}
</RecordGroup>
`

const docs = {
  api: [
    {
      description:
        'Each event is a `RecordGroupItem`: the author `Avatar` (`sm`, 24px, the width of an `IconFrame` `xs`, so every sentence starts on one column) in `leading`, or a circle `IconFrame` with a bot icon when the system acted; the sentence in `title`, with the names in ink and the verbs muted, truncating first; and the relative date in `children` as a `time` whose `dateTime` is the instant and whose `title` is the absolute date. The consumer writes the sentence and formats both dates.',
      name: 'RecordGroupItem',
    },
    {
      description:
        'Filters by event kind (changes, phases, documents, system) and sorts newest or oldest first. The story keeps both values and passes only the matching events, and `empty` with a line of text when none is left.',
      name: 'RecordGroupFilter',
    },
    {
      description:
        '`defaultOpen={false}` folds a long trail; the `footer` holds a ghost `Button` that reveals the next page, and disappears when nothing is left. Paging is the consumer state, never the pattern.',
      name: 'RecordGroup',
    },
  ],
  description: {
    component:
      'The activity trail of a record, modeled on the Lemind `Atividades` group and its phase history. `Activity` mixes field changes, the creation, a phase change, a document and system events, newest first. `Phase History` lists the phase changes of a case, from and to, by whom and when. `With Filter` adds a `RecordGroupFilter` by event kind and order. `With Paging` starts closed and reveals three more events per click on `Ver mais`. `Behavior` is under test.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

function ActorMark({ actor }: Readonly<{ actor: Person | null }>) {
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

function When({
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

function ActivityRow({ event }: Readonly<{ event: ActivityEvent }>) {
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

function ActivityGroup({
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

function PhaseHistoryGroup({
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

function FilteredActivityGroup({
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

function PagedActivityGroup({
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

const meta = {
  args: { variant: 'plain' },
  argTypes: { variant: recordGroupArgTypes.variant },
  component: RecordGroupItem as unknown as ComponentType<ActivityArgs>,
  decorators: [
    (Story) => (
      <div className="w-96 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  title: 'Patterns/Records/Group/Layouts/Activity',
} satisfies Meta<ActivityArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Activity: Story = {
  render: ({ variant }) => (
    <ActivityGroup title="Atividades" variant={variant} />
  ),
}

export const PhaseHistory: Story = {
  render: ({ variant }) => (
    <PhaseHistoryGroup title="Histórico de fases" variant={variant} />
  ),
}

export const WithFilter: Story = {
  render: ({ variant }) => (
    <FilteredActivityGroup title="Atividades" variant={variant} />
  ),
}

export const WithPaging: Story = {
  render: ({ variant }) => (
    <PagedActivityGroup title="Atividades" variant={variant} />
  ),
}

const rowsFit = async (region: HTMLElement) => {
  for (const row of region.querySelectorAll<HTMLElement>(
    '[data-slot="record-group-item"]',
  )) {
    await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth)
  }
}

const titlesIn = (region: HTMLElement) =>
  Array.from(
    region.querySelectorAll('[data-slot="record-group-item-title"]'),
    (title) => title.textContent,
  )

export const Behavior: Story = {
  argTypes: { variant: hidden },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const activityRegion = canvas.getByRole('region', { name: 'Atividades' })
    const phasesRegion = canvas.getByRole('region', {
      name: 'Histórico de fases',
    })
    const filterRegion = canvas.getByRole('region', {
      name: 'Atividades com filtro',
    })
    const pagedRegion = canvas.getByRole('region', {
      name: 'Atividades anteriores',
    })

    await expect(titlesIn(activityRegion)).toEqual(events.map(sentenceOf))
    await expect(titlesIn(activityRegion)[1]).toBe(
      'Gabriel Melo alterou Fase para Instrução',
    )
    const times = Array.from(activityRegion.querySelectorAll('time'))
    await expect(times.map((time) => time.getAttribute('datetime'))).toEqual(
      events.map((event) => event.at),
    )
    await expect(times.map((time) => time.getAttribute('title'))).toEqual(
      events.map((event) => event.absolute),
    )
    await expect(times.map((time) => time.textContent)).toEqual(
      events.map((event) => event.ago),
    )
    await expect(
      Array.from(activityRegion.querySelectorAll('[data-actor]'), (mark) =>
        mark.getAttribute('data-actor'),
      ),
    ).toEqual(events.map((event) => (event.actor ? 'person' : 'system')))
    const marks = activityRegion.querySelectorAll<HTMLElement>('[data-actor]')
    for (const mark of marks) {
      await expect(mark.getBoundingClientRect().width).toBe(24)
    }
    const starts = new Set(
      Array.from(
        activityRegion.querySelectorAll<HTMLElement>(
          '[data-slot="record-group-item-title"]',
        ),
        (title) => title.getBoundingClientRect().left,
      ),
    )
    await expect(starts.size).toBe(1)

    const longTitle = activityRegion.querySelectorAll<HTMLElement>(
      '[data-slot="record-group-item-title"]',
    )[3] as HTMLElement
    await expect(longTitle.scrollWidth).toBeGreaterThan(longTitle.clientWidth)
    const longTime = times[3] as HTMLElement
    await expect(longTime.scrollWidth).toBeLessThanOrEqual(longTime.clientWidth)

    await expect(titlesIn(phasesRegion)).toEqual(
      phaseChanges.map(phaseSentenceOf),
    )
    await expect(
      Array.from(
        phasesRegion.querySelectorAll(
          '[data-slot="record-group-item-trailing"] > span',
        ),
        (name) => name.textContent,
      ),
    ).toEqual(phaseChanges.map((change) => change.by.name))
    await expect(
      Array.from(phasesRegion.querySelectorAll('time'), (time) =>
        time.getAttribute('datetime'),
      ),
    ).toEqual(phaseChanges.map((change) => change.at))

    const filterGroup = within(filterRegion)
    await userEvent.click(
      filterGroup.getByRole('button', {
        name: 'Filtrar e ordenar atividades',
      }),
    )
    const dialogElement = await screen.findByRole('dialog')
    await waitFor(() => expect(dialogElement).toBeVisible())
    const dialog = within(dialogElement)
    await userEvent.click(dialog.getByRole('checkbox', { name: 'Alterações' }))
    await userEvent.click(dialog.getByRole('checkbox', { name: 'Sistema' }))
    await expect(titlesIn(filterRegion)).toEqual([
      'Gabriel Melo alterou Fase para Instrução',
      'Ana Souza adicionou Contestação.pdf',
    ])
    await userEvent.click(dialog.getByRole('radio', { name: 'Mais antigas' }))
    await expect(titlesIn(filterRegion)).toEqual([
      'Ana Souza adicionou Contestação.pdf',
      'Gabriel Melo alterou Fase para Instrução',
    ])
    await userEvent.click(dialog.getByRole('checkbox', { name: 'Fases' }))
    await userEvent.click(dialog.getByRole('checkbox', { name: 'Documentos' }))
    await expect(titlesIn(filterRegion)).toEqual([])
    await expect(filterRegion).toHaveAttribute('data-empty', 'true')
    await expect(
      filterGroup.getByText('Nenhuma atividade com os tipos escolhidos'),
    ).toBeInTheDocument()
    await userEvent.click(dialog.getByRole('checkbox', { name: 'Sistema' }))
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(filterRegion).not.toHaveAttribute('data-empty')
    await expect(titlesIn(filterRegion)).toEqual([
      'Sistema ativou o monitoramento do processo',
      'Sistema importou 3 publicações do DJEN',
    ])

    const pagedGroup = within(pagedRegion)
    const pagedTrigger = pagedGroup.getByRole('button', {
      name: 'Atividades anteriores',
    })
    await expect(pagedTrigger).toHaveAttribute('aria-expanded', 'false')
    await expect(titlesIn(pagedRegion)).toEqual([])
    await userEvent.click(pagedTrigger)
    await waitFor(() =>
      expect(titlesIn(pagedRegion)).toEqual(
        events.slice(0, pageSize).map(sentenceOf),
      ),
    )
    await userEvent.click(pagedGroup.getByRole('button', { name: 'Ver mais' }))
    await expect(titlesIn(pagedRegion)).toHaveLength(pageSize * 2)
    await userEvent.click(pagedGroup.getByRole('button', { name: 'Ver mais' }))
    await expect(titlesIn(pagedRegion)).toEqual(events.map(sentenceOf))
    await expect(
      pagedGroup.queryByRole('button', { name: 'Ver mais' }),
    ).toBeNull()

    for (const region of [
      activityRegion,
      phasesRegion,
      filterRegion,
      pagedRegion,
    ]) {
      await rowsFit(region)
    }
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <ActivityGroup title="Atividades" variant="plain" />
      <PhaseHistoryGroup title="Histórico de fases" variant="plain" />
      <FilteredActivityGroup title="Atividades com filtro" variant="plain" />
      <PagedActivityGroup title="Atividades anteriores" variant="plain" />
    </div>
  ),
}
