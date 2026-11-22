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
import { IconFrame } from '@tc96/ui/icon-frame'
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
import { type ReactNode, useState } from 'react'

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

const ignore = (..._values: unknown[]) => undefined
const onOpenRecord = ignore
const onLinkRecord = ignore
const onAddProceeding = ignore

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

export function AddMenu({
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

const recordStatus: Record<RecordStatus, { color: string; label: string }> = {
  active: { color: 'var(--info-foreground)', label: 'Em andamento' },
  new: { color: 'var(--muted-foreground)', label: 'Novo' },
  paused: { color: 'var(--warning-foreground)', label: 'Suspenso' },
  qualified: { color: 'var(--success-foreground)', label: 'Qualificado' },
  todo: { color: 'var(--muted-foreground)', label: 'A fazer' },
}

export function TypeFrame({
  color,
  icon: Icon,
}: Readonly<{ color?: string; icon: LucideIcon }>) {
  return (
    <IconFrame color={color} shape="rounded" size="xs">
      <Icon aria-hidden />
    </IconFrame>
  )
}

export function RecordMeta({ record }: Readonly<{ record: RelatedRecord }>) {
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

export function TitleLink({
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

export function EmptyLinks() {
  return (
    <p className="text-muted-foreground text-sm">Nenhum registro vinculado</p>
  )
}

export function RelationsGroup({
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

export function ProceedingsGroup({
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

export function RowMenu({
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

export function RelationsMenuGroup({
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
