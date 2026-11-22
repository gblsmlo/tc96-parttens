import {
  RecordGroup,
  RecordGroupDivider,
  RecordGroupFilter,
  RecordGroupItem,
  RecordGroupSubgroup,
  type RecordGroupVariant,
  RecordStatusBadge,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { IconFrame } from '@tc96/ui/icon-frame'
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
  HandshakeIcon,
  ListTodoIcon,
  type LucideIcon,
  MailIcon,
  MessageCircleIcon,
  PencilIcon,
  PhoneIcon,
  PinIcon,
  PinOffIcon,
  PlusIcon,
  StickyNoteIcon,
  Trash2Icon,
  VideoIcon,
} from 'lucide-react'
import { Fragment, type ReactNode, useState } from 'react'

type Channel = 'in_person' | 'phone' | 'whatsapp' | 'email' | 'video'

type NextStep = 'none' | 'pending' | 'done'

type ServiceSort = 'recent' | 'oldest'

type ServiceSection = 'entries' | 'notes'

interface ServiceEntry {
  author: string
  channel: Channel
  date: string
  href: string
  id: string
  nextStep: NextStep
  summary: string
}

interface ServiceNote {
  author: string
  date: string
  href: string
  id: string
  pinned: boolean
  title: string
}

const ignore = (..._values: unknown[]) => undefined
const onAdd = ignore
const onOpenEntry = ignore
const onEditEntry = ignore
const onNextStep = ignore
const onDeleteEntry = ignore
const onOpenNote = ignore
const onTogglePin = ignore
const onDeleteNote = ignore

const channelFrame: Record<
  Channel,
  { color: string; icon: LucideIcon; label: string }
> = {
  email: { color: '#ea580c', icon: MailIcon, label: 'E-mail' },
  in_person: { color: '#7c3aed', icon: HandshakeIcon, label: 'Presencial' },
  phone: { color: '#2563eb', icon: PhoneIcon, label: 'Telefone' },
  video: { color: '#db2777', icon: VideoIcon, label: 'Videochamada' },
  whatsapp: { color: '#059669', icon: MessageCircleIcon, label: 'WhatsApp' },
}

const noteColor = '#d97706'

const channelOptions: readonly { label: string; value: Channel }[] = (
  ['in_person', 'phone', 'whatsapp', 'email', 'video'] as const
).map((value) => ({ label: channelFrame[value].label, value }))

const authorOptions: readonly { label: string; value: string }[] = [
  { label: 'Júlia Andrade', value: 'Júlia Andrade' },
  { label: 'Marcos Lima', value: 'Marcos Lima' },
]

const sortOptions: readonly { label: string; value: ServiceSort }[] = [
  { label: 'Mais recentes', value: 'recent' },
  { label: 'Mais antigos', value: 'oldest' },
]

const entries: readonly ServiceEntry[] = [
  {
    author: 'Júlia Andrade',
    channel: 'whatsapp',
    date: '2026-11-14',
    href: '#/juridico/processos/1002345/atendimentos/whatsapp-documentos',
    id: 'documents',
    nextStep: 'pending',
    summary: 'Cliente enviou os extratos bancários de 2024 e 2025',
  },
  {
    author: 'Marcos Lima',
    channel: 'in_person',
    date: '2026-11-03',
    href: '#/juridico/processos/1002345/atendimentos/reuniao-estrategia',
    id: 'meeting',
    nextStep: 'done',
    summary: 'Reunião para alinhar a estratégia da réplica',
  },
  {
    author: 'Júlia Andrade',
    channel: 'phone',
    date: '2026-10-22',
    href: '#/juridico/processos/1002345/atendimentos/ligacao-audiencia',
    id: 'hearing',
    nextStep: 'none',
    summary: 'Dúvidas sobre a audiência de conciliação',
  },
  {
    author: 'Marcos Lima',
    channel: 'email',
    date: '2026-10-09',
    href: '#/juridico/processos/1002345/atendimentos/email-procuracao',
    id: 'proxy',
    nextStep: 'pending',
    summary: 'Envio da procuração para assinatura digital',
  },
  {
    author: 'Júlia Andrade',
    channel: 'video',
    date: '2026-09-25',
    href: '#/juridico/processos/1002345/atendimentos/videochamada-inicial',
    id: 'kickoff',
    nextStep: 'done',
    summary: 'Primeira conversa sobre a revisão do contrato',
  },
]

