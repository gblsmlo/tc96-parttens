import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconFrame } from '@tc96/elements/icon-frame'
import {
  RecordGroup,
  RecordGroupFilter,
  RecordGroupItem,
  RecordGroupLink,
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
  BriefcaseIcon,
  EllipsisIcon,
  ExternalLinkIcon,
  LinkIcon,
  type LucideIcon,
  PlusIcon,
  ScaleIcon,
  SquareCheckIcon,
  UnlinkIcon,
  UserRoundIcon,
  XIcon,
} from 'lucide-react'
import { type ComponentType, type ReactNode, useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../../.storybook/docs-page.tsx'
import { recordGroupArgTypes } from '../../../../test-utils/story-arg-types'

interface RelationsArgs {
  variant: RecordGroupVariant
}

type RecordType = 'lawsuit' | 'case' | 'lead' | 'task'

type RelationsSort = 'name' | 'recent'

type RecordStatus = 'active' | 'paused' | 'qualified' | 'new' | 'todo'

interface RelatedRecord {
  date?: string
  href: string
  id: string
  linkedOn: string
  name: string
  status: RecordStatus
  type: RecordType
}

interface Proceeding {
  caseNumber: string
  href: string
  id: string
  role: string
}

interface Attachment {
  href: string
  id: string
  title: string
}

const hidden = { table: { disable: true } } as const
const onOpenRecord = fn()
const onLinkRecord = fn()
const onAddProceeding = fn()

const linkTypes: readonly { icon: LucideIcon; label: string; value: string }[] =
  [
    { icon: ScaleIcon, label: 'Processo', value: 'lawsuit' },
    { icon: BriefcaseIcon, label: 'Caso', value: 'case' },
    { icon: UserRoundIcon, label: 'Lead', value: 'lead' },
    { icon: SquareCheckIcon, label: 'Tarefa', value: 'task' },
  ]

const proceedingTypes: readonly {
  icon: LucideIcon
  label: string
  value: string
}[] = [
  { icon: ScaleIcon, label: 'Recurso', value: 'appeal' },
  { icon: ScaleIcon, label: 'Cumprimento', value: 'enforcement' },
  { icon: ScaleIcon, label: 'Cautelar', value: 'precautionary' },
  { icon: ScaleIcon, label: 'Incidental', value: 'incidental' },
  { icon: LinkIcon, label: 'Apenso', value: 'attachment' },
]

function AddMenu({
  items,
  label,
  onSelect,
}: Readonly<{
  items: readonly { icon: LucideIcon; label: string; value: string }[]
  label: string
  onSelect: (value: string) => void
}>) {
  return (
    <Menu>
      <MenuTrigger
        aria-label={label}
        render={<Button size="icon-sm" variant="ghost" />}
      >
        <PlusIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        {items.map(({ icon: Icon, label: itemLabel, value }) => (
          <MenuItem key={value} onClick={() => onSelect(value)}>
            <Icon aria-hidden="true" />
            {itemLabel}
          </MenuItem>
        ))}
      </MenuPopup>
    </Menu>
  )
}

const recordTypes: readonly {
  icon: LucideIcon
  label: string
  value: RecordType
}[] = [
  { icon: ScaleIcon, label: 'Processos', value: 'lawsuit' },
  { icon: BriefcaseIcon, label: 'Casos', value: 'case' },
  { icon: UserRoundIcon, label: 'Leads', value: 'lead' },
  { icon: SquareCheckIcon, label: 'Tarefas', value: 'task' },
]

const typeOptions = recordTypes.map(({ label, value }) => ({ label, value }))

const sortOptions: readonly { label: string; value: RelationsSort }[] = [
  { label: 'Nome', value: 'name' },
  { label: 'Mais recentes', value: 'recent' },
]

const records: readonly RelatedRecord[] = [
  {
    href: '#/juridico/processos/revisional',
    id: 'revisional',
    linkedOn: '2026-10-02',
    status: 'active',
    name: 'Ação revisional bancária',
    type: 'lawsuit',
  },
  {
    href: '#/juridico/processos/execucao',
    id: 'execution',
    linkedOn: '2026-11-10',
    status: 'paused',
    name: 'Execução de título extrajudicial',
    type: 'lawsuit',
  },
  {
    href: '#/juridico/casos/financiamento',
    id: 'financing',
    linkedOn: '2026-09-15',
    status: 'active',
    name: 'Revisão de contrato de financiamento',
    type: 'case',
  },
  {
    href: '#/comercial/leads/maria-souza',
    id: 'maria',
    linkedOn: '2026-11-12',
    status: 'qualified',
    name: 'Maria Souza',
    type: 'lead',
  },
  {
    href: '#/comercial/leads/joao-pereira',
    id: 'joao',
    linkedOn: '2026-08-20',
    status: 'new',
    name: 'João Pereira',
    type: 'lead',
  },
  {
    href: '#/tarefas/procuracao',
    id: 'power-of-attorney',
    linkedOn: '2026-11-18',
    date: '20/11',
    status: 'todo',
    name: 'Enviar procuração ao cliente',
    type: 'task',
  },
]

const proceedings: readonly Proceeding[] = [
  {
    caseNumber: '1002345-67.2025.8.26.0100',
    href: '#/juridico/processos/originario',
    id: 'origin',
    role: 'Originário',
  },
  {
    caseNumber: '2104567-89.2026.8.26.0000',
    href: '#/juridico/processos/recurso',
    id: 'appeal',
    role: 'Recurso',
  },
  {
    caseNumber: '0012345-12.2026.8.26.0100',
    href: '#/juridico/processos/cumprimento',
    id: 'enforcement',
    role: 'Cumprimento',
  },
  {
    caseNumber: '0023456-34.2026.8.26.0100',
    href: '#/juridico/processos/incidente',
    id: 'incident',
    role: 'Incidental',
  },
]

const attachments: readonly Attachment[] = [
  {
    href: '#/juridico/processos/embargos',
    id: 'objection',
    title: 'Embargos à execução',
  },
  {
    href: '#/juridico/processos/cautelar',
    id: 'injunction',
    title: 'Tutela cautelar antecedente',
  },
]

const groupsOf = (list: readonly RelatedRecord[], sort: RelationsSort) =>
  recordTypes.flatMap((type) => {
    const links = list
      .filter((record) => record.type === type.value)
      .sort((a, b) =>
        sort === 'recent'
          ? b.linkedOn.localeCompare(a.linkedOn)
          : a.name.localeCompare(b.name, 'pt-BR'),
      )
    return links.length === 0 ? [] : [{ ...type, links }]
  })

const usage = `
import { IconFrame } from '@acme/elements/icon-frame'
import {
  RecordGroup,
  RecordGroupLink,
  RecordGroupSubgroup,
} from '@acme/patterns'
import { Button } from '@acme/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@acme/ui/menu'

<RecordGroup
  actions={
    <Menu>
      <MenuTrigger aria-label="Link record" render={<Button size="icon-sm" variant="ghost" />}>
        <PlusIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        {recordTypes.map((type) => (
          <MenuItem key={type.value} onClick={() => openPicker(type.value)}>
            <type.icon aria-hidden="true" />
            {type.label}
          </MenuItem>
        ))}
      </MenuPopup>
    </Menu>
  }
  empty={groups.length === 0}
  title="Links"
>
  {groups.map((group, index) => (
    <RecordGroupSubgroup
      defaultOpen={index === 0}
      key={group.type}
      count={group.links.length}
      title={group.label}
    >
      {group.links.map((link) => (
        <RecordGroupLink
          href={link.url}
          key={link.id}
          leading={
            <IconFrame shape="rounded" size="xs">
              <TypeIcon type={group.type} />
            </IconFrame>
          }
          meta={link.status}
        >
          {link.name}
        </RecordGroupLink>
      ))}
    </RecordGroupSubgroup>
  ))}
</RecordGroup>
`

const docs = {
  api: [
    {
      description:
        'One subgroup per record type (lawsuits, cases, leads, tasks), titled by the type, with the count the consumer computes in `count`, right after the title, so the trigger reads the type and the count. Subgroups start closed; the consumer opens the first with `defaultOpen` and drops a type with no link.',
      name: 'RecordGroupSubgroup',
    },
    {
      description:
        'A linked record that opens its own page: an `IconFrame` `xs` with the type icon in `leading`, colored by the record status, the record name and, in `meta`, the date when there is one and the status as a `RecordStatusBadge` of the same color, as in `Layouts/Finance` `Entries`. In `Proceedings` the case number is the name, since it identifies the proceeding and must stay whole, and the role (Originário, Recurso, Cumprimento de sentença, Incidente) is the `meta`.',
      name: 'RecordGroupLink',
    },
    {
      description:
        'A link with an action is a `RecordGroupItem`, since a link row cannot hold a button: the name is a link in `title`, and `children` holds the date, the status badge and the three-dots menu, in that order, (`With Menu`) or the detach button of an attached lawsuit (`Proceedings`).',
      name: 'RecordGroupItem',
    },
    {
      description:
        'In `With Menu`, filters the record types and sorts the links of each type by name or by link date. The consumer applies both; a type left with no link loses its subgroup.',
      name: 'RecordGroupFilter',
    },
  ],
  description: {
    component:
      'The records linked to a record, grouped by type, modeled on the Lemind links section and on the "Vínculos" group of a lawsuit. `Relations` lists the links of each type in a subgroup whose `count` follows the title, with a `+` in `actions` that opens a menu of the record types to link. `Proceedings` lists the other proceedings of a lawsuit by role, with the case number, and the attached lawsuits with a detach button; its `+` lists the proceeding roles and the attachment. `With Menu` gives each link a menu (open, unlink) and adds a `RecordGroupFilter` by type with a sort by name or by most recent. The pattern never groups, counts, filters or sorts: the story does. `Behavior` is under test.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const recordStatus: Record<RecordStatus, { color: string; label: string }> = {
  active: { color: 'var(--info-foreground)', label: 'Em andamento' },
  new: { color: 'var(--muted-foreground)', label: 'Novo' },
  paused: { color: 'var(--warning-foreground)', label: 'Suspenso' },
  qualified: { color: 'var(--success-foreground)', label: 'Qualificado' },
  todo: { color: 'var(--muted-foreground)', label: 'A fazer' },
}

const statusText = (record: RelatedRecord) =>
  [record.date, recordStatus[record.status].label].filter(Boolean).join(' ')

function TypeFrame({
  color,
  icon: Icon,
}: Readonly<{ color?: string; icon: LucideIcon }>) {
  return (
    <IconFrame color={color} shape="rounded" size="xs">
      <Icon aria-hidden />
    </IconFrame>
  )
}

function RecordMeta({ record }: Readonly<{ record: RelatedRecord }>) {
  const status = recordStatus[record.status]
  return (
    <>
      {record.date ? (
        <span className="truncate text-muted-foreground">{record.date}</span>
      ) : null}
      <RecordStatusBadge color={status.color}>{status.label}</RecordStatusBadge>
    </>
  )
}

function TitleLink({
  children,
  href,
}: Readonly<{ children: ReactNode; href: string }>) {
  return (
    <a
      className="truncate rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      href={href}
    >
      {children}
    </a>
  )
}

function EmptyLinks() {
  return (
    <p className="text-muted-foreground text-sm">Nenhum registro vinculado</p>
  )
}

function RelationsGroup({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  const groups = groupsOf(records, 'name')

  return (
    <RecordGroup
      actions={
        <AddMenu
          items={linkTypes}
          label="Vincular registro"
          onSelect={onLinkRecord}
        />
      }
      title={title}
      variant={variant}
    >
      {groups.map((group, index) => (
        <RecordGroupSubgroup
          defaultOpen={index === 0}
          key={group.value}
          count={group.links.length}
          title={group.label}
        >
          {group.links.map((record) => (
            <RecordGroupLink
              href={record.href}
              key={record.id}
              leading={
                <TypeFrame
                  color={recordStatus[record.status].color}
                  icon={group.icon}
                />
              }
              meta={
                <span className="flex items-center gap-2">
                  <RecordMeta record={record} />
                </span>
              }
            >
              {record.name}
            </RecordGroupLink>
          ))}
        </RecordGroupSubgroup>
      ))}
    </RecordGroup>
  )
}

function ProceedingsGroup({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  const [attached, setAttached] = useState(attachments)

  return (
    <RecordGroup
      actions={
        <AddMenu
          items={proceedingTypes}
          label="Adicionar processo vinculado"
          onSelect={onAddProceeding}
        />
      }
      title={title}
      variant={variant}
    >
      <RecordGroupSubgroup
        defaultOpen
        count={proceedings.length}
        title="Processos por papel"
      >
        {proceedings.map((proceeding) => (
          <RecordGroupLink
            href={proceeding.href}
            key={proceeding.id}
            leading={<TypeFrame icon={ScaleIcon} />}
            meta={proceeding.role}
          >
            <span className="tabular-nums">{proceeding.caseNumber}</span>
          </RecordGroupLink>
        ))}
      </RecordGroupSubgroup>
      {attached.length > 0 ? (
        <RecordGroupSubgroup
          defaultOpen
          count={attached.length}
          title="Apensos"
        >
          {attached.map((attachment) => (
            <RecordGroupItem
              interactive
              key={attachment.id}
              leading={<TypeFrame icon={ScaleIcon} />}
              title={
                <TitleLink href={attachment.href}>{attachment.title}</TitleLink>
              }
            >
              <Button
                aria-label={`Desapensar ${attachment.title}`}
                onClick={() =>
                  setAttached((current) =>
                    current.filter((item) => item.id !== attachment.id),
                  )
                }
                size="icon-sm"
                variant="ghost"
              >
                <XIcon aria-hidden="true" />
              </Button>
            </RecordGroupItem>
          ))}
        </RecordGroupSubgroup>
      ) : null}
    </RecordGroup>
  )
}

function RowMenu({
  onUnlink,
  record,
}: Readonly<{ onUnlink: () => void; record: RelatedRecord }>) {
  return (
    <Menu>
      <MenuTrigger
        aria-label={`Ações de ${record.name}`}
        render={<Button size="icon-sm" variant="ghost" />}
      >
        <EllipsisIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        <MenuItem onClick={() => onOpenRecord(record.id)}>
          <ExternalLinkIcon aria-hidden="true" />
          Abrir
        </MenuItem>
        <MenuSeparator />
        <MenuItem onClick={onUnlink} variant="destructive">
          <UnlinkIcon aria-hidden="true" />
          Desvincular
        </MenuItem>
      </MenuPopup>
    </Menu>
  )
}

function RelationsMenuGroup({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  const [linked, setLinked] = useState(records)
  const [types, setTypes] = useState<RecordType[]>(
    recordTypes.map((type) => type.value),
  )
  const [sort, setSort] = useState<RelationsSort>('name')
  const groups = groupsOf(
    linked.filter((record) => types.includes(record.type)),
    sort,
  )

  return (
    <RecordGroup
      actions={
        <>
          <RecordGroupFilter
            filterLabel="Tipo"
            filterOptions={typeOptions}
            filterValue={types}
            label="Filtrar e ordenar vínculos"
            onFilterChange={(next) => setTypes(next as RecordType[])}
            onSortChange={(next) => setSort(next as RelationsSort)}
            sortLabel="Ordenar por"
            sortOptions={sortOptions}
            sortValue={sort}
          />
          <AddMenu
            items={linkTypes}
            label="Vincular registro"
            onSelect={onLinkRecord}
          />
        </>
      }
      empty={groups.length === 0}
      title={title}
      variant={variant}
    >
      {groups.length === 0 ? <EmptyLinks /> : null}
      {groups.map((group, index) => (
        <RecordGroupSubgroup
          defaultOpen={index === 0}
          key={group.value}
          count={group.links.length}
          title={group.label}
        >
          {group.links.map((record) => (
            <RecordGroupItem
              interactive
              key={record.id}
              leading={
                <TypeFrame
                  color={recordStatus[record.status].color}
                  icon={group.icon}
                />
              }
              title={<TitleLink href={record.href}>{record.name}</TitleLink>}
            >
              <RecordMeta record={record} />
              <RowMenu
                onUnlink={() =>
                  setLinked((current) =>
                    current.filter((item) => item.id !== record.id),
                  )
                }
                record={record}
              />
            </RecordGroupItem>
          ))}
        </RecordGroupSubgroup>
      ))}
    </RecordGroup>
  )
}

const meta = {
  args: { variant: 'plain' },
  argTypes: { variant: recordGroupArgTypes.variant },
  component: RecordGroupSubgroup as unknown as ComponentType<RelationsArgs>,
  decorators: [
    (Story) => (
      <div className="w-96 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  title: 'Patterns/Records/Group/Layouts/Relations',
} satisfies Meta<RelationsArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Relations: Story = {
  render: ({ variant }) => (
    <RelationsGroup title="Vínculos" variant={variant} />
  ),
}

export const Proceedings: Story = {
  render: ({ variant }) => (
    <ProceedingsGroup title="Vínculos" variant={variant} />
  ),
}

export const WithMenu: Story = {
  render: ({ variant }) => (
    <RelationsMenuGroup title="Vínculos" variant={variant} />
  ),
}

const rowsFit = async (region: HTMLElement) => {
  for (const row of region.querySelectorAll<HTMLElement>(
    '[data-slot="record-group-item"], [data-slot="record-group-link"]',
  )) {
    await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth)
  }
}

const triggerNames = (region: HTMLElement) =>
  within(region)
    .getAllByRole('heading', { level: 3 })
    .map((heading) => heading.textContent)

const openSubgroup = async (region: HTMLElement, name: RegExp) => {
  const trigger = within(region).getByRole('button', { name })
  if (trigger.getAttribute('aria-expanded') === 'false')
    await userEvent.click(trigger)
  await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'))
}

export const Behavior: Story = {
  argTypes: { variant: hidden },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const relationsRegion = canvas.getByRole('region', { name: 'Vínculos' })
    const proceedingsRegion = canvas.getByRole('region', {
      name: 'Vínculos do processo',
    })
    const menuRegion = canvas.getByRole('region', {
      name: 'Vínculos com menu',
    })

    onLinkRecord.mockClear()
    await userEvent.click(
      within(relationsRegion).getByRole('button', {
        name: 'Vincular registro',
      }),
    )
    await expect(
      (await screen.findAllByRole('menuitem')).map((item) => item.textContent),
    ).toEqual(linkTypes.map((type) => type.label))
    await userEvent.click(screen.getByRole('menuitem', { name: 'Lead' }))
    await expect(onLinkRecord).toHaveBeenCalledWith('lead')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())

    onAddProceeding.mockClear()
    await userEvent.click(
      within(proceedingsRegion).getByRole('button', {
        name: 'Adicionar processo vinculado',
      }),
    )
    await expect(
      (await screen.findAllByRole('menuitem')).map((item) => item.textContent),
    ).toEqual(proceedingTypes.map((type) => type.label))
    await userEvent.click(screen.getByRole('menuitem', { name: 'Apenso' }))
    await expect(onAddProceeding).toHaveBeenCalledWith('attachment')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    const relations = within(relationsRegion)

    await expect(triggerNames(relationsRegion)).toEqual([
      'Processos2',
      'Casos1',
      'Leads2',
      'Tarefas1',
    ])
    await expect(
      relations.getByRole('button', { name: 'Processos 2' }),
    ).toHaveAttribute('aria-expanded', 'true')
    await expect(
      relations.getByRole('button', { name: 'Leads 2' }),
    ).toHaveAttribute('aria-expanded', 'false')
    await expect(relations.getAllByRole('link')).toHaveLength(2)

    await openSubgroup(relationsRegion, /^Leads/)
    const lawsuitLinks = records.filter((record) => record.type === 'lawsuit')
    const leadLinks = records
      .filter((record) => record.type === 'lead')
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
    const links = relations.getAllByRole('link')
    for (const [index, record] of [...lawsuitLinks, ...leadLinks].entries()) {
      await expect(links[index]).toHaveAccessibleName(
        `${record.name} ${statusText(record)}`,
      )
      await expect(links[index]).toHaveAttribute('href', record.href)
    }

    await userEvent.click(relations.getByRole('button', { name: 'Leads 2' }))
    await waitFor(() =>
      expect(
        relations.queryByRole('link', { name: /^Maria Souza/ }),
      ).toBeNull(),
    )
    await expect(
      relations.getByRole('button', { name: 'Leads 2' }),
    ).toHaveAttribute('aria-expanded', 'false')
    await rowsFit(relationsRegion)

    const proceedingsGroup = within(proceedingsRegion)
    const roleLinks = within(
      proceedingsGroup
        .getByRole('heading', { name: /^Processos por papel/ })
        .closest('[data-slot="record-group-subgroup"]') as HTMLElement,
    ).getAllByRole('link')
    for (const [index, proceeding] of proceedings.entries()) {
      await expect(roleLinks[index]).toHaveAccessibleName(
        `${proceeding.caseNumber} ${proceeding.role}`,
      )
      await expect(roleLinks[index]).toHaveAttribute('href', proceeding.href)
    }
    await rowsFit(proceedingsRegion)
    for (const link of roleLinks) {
      const panel = link.closest(
        '[data-slot="collapsible-panel"]',
      ) as HTMLElement
      const linkBox = link.getBoundingClientRect()
      const panelBox = panel.getBoundingClientRect()
      const name = link.querySelector(
        '[data-slot="record-group-link-name"]',
      ) as HTMLElement
      await expect(linkBox.left).toBeGreaterThanOrEqual(panelBox.left - 0.5)
      await expect(linkBox.right).toBeLessThanOrEqual(panelBox.right + 0.5)
      await expect(name.scrollWidth).toBeLessThanOrEqual(name.clientWidth)
    }
    await expect(
      proceedingsGroup.getByRole('button', { name: 'Apensos 2' }),
    ).toBeVisible()
    await userEvent.click(
      proceedingsGroup.getByRole('button', {
        name: 'Desapensar Embargos à execução',
      }),
    )
    await expect(
      proceedingsGroup.queryByRole('link', { name: 'Embargos à execução' }),
    ).toBeNull()
    await expect(
      proceedingsGroup.getByRole('button', { name: 'Apensos 1' }),
    ).toBeVisible()

    const menuGroup = within(menuRegion)
    await rowsFit(menuRegion)
    await openSubgroup(menuRegion, /^Leads/)
    await userEvent.click(
      menuGroup.getByRole('button', { name: 'Ações de Maria Souza' }),
    )
    await expect(
      (await screen.findAllByRole('menuitem')).map((item) => item.textContent),
    ).toEqual(['Abrir', 'Desvincular'])
    await userEvent.click(screen.getByRole('menuitem', { name: 'Desvincular' }))
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    await expect(
      menuGroup.queryByRole('link', { name: 'Maria Souza' }),
    ).toBeNull()
    await expect(
      menuGroup.getByRole('button', { name: 'Leads 1' }),
    ).toBeVisible()

    const titlesIn = () =>
      [...menuRegion.querySelectorAll('[data-slot="record-group-item"] a')].map(
        (link) => link.textContent,
      )
    await expect(titlesIn()).toEqual([
      'Ação revisional bancária',
      'Execução de título extrajudicial',
      'João Pereira',
    ])

    await userEvent.click(
      menuGroup.getByRole('button', { name: 'Filtrar e ordenar vínculos' }),
    )
    const dialog = within(await screen.findByRole('dialog'))
    await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
    await userEvent.click(dialog.getByRole('checkbox', { name: 'Casos' }))
    await expect(menuGroup.queryByRole('button', { name: /^Casos/ })).toBeNull()
    await expect(triggerNames(menuRegion)).toEqual([
      'Processos2',
      'Leads1',
      'Tarefas1',
    ])
    await userEvent.click(dialog.getByRole('radio', { name: 'Mais recentes' }))
    await expect(titlesIn()).toEqual([
      'Execução de título extrajudicial',
      'Ação revisional bancária',
      'João Pereira',
    ])
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await rowsFit(menuRegion)
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <RelationsGroup title="Vínculos" variant="plain" />
      <ProceedingsGroup title="Vínculos do processo" variant="plain" />
      <RelationsMenuGroup title="Vínculos com menu" variant="plain" />
    </div>
  ),
}
