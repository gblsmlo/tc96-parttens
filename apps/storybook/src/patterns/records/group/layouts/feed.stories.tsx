import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  RecordGroup,
  RecordGroupFilter,
  RecordGroupLink,
  type RecordGroupVariant,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from '@tc96/ui/dialog'
import { type ComponentType, type RefObject, useRef, useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../../.storybook/docs-page.tsx'
import { recordGroupArgTypes } from '../../../../test-utils/story-arg-types'

interface FeedArgs {
  variant: RecordGroupVariant
}

type FeedKind = 'publication' | 'movement'

type FeedSort = 'newest' | 'oldest'

interface FeedEntry {
  at: string
  date: string
  decision?: string
  id: string
  kind: FeedKind
  organ?: string
  text: string
  title: string
  tribunal?: string
  unread: boolean
}

const hidden = { table: { disable: true } } as const
const onCreateDeadline = fn()
const onReviseDecision = fn()

const PAGE = 4

const kindLabel = { movement: 'Andamento', publication: 'Publicação' } as const

const unreadLabel = { movement: 'Não lido', publication: 'Não lida' } as const

const feed: readonly FeedEntry[] = [
  {
    at: '2026-11-18',
    date: '18/11/2026',
    id: 'pub-intimacao-sentenca',
    kind: 'publication',
    organ: '3ª Vara Cível de Campinas',
    text: 'Fica a parte autora intimada da sentença proferida nos autos.\n\nJulgo procedente o pedido para condenar o réu ao pagamento de R$ 48.320,00, corrigidos desde o ajuizamento. Custas e honorários de 10% sobre o valor da condenação pelo réu.\n\nPrazo para recurso: 15 dias úteis.',
    title: 'Intimação · TJSP',
    tribunal: 'TJSP',
    unread: true,
  },
  {
    at: '2026-11-17',
    date: '17/11/2026',
    id: 'mov-juntada',
    kind: 'movement',
    text: 'Juntada de petição de manifestação da parte ré, protocolo 2026.0045.7781.',
    title: 'Juntada de petição',
    unread: true,
  },
  {
    at: '2026-11-13',
    date: '13/11/2026',
    decision: 'Prazo criado',
    id: 'pub-despacho',
    kind: 'publication',
    organ: '3ª Vara Cível de Campinas',
    text: 'Manifeste-se a parte autora sobre a contestação no prazo de 15 dias.',
    title: 'Despacho · TJSP',
    tribunal: 'TJSP',
    unread: false,
  },
  {
    at: '2026-11-11',
    date: '11/11/2026',
    id: 'mov-conclusos',
    kind: 'movement',
    text: 'Autos conclusos ao juiz para decisão.',
    title: 'Conclusos para decisão',
    unread: false,
  },
  {
    at: '2026-11-04',
    date: '04/11/2026',
    id: 'mov-remessa',
    kind: 'movement',
    text: 'Remessa dos autos ao Tribunal de Justiça para julgamento do recurso de apelação interposto pela parte ré.',
    title:
      'Remessa dos autos ao Tribunal de Justiça para julgamento do recurso de apelação',
    unread: true,
  },
  {
    at: '2026-10-30',
    date: '30/10/2026',
    decision: 'Sem providência',
    id: 'pub-intimacao-audiencia',
    kind: 'publication',
    organ: 'Centro Judiciário de Solução de Conflitos',
    text: 'Ficam as partes intimadas da audiência de conciliação designada para 25/11/2026, às 14h, por videoconferência.',
    title: 'Intimação · TJSP',
    tribunal: 'TJSP',
    unread: false,
  },
  {
    at: '2026-10-28',
    date: '28/10/2026',
    id: 'mov-audiencia',
    kind: 'movement',
    text: 'Audiência de conciliação designada para 25/11/2026, às 14h.',
    title: 'Audiência de conciliação designada',
    unread: false,
  },
]

const kindFilterOptions = [
  { label: 'Publicações', value: 'publication' },
  { label: 'Andamentos', value: 'movement' },
] as const

const readFilterOptions = [{ label: 'Só não lidos', value: 'unread' }] as const

const sortOptions: readonly { label: string; value: FeedSort }[] = [
  { label: 'Mais recentes', value: 'newest' },
  { label: 'Mais antigos', value: 'oldest' },
]

const metaOf = (entry: FeedEntry) => `${kindLabel[entry.kind]} · ${entry.date}`

const descriptionOf = (entry: FeedEntry) =>
  [entry.date, entry.tribunal, entry.organ].filter(Boolean).join(' · ')

const usage = `
import { RecordGroup, RecordGroupFilter, RecordGroupLink } from '@acme/patterns'

<RecordGroup
  actions={
    <RecordGroupFilter
      label="Filter and sort the feed"
      sections={[
        { label: 'Kind', onChange: setKinds, options: kindOptions, value: kinds },
        { label: 'Reading', onChange: setReading, options: readingOptions, value: reading },
      ]}
      onSortChange={setSort}
      sortOptions={sortOptions}
      sortValue={sort}
    />
  }
  empty={visible.length === 0}
  footer={hasMore ? <Button onClick={showMore} size="sm" variant="ghost">Show 3 more of 7</Button> : null}
  title="Publications and movements"
>
  {visible.map((entry) => (
    <RecordGroupLink
      key={entry.id}
      leading={<span aria-hidden className={entry.unread ? 'size-1.5 rounded-full bg-primary' : 'size-1.5'} />}
      meta={\`\${kindLabel[entry.kind]} · \${entry.date}\`}
      onClick={() => openReader(entry)}
      render={<button type="button" />}
    >
      {entry.unread ? <span className="sr-only">Unread: </span> : null}
      <span className={entry.unread ? 'font-medium' : undefined}>{entry.title}</span>
    </RecordGroupLink>
  ))}
</RecordGroup>
`

const docs = {
  api: [
    {
      description:
        'Each entry is a `RecordGroupLink` rendered as a `button` through `render`, since the row opens a reader dialog instead of navigating. `leading` holds the unread dot (decorative, `aria-hidden`), with a same-size empty box on read rows so every title starts on one column; a visually hidden "Não lida" or "Não lido" opens the name, and the title is `font-medium` while unread. `meta` is the kind and the date.',
      name: 'RecordGroupLink',
    },
    {
      description:
        'The filter in `actions`: two checkbox `sections`, Tipo (Publicações, Andamentos) and Leitura ("Só não lidos"), and the sort (Mais recentes, Mais antigos) is the radio list. The story filters and sorts; when nothing is left it passes `empty` and renders "Nada neste filtro".',
      name: 'RecordGroupFilter',
    },
    {
      description:
        '`footer` holds the paging button, a ghost `Button` that shows the next page or collapses back to the first one. The story slices the rows; the pattern never pages.',
      name: 'RecordGroup',
    },
  ],
  description: {
    component:
      'The court feed of a lawsuit, modeled on the Lemind "Publicações e andamentos" group: DJEN publications and court movements in one list, newest first. A row opens a COSS `Dialog` with the full text; opening it marks the row read, and a publication offers "Criar prazo" and, once decided, "Revisar decisão". `Feed` is the list, `With Filter` adds a `RecordGroupFilter` by kind, unread and date, and `With Paging` shows four rows with a footer button for the rest. The read state, the filter, the sort and the page are story state. `Behavior` is under test.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

function useFeed() {
  const [read, setRead] = useState<ReadonlySet<string>>(new Set())
  const [reading, setReading] = useState<FeedEntry | null>(null)
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLElement | null>(null)
  const isUnread = (entry: FeedEntry) => entry.unread && !read.has(entry.id)

  const openReader = (entry: FeedEntry, element: HTMLElement) => {
    trigger.current = element
    setReading(entry)
    setOpen(true)
    setRead((current) => new Set(current).add(entry.id))
  }

  const reader = (
    <FeedReader
      entry={reading}
      finalFocus={trigger}
      onOpenChange={setOpen}
      open={open}
    />
  )

  return { isUnread, openReader, reader }
}

function FeedReader({
  entry,
  finalFocus,
  onOpenChange,
  open,
}: Readonly<{
  entry: FeedEntry | null
  finalFocus: RefObject<HTMLElement | null>
  onOpenChange: (open: boolean) => void
  open: boolean
}>) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      {entry ? (
        <DialogPopup finalFocus={finalFocus} showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{entry.title}</DialogTitle>
            <DialogDescription>
              {entry.kind === 'publication'
                ? descriptionOf(entry)
                : `${kindLabel.movement} · ${entry.date}`}
            </DialogDescription>
          </DialogHeader>
          <DialogPanel>
            <p className="whitespace-pre-line text-sm">{entry.text}</p>
            {entry.decision ? (
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">{`Decisão: ${entry.decision}`}</span>
                <Button
                  onClick={() => {
                    onReviseDecision(entry.id)
                    onOpenChange(false)
                  }}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  Revisar decisão
                </Button>
              </div>
            ) : null}
          </DialogPanel>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Fechar
            </DialogClose>
            {entry.kind === 'publication' ? (
              <Button
                onClick={() => {
                  onCreateDeadline(entry.id)
                  onOpenChange(false)
                }}
                type="button"
              >
                Criar prazo
              </Button>
            ) : null}
          </DialogFooter>
        </DialogPopup>
      ) : null}
    </Dialog>
  )
}

function FeedRow({
  entry,
  onOpen,
  unread,
}: Readonly<{
  entry: FeedEntry
  onOpen: (element: HTMLElement) => void
  unread: boolean
}>) {
  return (
    <RecordGroupLink
      data-unread={unread || undefined}
      leading={
        <span
          aria-hidden="true"
          className={unread ? 'size-1.5 rounded-full bg-primary' : 'size-1.5'}
        />
      }
      meta={metaOf(entry)}
      onClick={(event) => onOpen(event.currentTarget)}
      render={<button type="button" />}
    >
      {unread ? (
        <span className="sr-only">{`${unreadLabel[entry.kind]}: `}</span>
      ) : null}
      <span className={unread ? 'font-medium' : undefined}>{entry.title}</span>
    </RecordGroupLink>
  )
}

function EmptyFeed({ show }: Readonly<{ show: boolean }>) {
  return show ? (
    <p className="text-muted-foreground text-sm">Nada neste filtro</p>
  ) : null
}

function FeedGroup({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  const { isUnread, openReader, reader } = useFeed()

  return (
    <>
      <RecordGroup title={title} variant={variant}>
        {feed.map((entry) => (
          <FeedRow
            entry={entry}
            key={entry.id}
            onOpen={(element) => openReader(entry, element)}
            unread={isUnread(entry)}
          />
        ))}
      </RecordGroup>
      {reader}
    </>
  )
}

function FilteredFeedGroup({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  const { isUnread, openReader, reader } = useFeed()
  const [kinds, setKinds] = useState<string[]>(['publication', 'movement'])
  const [reading, setReading] = useState<string[]>([])
  const [sort, setSort] = useState<FeedSort>('newest')
  const visible = feed
    .filter(
      (entry) =>
        kinds.includes(entry.kind) &&
        (!reading.includes('unread') || isUnread(entry)),
    )
    .sort((a, b) =>
      sort === 'newest' ? b.at.localeCompare(a.at) : a.at.localeCompare(b.at),
    )

  return (
    <>
      <RecordGroup
        actions={
          <RecordGroupFilter
            label="Filtrar e ordenar publicações e andamentos"
            sections={[
              {
                label: 'Tipo',
                onChange: setKinds,
                options: kindFilterOptions,
                value: kinds,
              },
              {
                label: 'Leitura',
                onChange: setReading,
                options: readFilterOptions,
                value: reading,
              },
            ]}
            onSortChange={(next) => setSort(next as FeedSort)}
            sortLabel="Ordenar por"
            sortOptions={sortOptions}
            sortValue={sort}
          />
        }
        empty={visible.length === 0}
        title={title}
        variant={variant}
      >
        <EmptyFeed show={visible.length === 0} />
        {visible.map((entry) => (
          <FeedRow
            entry={entry}
            key={entry.id}
            onOpen={(element) => openReader(entry, element)}
            unread={isUnread(entry)}
          />
        ))}
      </RecordGroup>
      {reader}
    </>
  )
}

function PagedFeedGroup({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  const { isUnread, openReader, reader } = useFeed()
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? feed : feed.slice(0, PAGE)
  const remaining = feed.length - PAGE

  return (
    <>
      <RecordGroup
        footer={
          remaining > 0 ? (
            <Button
              onClick={() => setExpanded(!expanded)}
              size="sm"
              variant="ghost"
            >
              {expanded
                ? 'Mostrar menos'
                : `Mostrar mais ${remaining} de ${feed.length}`}
            </Button>
          ) : null
        }
        title={title}
        variant={variant}
      >
        {visible.map((entry) => (
          <FeedRow
            entry={entry}
            key={entry.id}
            onOpen={(element) => openReader(entry, element)}
            unread={isUnread(entry)}
          />
        ))}
      </RecordGroup>
      {reader}
    </>
  )
}

const meta = {
  args: { variant: 'plain' },
  argTypes: { variant: recordGroupArgTypes.variant },
  component: RecordGroupLink as unknown as ComponentType<FeedArgs>,
  decorators: [
    (Story) => (
      <div className="w-96 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  title: 'Patterns/Records/Group/Layouts/Feed',
} satisfies Meta<FeedArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Feed: Story = {
  render: ({ variant }) => (
    <FeedGroup title="Publicações e andamentos" variant={variant} />
  ),
}

export const WithFilter: Story = {
  render: ({ variant }) => (
    <FilteredFeedGroup title="Publicações e andamentos" variant={variant} />
  ),
}

export const WithPaging: Story = {
  render: ({ variant }) => (
    <PagedFeedGroup title="Publicações e andamentos" variant={variant} />
  ),
}

const nameOf = (entry: FeedEntry, unread: boolean) =>
  `${unread ? `${unreadLabel[entry.kind]}: ` : ''}${entry.title} ${metaOf(entry)}`

const rowsIn = (region: HTMLElement) =>
  Array.from(
    region.querySelectorAll<HTMLElement>('[data-slot="record-group-link"]'),
  )

const rowsFit = async (region: HTMLElement) => {
  for (const row of rowsIn(region)) {
    await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth)
  }
}

const byId = (id: string) => feed.find((entry) => entry.id === id) as FeedEntry

export const Behavior: Story = {
  argTypes: { variant: hidden },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const feedRegion = canvas.getByRole('region', {
      name: 'Publicações e andamentos',
    })
    const filterRegion = canvas.getByRole('region', {
      name: 'Publicações e andamentos com filtro',
    })
    const pagedRegion = canvas.getByRole('region', {
      name: 'Publicações e andamentos paginados',
    })

    for (const region of [feedRegion, filterRegion, pagedRegion]) {
      await rowsFit(region)
    }

    const feedRows = within(feedRegion).getAllByRole('button', {
      name: /·/,
    })
    for (const [index, entry] of feed.entries()) {
      await expect(feedRows[index]).toHaveAccessibleName(
        nameOf(entry, entry.unread),
      )
    }
    const longName = rowsIn(feedRegion)[4]?.querySelector(
      '[data-slot="record-group-link-name"]',
    ) as HTMLElement
    await expect(longName.scrollWidth).toBeGreaterThan(longName.clientWidth)

    const first = byId('pub-intimacao-sentenca')
    const firstRow = feedRows[0] as HTMLElement
    await userEvent.click(firstRow)
    const reader = await screen.findByRole('dialog', { name: first.title })
    await waitFor(() => expect(reader).toBeVisible())
    await expect(reader).toHaveTextContent('Prazo para recurso: 15 dias úteis.')
    await expect(reader).toHaveAccessibleDescription(descriptionOf(first))
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(firstRow).toHaveFocus()
    await expect(firstRow).toHaveAccessibleName(nameOf(first, false))

    onCreateDeadline.mockClear()
    await userEvent.click(feedRows[2] as HTMLElement)
    const decided = within(
      await screen.findByRole('dialog', { name: 'Despacho · TJSP' }),
    )
    await waitFor(() =>
      expect(decided.getByText('Decisão: Prazo criado')).toBeVisible(),
    )
    await expect(
      decided.getByRole('button', { name: 'Revisar decisão' }),
    ).toBeVisible()
    await userEvent.click(decided.getByRole('button', { name: 'Criar prazo' }))
    await expect(onCreateDeadline).toHaveBeenCalledWith('pub-despacho')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())

    await userEvent.click(feedRows[1] as HTMLElement)
    const movement = within(
      await screen.findByRole('dialog', { name: 'Juntada de petição' }),
    )
    await expect(
      movement.queryByRole('button', { name: 'Criar prazo' }),
    ).toBeNull()
    await userEvent.click(movement.getByRole('button', { name: 'Fechar' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(feedRows[1]).toHaveAccessibleName(
      nameOf(byId('mov-juntada'), false),
    )

    const filterGroup = within(filterRegion)
    const titlesIn = () =>
      rowsIn(filterRegion).map(
        (row) =>
          row.querySelector('[data-slot="record-group-link-name"]')
            ?.textContent,
      )
    const openFilter = async () => {
      await userEvent.click(
        filterGroup.getByRole('button', {
          name: 'Filtrar e ordenar publicações e andamentos',
        }),
      )
      const popup = await screen.findByRole('dialog')
      await waitFor(() => expect(popup).toBeVisible())
      return within(popup)
    }
    const closeFilter = async () => {
      await userEvent.keyboard('{Escape}')
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    }

    let popover = await openFilter()
    await userEvent.click(popover.getByRole('checkbox', { name: 'Andamentos' }))
    await expect(rowsIn(filterRegion)).toHaveLength(
      feed.filter((entry) => entry.kind === 'publication').length,
    )
    for (const row of rowsIn(filterRegion)) {
      await expect(row).toHaveTextContent(kindLabel.publication)
    }
    await userEvent.click(popover.getByRole('checkbox', { name: 'Andamentos' }))
    await userEvent.click(
      popover.getByRole('checkbox', { name: 'Só não lidos' }),
    )
    await expect(titlesIn()).toEqual(
      feed
        .filter((entry) => entry.unread)
        .map((entry) => `${unreadLabel[entry.kind]}: ${entry.title}`),
    )
    await userEvent.click(
      popover.getByRole('checkbox', { name: 'Publicações' }),
    )
    await userEvent.click(popover.getByRole('checkbox', { name: 'Andamentos' }))
    await expect(rowsIn(filterRegion)).toHaveLength(0)
    await expect(filterGroup.getByText('Nada neste filtro')).toBeVisible()
    await userEvent.click(
      popover.getByRole('checkbox', { name: 'Publicações' }),
    )
    await userEvent.click(popover.getByRole('checkbox', { name: 'Andamentos' }))
    await userEvent.click(
      popover.getByRole('checkbox', { name: 'Só não lidos' }),
    )
    await userEvent.click(popover.getByRole('radio', { name: 'Mais antigos' }))
    await closeFilter()
    await expect(titlesIn()).toEqual(
      [...feed]
        .reverse()
        .map((entry) =>
          entry.unread
            ? `${unreadLabel[entry.kind]}: ${entry.title}`
            : entry.title,
        ),
    )
    popover = await openFilter()
    await userEvent.click(popover.getByRole('radio', { name: 'Mais recentes' }))
    await closeFilter()
    await expect(rowsIn(filterRegion)[0]).toHaveAccessibleName(
      nameOf(first, true),
    )

    const pagedGroup = within(pagedRegion)
    await expect(rowsIn(pagedRegion)).toHaveLength(PAGE)
    await userEvent.click(
      pagedGroup.getByRole('button', {
        name: `Mostrar mais ${feed.length - PAGE} de ${feed.length}`,
      }),
    )
    await expect(rowsIn(pagedRegion)).toHaveLength(feed.length)
    await rowsFit(pagedRegion)
    await userEvent.click(
      pagedGroup.getByRole('button', { name: 'Mostrar menos' }),
    )
    await expect(rowsIn(pagedRegion)).toHaveLength(PAGE)
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <FeedGroup title="Publicações e andamentos" variant="plain" />
      <FilteredFeedGroup
        title="Publicações e andamentos com filtro"
        variant="plain"
      />
      <PagedFeedGroup
        title="Publicações e andamentos paginados"
        variant="plain"
      />
    </div>
  ),
}