const initialNotes: readonly ServiceNote[] = [
  {
    author: 'Marcos Lima',
    date: '2026-11-10',
    href: '#/juridico/processos/1002345/notas/tese-juros',
    id: 'thesis',
    pinned: false,
    title: 'Tese sobre a capitalização de juros',
  },
  {
    author: 'Júlia Andrade',
    date: '2026-10-30',
    href: '#/juridico/processos/1002345/notas/preferencia-contato',
    id: 'contact',
    pinned: true,
    title: 'Cliente prefere contato por WhatsApp à tarde',
  },
  {
    author: 'Marcos Lima',
    date: '2026-10-05',
    href: '#/juridico/processos/1002345/notas/documentos-faltantes',
    id: 'missing',
    pinned: false,
    title: 'Documentos que ainda faltam',
  },
]

const nextStepStatus = {
  done: { color: 'var(--success-foreground)', label: 'Concluído' },
  pending: { color: 'var(--warning-foreground)', label: 'Pendente' },
} as const

const formatDate = (iso: string) => iso.split('-').reverse().join('/')

const sortByDate = <T extends { date: string }>(
  list: readonly T[],
  sort: ServiceSort,
) =>
  [...list].sort((x, y) =>
    sort === 'recent'
      ? y.date.localeCompare(x.date)
      : x.date.localeCompare(y.date),
  )

const titleLinkClassName =
  'rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'

export function ChannelFrame({ channel }: Readonly<{ channel: Channel }>) {
  const { color, icon: Icon } = channelFrame[channel]
  return (
    <IconFrame color={color} data-channel={channel} shape="rounded" size="xs">
      <Icon aria-hidden />
    </IconFrame>
  )
}

export function RowMenu({
  children,
  name,
}: Readonly<{ children: ReactNode; name: string }>) {
  return (
    <Menu>
      <MenuTrigger
        aria-label={`Ações de ${name}`}
        render={<Button size="icon-sm" variant="ghost" />}
      >
        <EllipsisIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">{children}</MenuPopup>
    </Menu>
  )
}

export function EntryRow({ entry }: Readonly<{ entry: ServiceEntry }>) {
  const status =
    entry.nextStep === 'none' ? null : nextStepStatus[entry.nextStep]
  return (
    <RecordGroupItem
      interactive
      leading={<ChannelFrame channel={entry.channel} />}
      title={
        <a className={titleLinkClassName} href={entry.href}>
          <span className="sr-only">{channelFrame[entry.channel].label}: </span>
          {entry.summary}
        </a>
      }
    >
      <span className="shrink-0 text-muted-foreground tabular-nums">
        {formatDate(entry.date)}
      </span>
      {status ? (
        <RecordStatusBadge color={status.color}>
          {status.label}
        </RecordStatusBadge>
      ) : null}
      <RowMenu name={entry.summary}>
        <MenuItem onClick={() => onOpenEntry(entry.id)}>
          <ExternalLinkIcon aria-hidden="true" />
          Abrir
        </MenuItem>
        <MenuItem onClick={() => onEditEntry(entry.id)}>
          <PencilIcon aria-hidden="true" />
          Editar
        </MenuItem>
        {entry.nextStep === 'pending' ? (
          <MenuItem onClick={() => onNextStep(entry.id, 'complete')}>
            <CircleCheckIcon aria-hidden="true" />
            Concluir próximo passo
          </MenuItem>
        ) : (
          <MenuItem onClick={() => onNextStep(entry.id, 'record')}>
            <ListTodoIcon aria-hidden="true" />
            Registrar próximo passo
          </MenuItem>
        )}
        <MenuSeparator />
        <MenuItem onClick={() => onDeleteEntry(entry.id)} variant="destructive">
          <Trash2Icon aria-hidden="true" />
          Excluir
        </MenuItem>
      </RowMenu>
    </RecordGroupItem>
  )
}

export function NoteRow({
  note,
  onPinChange,
}: Readonly<{ note: ServiceNote; onPinChange: (pinned: boolean) => void }>) {
  return (
    <RecordGroupItem
      interactive
      leading={
        <IconFrame color={noteColor} shape="rounded" size="xs">
          <StickyNoteIcon aria-hidden />
        </IconFrame>
      }
      title={
        <a className={titleLinkClassName} href={note.href}>
          {note.title}
        </a>
      }
    >
      <span className="shrink-0 text-muted-foreground tabular-nums">
        {formatDate(note.date)}
      </span>
      {note.pinned ? (
        <RecordStatusBadge color="var(--muted-foreground)">
          Fixada
        </RecordStatusBadge>
      ) : null}
      <RowMenu name={note.title}>
        <MenuItem onClick={() => onOpenNote(note.id)}>
          <ExternalLinkIcon aria-hidden="true" />
          Abrir
        </MenuItem>
        <MenuItem
          onClick={() => {
            onTogglePin(note.id, !note.pinned)
            onPinChange(!note.pinned)
          }}
        >
          {note.pinned ? (
            <PinOffIcon aria-hidden="true" />
          ) : (
            <PinIcon aria-hidden="true" />
          )}
          {note.pinned ? 'Desafixar' : 'Fixar'}
        </MenuItem>
        <MenuSeparator />
        <MenuItem onClick={() => onDeleteNote(note.id)} variant="destructive">
          <Trash2Icon aria-hidden="true" />
          Excluir
        </MenuItem>
      </RowMenu>
    </RecordGroupItem>
  )
}

