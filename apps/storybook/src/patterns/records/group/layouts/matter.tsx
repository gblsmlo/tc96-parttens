import { IconFrame } from '@tc96/elements/icon-frame'
import {
  RecordGroup,
  RecordGroupFilter,
  RecordGroupItem,
  RecordGroupLink,
  type RecordGroupVariant,
  RecordStatusBadge,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from '@tc96/ui/menu'
import {
  Building2Icon,
  type LucideIcon,
  PlusIcon,
  UserRoundIcon,
} from 'lucide-react'
import { useState } from 'react'

interface Representative {
  id: string
  name: string
  oab: string
}

interface Party {
  client: boolean
  href: string
  id: string
  kind: 'company' | 'person'
  name: string
  pole: Pole
  representatives: readonly Representative[]
  roleAndPole: string
}

type Pole = 'plaintiff' | 'defendant' | 'third_party'

type MatterSort = 'process' | 'name'

const poleOptions: readonly { label: string; value: Pole }[] = [
  { label: 'Polo ativo', value: 'plaintiff' },
  { label: 'Polo passivo', value: 'defendant' },
  { label: 'Terceiros', value: 'third_party' },
]

const sortOptions: readonly { label: string; value: MatterSort }[] = [
  { label: 'Ordem do processo', value: 'process' },
  { label: 'Nome', value: 'name' },
]
const ignore = (..._values: unknown[]) => undefined
const onAdd = ignore

const kindFrame = {
  company: { color: '#7c3aed', icon: Building2Icon },
  person: { color: '#2563eb', icon: UserRoundIcon },
} as const

const clientColor = 'var(--info-foreground)'

const parties: readonly Party[] = [
  {
    client: true,
    href: '#/contatos/pessoas/mariana-costa',
    id: 'mariana',
    kind: 'person',
    name: 'Mariana Costa',
    representatives: [
      { id: 'ana', name: 'Ana Ribeiro', oab: 'OAB 123456/SP' },
      { id: 'bruno', name: 'Bruno Tavares', oab: 'OAB 98765/SP' },
    ],
    pole: 'plaintiff',
    roleAndPole: 'Polo ativo',
  },
  {
    client: false,
    href: '#/contatos/empresas/banco-meridional',
    id: 'meridional',
    kind: 'company',
    name: 'Banco Meridional S.A.',
    representatives: [
      { id: 'carla', name: 'Carla Mendes', oab: 'OAB 45678/RJ' },
    ],
    pole: 'defendant',
    roleAndPole: 'Contraparte · Polo passivo',
  },
  {
    client: false,
    href: '#/contatos/pessoas/joao-pereira',
    id: 'joao',
    kind: 'person',
    name: 'João Pereira',
    representatives: [],
    pole: 'third_party',
    roleAndPole: 'Testemunha · Terceiros',
  },
]

const addGroups: readonly {
  items: readonly { icon: LucideIcon; label: string; value: string }[]
  label: string
}[] = [
  {
    items: [
      { icon: UserRoundIcon, label: 'Pessoa', value: 'party-person' },
      { icon: Building2Icon, label: 'Empresa', value: 'party-company' },
    ],
    label: 'Parte',
  },
]

export function AddMenu() {
  return (
    <Menu>
      <MenuTrigger
        aria-label="Adicionar ao processo"
        render={<Button size="icon-sm" variant="ghost" />}
      >
        <PlusIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        {addGroups.map((group) => (
          <MenuGroup key={group.label}>
            <MenuGroupLabel>{group.label}</MenuGroupLabel>
            {group.items.map(({ icon: Icon, label, value }) => (
              <MenuItem key={value} onClick={() => onAdd(value)}>
                <Icon aria-hidden="true" />
                {label}
              </MenuItem>
            ))}
          </MenuGroup>
        ))}
      </MenuPopup>
    </Menu>
  )
}

export function PartyFrame({ party }: Readonly<{ party: Party }>) {
  const { color, icon: Icon } = kindFrame[party.kind]
  return (
    <IconFrame color={color} shape="rounded" size="xs">
      <Icon aria-hidden />
    </IconFrame>
  )
}

export function PartyRows({ party }: Readonly<{ party: Party }>) {
  return (
    <div className="flex flex-col" data-party={party.id}>
      <RecordGroupLink
        href={party.href}
        leading={<PartyFrame party={party} />}
        meta={
          party.client ? (
            <RecordStatusBadge color={clientColor}>Cliente</RecordStatusBadge>
          ) : (
            party.roleAndPole
          )
        }
      >
        {party.name}
      </RecordGroupLink>
      {party.representatives.length > 0 ? (
        <ul
          aria-label={`Representantes de ${party.name}`}
          className="flex flex-col ps-8"
        >
          {party.representatives.map((lawyer) => (
            <li key={lawyer.id}>
              <RecordGroupItem title={lawyer.name}>
                <span className="truncate text-muted-foreground">
                  {lawyer.oab}
                </span>
              </RecordGroupItem>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

const byName = <T,>(list: readonly T[], name: (item: T) => string) =>
  [...list].sort((x, y) => name(x).localeCompare(name(y), 'pt-BR'))

export function MatterGroup({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  const [poles, setPoles] = useState<Pole[]>(
    poleOptions.map((option) => option.value),
  )
  const [sort, setSort] = useState<MatterSort>('process')
  const visibleParties = parties.filter((party) => poles.includes(party.pole))
  const sortedParties =
    sort === 'name'
      ? byName(visibleParties, (party) => party.name)
      : visibleParties

  return (
    <RecordGroup
      actions={
        <>
          <RecordGroupFilter
            label="Filtrar e ordenar o processo"
            onSortChange={(next) => setSort(next as MatterSort)}
            sections={[
              {
                label: 'Polo',
                onChange: (next) => setPoles(next as Pole[]),
                options: poleOptions,
                value: poles,
              },
            ]}
            sortLabel="Ordenar por"
            sortOptions={sortOptions}
            sortValue={sort}
          />
          <AddMenu />
        </>
      }
      empty={sortedParties.length === 0}
      title={title}
      variant={variant}
    >
      {sortedParties.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Nada a exibir com os filtros escolhidos
        </p>
      ) : null}
      {sortedParties.map((party) => (
        <PartyRows key={party.id} party={party} />
      ))}
    </RecordGroup>
  )
}
