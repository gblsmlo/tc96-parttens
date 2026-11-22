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
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@tc96/ui/menu'
import {
  Building2Icon,
  CircleOffIcon,
  EllipsisIcon,
  ExternalLinkIcon,
  PencilIcon,
  PlusIcon,
  UserRoundIcon,
} from 'lucide-react'
import { useState } from 'react'

interface Affiliation {
  endedOn: string | null
  href: string
  id: string
  jobTitle: string | null
  kind: 'person' | 'company'
  name: string
  startedOn: string
}

const ignore = (..._values: unknown[]) => undefined
const onLink = ignore
const onOpen = ignore
const onEditJobTitle = ignore

const today = '2026-11-19'

const status = {
  active: { color: 'var(--success-foreground)', label: 'Ativo' },
  ended: { color: 'var(--muted-foreground)', label: 'Encerrado' },
} as const

export const people: readonly Affiliation[] = [
  {
    endedOn: null,
    href: '#/contatos/pessoas/mariana-costa',
    id: 'mariana',
    jobTitle: 'Diretora jurídica',
    kind: 'person',
    name: 'Mariana Costa',
    startedOn: '2021-03-01',
  },
  {
    endedOn: '2020-11-30',
    href: '#/contatos/pessoas/lucia-ferraz',
    id: 'lucia',
    jobTitle: 'Analista de contratos',
    kind: 'person',
    name: 'Lúcia Ferraz',
    startedOn: '2018-02-05',
  },
  {
    endedOn: null,
    href: '#/contatos/pessoas/paulo-andrade',
    id: 'paulo',
    jobTitle: 'Gerente financeiro',
    kind: 'person',
    name: 'Paulo Henrique Andrade',
    startedOn: '2023-08-15',
  },
  {
    endedOn: '2017-06-30',
    href: '#/contatos/pessoas/roberto-sampaio',
    id: 'roberto',
    jobTitle: null,
    kind: 'person',
    name: 'Roberto Sampaio',
    startedOn: '2010-04-01',
  },
]

export const companies: readonly Affiliation[] = [
  {
    endedOn: null,
    href: '#/contatos/empresas/construtora-horizonte',
    id: 'horizonte',
    jobTitle: null,
    kind: 'company',
    name: 'Construtora Horizonte',
    startedOn: '2021-03-01',
  },
  {
    endedOn: '2020-12-18',
    href: '#/contatos/empresas/grupo-vale-verde',
    id: 'vale-verde',
    jobTitle: null,
    kind: 'company',
    name: 'Grupo Vale Verde',
    startedOn: '2016-01-11',
  },
]

const ended = (affiliation: Affiliation) => affiliation.endedOn !== null

const statusOf = (affiliation: Affiliation) =>
  ended(affiliation) ? status.ended : status.active

const jobTitleOf = (affiliation: Affiliation) =>
  affiliation.kind === 'company' ? null : (affiliation.jobTitle ?? 'Sem cargo')

const activeFirst = (list: readonly Affiliation[]) =>
  [...list].sort(
    (a, b) =>
      Number(ended(a)) - Number(ended(b)) ||
      b.startedOn.localeCompare(a.startedOn),
  )

type AffiliationState = 'active' | 'ended'

type AffiliationsSort = 'start' | 'name'

const stateOptions: readonly { label: string; value: AffiliationState }[] = [
  { label: 'Ativos', value: 'active' },
  { label: 'Encerrados', value: 'ended' },
]

const sortOptions: readonly { label: string; value: AffiliationsSort }[] = [
  { label: 'Data de início', value: 'start' },
  { label: 'Nome', value: 'name' },
]

const kindColor = {
  company: '#7c3aed',
  person: '#2563eb',
} as const

export function AffiliationFrame({
  affiliation,
}: Readonly<{ affiliation: Affiliation }>) {
  const Icon = affiliation.kind === 'company' ? Building2Icon : UserRoundIcon
  return (
    <IconFrame color={kindColor[affiliation.kind]} shape="rounded" size="xs">
      <Icon aria-hidden />
    </IconFrame>
  )
}

export function StatusBadge({
  affiliation,
}: Readonly<{ affiliation: Affiliation }>) {
  const { color, label } = statusOf(affiliation)
  return <RecordStatusBadge color={color}>{label}</RecordStatusBadge>
}

export function AffiliationName({
  affiliation,
}: Readonly<{ affiliation: Affiliation }>) {
  return <span data-affiliation-name="">{affiliation.name}</span>
}