export function AddMenu() {
  return (
    <Menu>
      <MenuTrigger
        aria-label="Adicionar ao atendimento"
        render={<Button size="icon-sm" variant="ghost" />}
      >
        <PlusIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        <MenuItem onClick={() => onAdd('entry')}>
          <MessageCircleIcon aria-hidden="true" />
          Novo atendimento
        </MenuItem>
        <MenuItem onClick={() => onAdd('note')}>
          <StickyNoteIcon aria-hidden="true" />
          Nova nota
        </MenuItem>
      </MenuPopup>
    </Menu>
  )
}

export function ServiceGroup({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  const [channels, setChannels] = useState<Channel[]>(
    channelOptions.map((option) => option.value),
  )
  const [authors, setAuthors] = useState<string[]>(
    authorOptions.map((option) => option.value),
  )
  const [sort, setSort] = useState<ServiceSort>('recent')
  const [notes, setNotes] = useState<readonly ServiceNote[]>(initialNotes)

  const visibleEntries = sortByDate(
    entries.filter(
      (entry) =>
        channels.includes(entry.channel) && authors.includes(entry.author),
    ),
    sort,
  )
  const sortedNotes = sortByDate(
    notes.filter((note) => authors.includes(note.author)),
    sort,
  )
  const visibleNotes = [
    ...sortedNotes.filter((note) => note.pinned),
    ...sortedNotes.filter((note) => !note.pinned),
  ]
  const pin = (id: string, pinned: boolean) =>
    setNotes((current) =>
      current.map((note) => (note.id === id ? { ...note, pinned } : note)),
    )

  const children: { content: ReactNode; key: ServiceSection }[] = []
  if (visibleEntries.length > 0) {
    children.push({
      content: (
        <RecordGroupSubgroup
          count={visibleEntries.length}
          defaultOpen
          title="Atendimentos"
        >
          {visibleEntries.map((entry) => (
            <EntryRow entry={entry} key={entry.id} />
          ))}
        </RecordGroupSubgroup>
      ),
      key: 'entries',
    })
  }
  if (visibleNotes.length > 0) {
    children.push({
      content: (
        <RecordGroupSubgroup count={visibleNotes.length} title="Notas">
          {visibleNotes.map((note) => (
            <NoteRow
              key={note.id}
              note={note}
              onPinChange={(pinned) => pin(note.id, pinned)}
            />
          ))}
        </RecordGroupSubgroup>
      ),
      key: 'notes',
    })
  }

  return (
    <RecordGroup
      actions={
        <>
          <RecordGroupFilter
            label="Filtrar e ordenar o atendimento"
            onSortChange={(next) => setSort(next as ServiceSort)}
            sections={[
              {
                label: 'Canal',
                onChange: (next) => setChannels(next as Channel[]),
                options: channelOptions,
                value: channels,
              },
              {
                label: 'Autor',
                onChange: setAuthors,
                options: authorOptions,
                value: authors,
              },
            ]}
            sortLabel="Ordenar por"
            sortOptions={sortOptions}
            sortValue={sort}
          />
          <AddMenu />
        </>
      }
      empty={children.length === 0}
      title={title}
      variant={variant}
    >
      {children.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Nenhum atendimento ou nota com os filtros escolhidos
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

export function EntriesGroup({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  return (
    <RecordGroup
      actions={
        <Button
          aria-label="Novo atendimento"
          onClick={() => onAdd('entry')}
          size="icon-sm"
          variant="ghost"
        >
          <PlusIcon aria-hidden="true" />
        </Button>
      }
      title={title}
      variant={variant}
    >
      {sortByDate(entries, 'recent').map((entry) => (
        <EntryRow entry={entry} key={entry.id} />
      ))}
    </RecordGroup>
  )
}
