import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconFrame } from '@tc96/elements/icon-frame'
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
import { type ComponentType, Fragment, type ReactNode, useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../../.storybook/docs-page.tsx'
import { recordGroupArgTypes } from '../../../../test-utils/story-arg-types'

interface ServiceArgs {
  variant: RecordGroupVariant
}

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

const hidden = { table: { disable: true } } as const

const onAdd = fn()
const onOpenEntry = fn()
const onEditEntry = fn()
const onNextStep = fn()
const onDeleteEntry = fn()
const onOpenNote = fn()
const onTogglePin = fn()
const onDeleteNote = fn()

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

const usage = `
import { IconFrame } from '@acme/elements/icon-frame'
import {
  RecordGroup,
  RecordGroupDivider,
  RecordGroupFilter,
  RecordGroupItem,
  RecordGroupSubgroup,
  RecordStatusBadge,
} from '@acme/patterns'

<RecordGroup
  actions={
    <>
      <RecordGroupFilter label="Filtrar e ordenar o atendimento" sections={sections} sortOptions={sortOptions} />
      <AddToServiceMenu />
    </>
  }
  title="Atendimento"
>
  <RecordGroupSubgroup count={entries.length} defaultOpen title="Atendimentos">
    {entries.map((entry) => (
      <RecordGroupItem
        interactive
        key={entry.id}
        leading={<ChannelFrame channel={entry.channel} />}
        title={<a href={entry.url}>{entry.summary}</a>}
      >
        <span className="text-muted-foreground">{entry.date}</span>
        {entry.pending ? <RecordStatusBadge color="var(--warning-foreground)">Pendente</RecordStatusBadge> : null}
        <EntryMenu entry={entry} />
      </RecordGroupItem>
    ))}
  </RecordGroupSubgroup>
  <RecordGroupDivider />
  <RecordGroupSubgroup count={notes.length} title="Notas">
    {notes.map((note) => (
      <RecordGroupItem interactive key={note.id} leading={<NoteFrame />} title={<a href={note.url}>{note.title}</a>}>
        <span className="text-muted-foreground">{note.date}</span>
        <NoteMenu note={note} />
      </RecordGroupItem>
    ))}
  </RecordGroupSubgroup>
</RecordGroup>
`

const docs = {
  api: [
    {
      description:
        'Two children: `Atendimentos` (open by default) and `Notas`, each with its `count` after the title. They carry no actions: the only trigger is the `+` of the parent header, whose menu offers Novo atendimento and Nova nota. A subgroup that the filter leaves empty is not rendered, and neither is its divider.',
      name: 'RecordGroupSubgroup',
    },
    {
      description:
        'Between `Atendimentos` and `Notas`, only while both are shown.',
      name: 'RecordGroupDivider',
    },
    {
      description:
        'Two `sections`, Canal (which applies to the service entries) and Autor (which applies to both lists), and a sort by date, Mais recentes or Mais antigos. The story applies them; the counts follow.',
      name: 'RecordGroupFilter',
    },
    {
      description:
        'A service entry is an `interactive` item: an `IconFrame` `xs` with one fixed color and icon per channel (Presencial, Telefone, WhatsApp, E-mail, Videochamada) in `leading`, the summary as the title link, then the date, a `RecordStatusBadge` for the next step (Pendente or Concluído, none when no next step was recorded) and the three-dots menu. The menu offers Concluir próximo passo for a pending step and Registrar próximo passo otherwise. A note has the same shape, with a fixed note color, a Fixada badge when pinned and a menu that toggles Fixar and Desafixar; pinned notes come first.',
      name: 'RecordGroupItem',
    },
  ],
  description: {
    component:
      'A proposal for the service log ("Atendimento") of a Lemind Processo, a planned feature (US-18: date, channel, participants, summary and next step, shown on the lawsuit timeline). `Grouped` is one `RecordGroup` with `Atendimentos` and `Notas` split by `RecordGroupDivider`, a `RecordGroupFilter` by channel and author with a sort by date, and one `+` in the header; the notes are built in Lemind but not shown on the page. `Entries` is the service list alone, for a page that shows only that. The alternative is to record a service as one more entry type in Atividades instead of a group of its own. `Behavior` is under test.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

function ChannelFrame({ channel }: Readonly<{ channel: Channel }>) {
  const { color, icon: Icon } = channelFrame[channel]
  return (
    <IconFrame color={color} data-channel={channel} shape="rounded" size="xs">
      <Icon aria-hidden />
    </IconFrame>
  )
}

function RowMenu({
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

function EntryRow({ entry }: Readonly<{ entry: ServiceEntry }>) {
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

function NoteRow({
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

function AddMenu() {
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

function ServiceGroup({
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

function EntriesGroup({
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

const meta = {
  args: { variant: 'plain' },
  argTypes: { variant: recordGroupArgTypes.variant },
  component: RecordGroupSubgroup as unknown as ComponentType<ServiceArgs>,
  decorators: [
    (Story) => (
      <div className="w-96 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  title: 'Patterns/Records/Group/Layouts/Service',
} satisfies Meta<ServiceArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Grouped: Story = {
  render: ({ variant }) => (
    <ServiceGroup title="Atendimento" variant={variant} />
  ),
}

export const Entries: Story = {
  render: ({ variant }) => (
    <EntriesGroup title="Atendimentos" variant={variant} />
  ),
}

const rowsFit = async (region: HTMLElement) => {
  for (const row of region.querySelectorAll<HTMLElement>(
    '[data-slot="record-group-item"]',
  )) {
    await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth)
    const panel = row.closest('[data-slot="collapsible-panel"]')
    const bound = (panel ?? region) as HTMLElement
    await expect(row.getBoundingClientRect().right).toBeLessThanOrEqual(
      bound.getBoundingClientRect().right + 0.5,
    )
  }
}

const rgbOf = (hex: string) =>
  `rgb(${[1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16)).join(', ')})`

const headings = (region: HTMLElement) =>
  within(region)
    .queryAllByRole('heading', { level: 3 })
    .map((heading) => heading.textContent)

const subgroupTitles = (region: HTMLElement, title: string) => {
  const subgroup = [
    ...region.querySelectorAll<HTMLElement>(
      '[data-slot="record-group-subgroup"]',
    ),
  ].find((element) =>
    element.querySelector('h3')?.textContent?.startsWith(title),
  )
  return [
    ...(subgroup?.querySelectorAll<HTMLElement>(
      '[data-slot="record-group-item"] a',
    ) ?? []),
  ].map((link) => link.lastChild?.textContent)
}

const openMenu = async (trigger: HTMLElement) => {
  await userEvent.click(trigger)
  const menu = await screen.findByRole('menu')
  await waitFor(() => expect(menu).toBeVisible())
  return menu
}

const closeMenu = async () => {
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
}

export const Behavior: Story = {
  argTypes: { variant: hidden },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvas.getByRole('region', { name: 'Atendimento' })
    const group = within(region)
    const entriesRegion = canvas.getByRole('region', { name: 'Atendimentos' })

    await expect(headings(region)).toEqual([
      `Atendimentos${entries.length}`,
      `Notas${initialNotes.length}`,
    ])
    await expect(group.getAllByRole('separator')).toHaveLength(1)
    await expect(
      within(entriesRegion).queryAllByRole('heading', { level: 3 }),
    ).toHaveLength(0)

    const entryLinks = within(entriesRegion).getAllByRole('link')
    const recent = sortByDate(entries, 'recent')
    await expect(entryLinks.map((link) => link.lastChild?.textContent)).toEqual(
      recent.map((entry) => entry.summary),
    )
    for (const [index, entry] of recent.entries()) {
      await expect(entryLinks[index]).toHaveAttribute('href', entry.href)
      const row = entryLinks[index]?.closest(
        '[data-slot="record-group-item"]',
      ) as HTMLElement
      await expect(row).toHaveAttribute('data-interactive', 'true')
      const frame = row.querySelector('[data-slot="icon-frame"]') as HTMLElement
      await expect(getComputedStyle(frame).color).toBe(
        rgbOf(channelFrame[entry.channel].color),
      )
      await expect(frame).toHaveAttribute('data-channel', entry.channel)
      await expect(
        (
          frame.closest('[data-slot="record-group-item"]') as HTMLElement
        ).querySelector('a') as HTMLElement,
      ).toHaveAccessibleName(
        new RegExp(`^${channelFrame[entry.channel].label}: `),
      )
      const badge = row.querySelector('[data-slot="badge"]')
      if (entry.nextStep === 'none') {
        await expect(badge).toBeNull()
      } else {
        await expect(badge).toHaveTextContent(
          nextStepStatus[entry.nextStep].label,
        )
      }
    }
    await rowsFit(region)
    await rowsFit(entriesRegion)

    onAdd.mockClear()
    const addMenu = within(
      await openMenu(
        group.getByRole('button', { name: 'Adicionar ao atendimento' }),
      ),
    )
    await expect(
      addMenu.getAllByRole('menuitem').map((item) => item.textContent),
    ).toEqual(['Novo atendimento', 'Nova nota'])
    await userEvent.click(addMenu.getByRole('menuitem', { name: 'Nova nota' }))
    await expect(onAdd).toHaveBeenCalledWith('note')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())

    const pendingEntry = entries[0] as ServiceEntry
    onNextStep.mockClear()
    const pendingMenu = within(
      await openMenu(
        group.getByRole('button', { name: `Ações de ${pendingEntry.summary}` }),
      ),
    )
    await expect(
      pendingMenu.getAllByRole('menuitem').map((item) => item.textContent),
    ).toEqual(['Abrir', 'Editar', 'Concluir próximo passo', 'Excluir'])
    await userEvent.click(
      pendingMenu.getByRole('menuitem', { name: 'Concluir próximo passo' }),
    )
    await expect(onNextStep).toHaveBeenCalledWith(pendingEntry.id, 'complete')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())

    const doneEntry = entries[1] as ServiceEntry
    const doneMenu = within(
      await openMenu(
        group.getByRole('button', { name: `Ações de ${doneEntry.summary}` }),
      ),
    )
    await expect(
      doneMenu.getAllByRole('menuitem').map((item) => item.textContent),
    ).toEqual(['Abrir', 'Editar', 'Registrar próximo passo', 'Excluir'])
    await expect(
      doneMenu.getByRole('menuitem', { name: 'Excluir' }),
    ).toHaveAttribute('data-variant', 'destructive')
    await closeMenu()

    await userEvent.click(
      group.getByRole('button', { name: `Notas ${initialNotes.length}` }),
    )
    const noteTitles = () => subgroupTitles(region, 'Notas')
    await waitFor(() =>
      expect(noteTitles()).toEqual([
        'Cliente prefere contato por WhatsApp à tarde',
        'Tese sobre a capitalização de juros',
        'Documentos que ainda faltam',
      ]),
    )
    const noteLink = group.getByRole('link', {
      name: 'Tese sobre a capitalização de juros',
    })
    const noteFrame = noteLink
      .closest('[data-slot="record-group-item"]')
      ?.querySelector('[data-slot="icon-frame"]') as HTMLElement
    await expect(getComputedStyle(noteFrame).color).toBe(rgbOf(noteColor))
    await rowsFit(region)

    onTogglePin.mockClear()
    const unpinnedMenu = within(
      await openMenu(
        group.getByRole('button', {
          name: 'Ações de Tese sobre a capitalização de juros',
        }),
      ),
    )
    await expect(
      unpinnedMenu.getAllByRole('menuitem').map((item) => item.textContent),
    ).toEqual(['Abrir', 'Fixar', 'Excluir'])
    await userEvent.click(unpinnedMenu.getByRole('menuitem', { name: 'Fixar' }))
    await expect(onTogglePin).toHaveBeenCalledWith('thesis', true)
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    await expect(noteTitles()).toEqual([
      'Tese sobre a capitalização de juros',
      'Cliente prefere contato por WhatsApp à tarde',
      'Documentos que ainda faltam',
    ])
    const pinnedMenu = within(
      await openMenu(
        group.getByRole('button', {
          name: 'Ações de Tese sobre a capitalização de juros',
        }),
      ),
    )
    await expect(
      pinnedMenu.getAllByRole('menuitem').map((item) => item.textContent),
    ).toEqual(['Abrir', 'Desafixar', 'Excluir'])
    await closeMenu()

    await userEvent.click(
      group.getByRole('button', { name: 'Filtrar e ordenar o atendimento' }),
    )
    const dialogElement = await screen.findByRole('dialog')
    await waitFor(() => expect(dialogElement).toBeVisible())
    const dialog = within(dialogElement)
    const channelSection = within(dialog.getByRole('group', { name: 'Canal' }))
    for (const channel of ['WhatsApp', 'E-mail']) {
      await userEvent.click(
        channelSection.getByRole('checkbox', { name: channel }),
      )
    }
    await expect(headings(region)).toEqual(['Atendimentos3', 'Notas3'])

    await userEvent.click(
      within(dialog.getByRole('group', { name: 'Autor' })).getByRole(
        'checkbox',
        { name: 'Marcos Lima' },
      ),
    )
    await expect(headings(region)).toEqual(['Atendimentos2', 'Notas1'])
    const entryTitles = () => subgroupTitles(region, 'Atendimentos')
    await expect(entryTitles()).toEqual([
      'Dúvidas sobre a audiência de conciliação',
      'Primeira conversa sobre a revisão do contrato',
    ])
    await userEvent.click(dialog.getByRole('radio', { name: 'Mais antigos' }))
    await expect(entryTitles()).toEqual([
      'Primeira conversa sobre a revisão do contrato',
      'Dúvidas sobre a audiência de conciliação',
    ])

    for (const channel of ['Telefone', 'Videochamada']) {
      await userEvent.click(
        channelSection.getByRole('checkbox', { name: channel }),
      )
    }
    await expect(headings(region)).toEqual(['Notas1'])
    await expect(group.queryAllByRole('separator')).toHaveLength(0)

    await userEvent.click(
      within(dialog.getByRole('group', { name: 'Autor' })).getByRole(
        'checkbox',
        { name: 'Júlia Andrade' },
      ),
    )
    await expect(headings(region)).toEqual([])
    await expect(region).toHaveAttribute('data-empty', 'true')
    await expect(
      group.getByText('Nenhum atendimento ou nota com os filtros escolhidos'),
    ).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <ServiceGroup title="Atendimento" variant="plain" />
      <EntriesGroup title="Atendimentos" variant="plain" />
    </div>
  ),
}
