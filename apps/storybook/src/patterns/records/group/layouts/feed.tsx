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
import {
  RecordGroup,
  RecordGroupFilter,
  RecordGroupLink,
  type RecordGroupVariant,
} from '@tc96/ui/patterns'
import { type RefObject, useRef, useState } from 'react'

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

const ignore = (..._values: unknown[]) => undefined
const onCreateDeadline = ignore
const onReviseDecision = ignore

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

export function useFeed() {
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

export function FeedReader({
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

export function FeedRow({
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
      meta={metaOf(entry)}
      onClick={(event) => onOpen(event.currentTarget)}
      render={<button type="button" />}
    >
      {unread ? (
        <span className="sr-only">{`${unreadLabel[entry.kind]}: `}</span>
      ) : null}
      <span
        className={
          unread ? 'font-medium text-primary' : 'text-muted-foreground'
        }
        data-slot="feed-title"
      >
        {entry.title}
      </span>
    </RecordGroupLink>
  )
}

export function EmptyFeed({ show }: Readonly<{ show: boolean }>) {
  return show ? (
    <p className="text-muted-foreground text-sm">Nada neste filtro</p>
  ) : null
}

export function FeedGroup({
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

export function FilteredFeedGroup({
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

export function PagedFeedGroup({
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