export function AffiliationsGroup({
  links,
  title,
  variant,
}: Readonly<{
  links: readonly Affiliation[]
  title: string
  variant: RecordGroupVariant
}>) {
  return (
    <RecordGroup
      actions={
        <RecordGroupAction icon={PlusIcon} label="Vincular" onClick={onLink} />
      }
      title={title}
      variant={variant}
    >
      {activeFirst(links).map((affiliation) => (
        <RecordGroupLink
          href={affiliation.href}
          key={affiliation.id}
          leading={<AffiliationFrame affiliation={affiliation} />}
          meta={
            <span className="flex items-center gap-2">
              {jobTitleOf(affiliation)}
              <StatusBadge affiliation={affiliation} />
            </span>
          }
        >
          <AffiliationName affiliation={affiliation} />
        </RecordGroupLink>
      ))}
    </RecordGroup>
  )
}

export function AffiliationRow({
  affiliation,
  onEnd,
}: Readonly<{
  affiliation: Affiliation
  onEnd: () => void
}>) {
  const active = !ended(affiliation)

  return (
    <RecordGroupItem
      interactive
      leading={<AffiliationFrame affiliation={affiliation} />}
      title={
        <a
          className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={affiliation.href}
        >
          <AffiliationName affiliation={affiliation} />
        </a>
      }
    >
      {jobTitleOf(affiliation) ? (
        <span className="truncate text-muted-foreground">
          {jobTitleOf(affiliation)}
        </span>
      ) : null}
      <StatusBadge affiliation={affiliation} />
      <Menu>
        <MenuTrigger
          aria-label={`Ações de ${affiliation.name}`}
          render={<Button size="icon-sm" variant="ghost" />}
        >
          <EllipsisIcon aria-hidden="true" />
        </MenuTrigger>
        <MenuPopup align="end">
          <MenuItem onClick={() => onOpen(affiliation.id)}>
            <ExternalLinkIcon aria-hidden="true" />
            Abrir
          </MenuItem>
          {active ? (
            <>
              <MenuItem onClick={() => onEditJobTitle(affiliation.id)}>
                <PencilIcon aria-hidden="true" />
                Editar cargo
              </MenuItem>
              <MenuSeparator />
              <MenuItem onClick={onEnd} variant="destructive">
                <CircleOffIcon aria-hidden="true" />
                Encerrar vínculo
              </MenuItem>
            </>
          ) : null}
        </MenuPopup>
      </Menu>
    </RecordGroupItem>
  )
}

export function AffiliationsMenuGroup({
  title,
  variant,
  withFilter = false,
}: Readonly<{
  title: string
  variant: RecordGroupVariant
  withFilter?: boolean
}>) {
  const [links, setLinks] = useState<readonly Affiliation[]>(people)
  const [states, setStates] = useState<AffiliationState[]>(
    stateOptions.map((option) => option.value),
  )
  const [sort, setSort] = useState<AffiliationsSort>('start')
  const ordered = activeFirst(links)
  const rows = withFilter
    ? ordered
        .filter((link) => states.includes(ended(link) ? 'ended' : 'active'))
        .sort((a, b) =>
          sort === 'name'
            ? a.name.localeCompare(b.name, 'pt-BR')
            : b.startedOn.localeCompare(a.startedOn),
        )
    : ordered

  const update = (id: string, changes: Partial<Affiliation>) =>
    setLinks((current) =>
      current.map((link) => (link.id === id ? { ...link, ...changes } : link)),
    )

  return (
    <RecordGroup
      actions={
        <>
          {withFilter ? (
            <RecordGroupFilter
              filterLabel="Situação"
              filterOptions={stateOptions}
              filterValue={states}
              label="Filtrar e ordenar vínculos"
              onFilterChange={(next) => setStates(next as AffiliationState[])}
              onSortChange={(next) => setSort(next as AffiliationsSort)}
              sortLabel="Ordenar por"
              sortOptions={sortOptions}
              sortValue={sort}
            />
          ) : null}
          <RecordGroupAction
            icon={PlusIcon}
            label="Vincular pessoa"
            onClick={onLink}
          />
        </>
      }
      empty={rows.length === 0}
      title={title}
      variant={variant}
    >
      {rows.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Nenhum vínculo na situação escolhida
        </p>
      ) : null}
      {rows.map((affiliation) => (
        <AffiliationRow
          affiliation={affiliation}
          key={affiliation.id}
          onEnd={() => update(affiliation.id, { endedOn: today })}
        />
      ))}
    </RecordGroup>
  )
}
