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
import { IconFrame } from '@tc96/ui/icon-frame'
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@tc96/ui/menu'
import {
  Building2Icon,
  EllipsisIcon,
  ExternalLinkIcon,
  PlusIcon,
  Trash2Icon,
  UserRoundIcon,
  UserRoundPlusIcon,
  XIcon,
} from 'lucide-react'
import { type ReactNode, useState } from 'react'

type Role = 'client' | 'counterparty' | 'witness' | 'correspondent' | 'referrer'

type Pole = 'plaintiff' | 'defendant' | 'third_party'

interface Representative {
  id: string
  name: string
  oabNumber: string
  oabUf: string
}

interface Party {
  href: string
  id: string
  kind: 'person' | 'company'
  name: string
  pole: Pole
  representatives: readonly Representative[]
  role: Role
}

const ignore = (..._values: unknown[]) => undefined
const onAddParty = ignore
const onOpenContact = ignore
const onAddRepresentative = ignore

const clientColor = 'var(--info-foreground)'

const roleLabel: Record<Role, string> = {
  client: 'Cliente',
  correspondent: 'Correspondente',
  counterparty: 'Contraparte',
  referrer: 'Indicação',
  witness: 'Testemunha',
}

const roleOrder: readonly Role[] = [
  'client',
  'counterparty',
  'witness',
  'correspondent',
  'referrer',
]

const poleLabel: Record<Pole, string> = {
  defendant: 'Polo passivo',
  plaintiff: 'Polo ativo',
  third_party: 'Terceiro',
}

const parties: readonly Party[] = [
  {
    href: '#/contatos/pessoas/mariana-costa',
    id: 'mariana',
    kind: 'person',
    name: 'Mariana Costa',
    pole: 'plaintiff',
    representatives: [
      { id: 'ana', name: 'Ana Ribeiro', oabNumber: '123456', oabUf: 'SP' },
      { id: 'bruno', name: 'Bruno Tavares', oabNumber: '98765', oabUf: 'SP' },
    ],
    role: 'client',
  },
  {
    href: '#/contatos/empresas/banco-meridional',
    id: 'meridional',
    kind: 'company',
    name: 'Banco Meridional S.A.',
    pole: 'defendant',
    representatives: [
      { id: 'carla', name: 'Carla Mendes', oabNumber: '45678', oabUf: 'RJ' },
      { id: 'diego', name: 'Diego Lima', oabNumber: '23456', oabUf: 'RJ' },
    ],
    role: 'counterparty',
  },
  {
    href: '#/contatos/empresas/seguradora-atlantica',
    id: 'atlantica',
    kind: 'company',
    name: 'Seguradora Atlântica Ltda.',
    pole: 'defendant',
    representatives: [
      {
        id: 'eduardo',
        name: 'Eduardo Nunes',
        oabNumber: '34567',
        oabUf: 'SP',
      },
    ],
    role: 'counterparty',
  },
  {
    href: '#/contatos/pessoas/joao-pereira',
    id: 'joao',
    kind: 'person',
    name: 'João Pereira',
    pole: 'third_party',
    representatives: [],
    role: 'witness',
  },
]

type PartiesSort = 'role' | 'name'

const poleOptions: readonly { label: string; value: Pole }[] = [
  { label: 'Polo ativo', value: 'plaintiff' },
  { label: 'Polo passivo', value: 'defendant' },
  { label: 'Terceiros', value: 'third_party' },
]

const roleOptions: readonly { label: string; value: Role }[] = roleOrder.map(
  (role) => ({ label: roleLabel[role], value: role }),
)

const sortOptions: readonly { label: string; value: PartiesSort }[] = [
  { label: 'Papel', value: 'role' },
  { label: 'Nome', value: 'name' },
]

const oab = (representative: Representative) =>
  `OAB ${representative.oabNumber}/${representative.oabUf}`

const partyMeta = (party: Party) =>
  party.role === 'client'
    ? poleLabel[party.pole]
    : `${roleLabel[party.role]} · ${poleLabel[party.pole]}`

export function PartyFrame({ party }: Readonly<{ party: Party }>) {
  const Icon = party.kind === 'company' ? Building2Icon : UserRoundIcon
  return (
    <IconFrame
      color={party.role === 'client' ? clientColor : undefined}
      shape="rounded"
      size="xs"
    >
      <Icon aria-hidden />
    </IconFrame>
  )
}

export function ClientBadge({ party }: Readonly<{ party: Party }>) {
  return party.role === 'client' ? (
    <RecordStatusBadge color={clientColor}>
      {roleLabel[party.role]}
    </RecordStatusBadge>
  ) : null
}

export function PartyName({ party }: Readonly<{ party: Party }>) {
  return (
    <span
      className={party.role === 'client' ? 'font-medium' : undefined}
      data-party-name=""
    >
      {party.name}
    </span>
  )
}

export function TitleLink({
  children,
  href,
}: Readonly<{ children: ReactNode; href: string }>) {
  return (
    <a
      className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      href={href}
    >
      {children}
    </a>
  )
}

export function RowMenu({
  children,
  label,
}: Readonly<{ children: ReactNode; label: string }>) {
  return (
    <Menu>
      <MenuTrigger
        aria-label={label}
        render={<Button size="icon-sm" variant="ghost" />}
      >
        <EllipsisIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">{children}</MenuPopup>
    </Menu>
  )
}

export function Representatives({
  onRemove,
  party,
}: Readonly<{
  onRemove?: (representativeId: string) => void
  party: Party
}>) {
  if (party.representatives.length === 0) return null
  return (
    <ul
      aria-label={`Representantes de ${party.name}`}
      className="flex flex-col gap-1 ps-8"
    >
      {party.representatives.map((representative) => (
        <li key={representative.id}>
          <RecordGroupItem title={representative.name}>
            <span className="truncate text-muted-foreground">
              {oab(representative)}
            </span>
            {onRemove ? (
              <Button
                aria-label={`Remover representante ${representative.name}`}
                onClick={() => onRemove(representative.id)}
                size="icon-sm"
                variant="ghost"
              >
                <XIcon aria-hidden="true" />
              </Button>
            ) : null}
          </RecordGroupItem>
        </li>
      ))}
    </ul>
  )
}

export function PartiesGroup({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  return (
    <RecordGroup title={title} variant={variant}>
      {parties.map((party) => (
        <div
          className="flex flex-col gap-1"
          data-party={party.id}
          key={party.id}
        >
          <RecordGroupLink
            href={party.href}
            leading={<PartyFrame party={party} />}
            meta={
              <span className="flex items-center gap-2">
                {partyMeta(party)}
                <ClientBadge party={party} />
              </span>
            }
          >
            <PartyName party={party} />
          </RecordGroupLink>
          <Representatives party={party} />
        </div>
      ))}
    </RecordGroup>
  )
}

export function usePartiesView(list: readonly Party[]) {
  const [poles, setPoles] = useState<Pole[]>(
    poleOptions.map((option) => option.value),
  )
  const [roles, setRoles] = useState<Role[]>([...roleOrder])
  const [sort, setSort] = useState<PartiesSort>('role')
  const visible = list
    .filter((party) => poles.includes(party.pole) && roles.includes(party.role))
    .sort((a, b) =>
      sort === 'name'
        ? a.name.localeCompare(b.name, 'pt-BR')
        : roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role),
    )
  const filter = (
    <RecordGroupFilter
      label="Filtrar e ordenar partes"
      sections={[
        {
          label: 'Polo',
          onChange: (next) => setPoles(next as Pole[]),
          options: poleOptions,
          value: poles,
        },
        {
          label: 'Papel',
          onChange: (next) => setRoles(next as Role[]),
          options: roleOptions,
          value: roles,
        },
      ]}
      onSortChange={(next) => setSort(next as PartiesSort)}
      sortLabel="Ordenar por"
      sortOptions={sortOptions}
      sortValue={sort}
    />
  )
  return { filter, visible }
}

export function PartiesMenuGroup({
  title,
  variant,
  withFilter = false,
}: Readonly<{
  title: string
  variant: RecordGroupVariant
  withFilter?: boolean
}>) {
  const [list, setList] = useState<readonly Party[]>(parties)
  const { filter, visible } = usePartiesView(list)
  const rows = withFilter ? visible : list

  const removeParty = (partyId: string) =>
    setList((current) => current.filter((party) => party.id !== partyId))
  const removeRepresentative = (partyId: string, representativeId: string) =>
    setList((current) =>
      current.map((party) =>
        party.id === partyId
          ? {
              ...party,
              representatives: party.representatives.filter(
                (representative) => representative.id !== representativeId,
              ),
            }
          : party,
      ),
    )

  return (
    <RecordGroup
      actions={
        <>
          {withFilter ? filter : null}
          <RecordGroupAction
            icon={PlusIcon}
            label="Adicionar parte"
            onClick={onAddParty}
          />
        </>
      }
      empty={rows.length === 0}
      title={title}
      variant={variant}
    >
      {rows.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Nenhuma parte nos polos escolhidos
        </p>
      ) : null}
      {rows.map((party) => (
        <div
          className="flex flex-col gap-1"
          data-party={party.id}
          key={party.id}
        >
          <RecordGroupItem
            interactive
            leading={<PartyFrame party={party} />}
            title={
              <TitleLink href={party.href}>
                <PartyName party={party} />
              </TitleLink>
            }
          >
            <span className="truncate text-muted-foreground">
              {partyMeta(party)}
            </span>
            <ClientBadge party={party} />
            <RowMenu label={`Ações de ${party.name}`}>
              <MenuItem onClick={() => onOpenContact(party.id)}>
                <ExternalLinkIcon aria-hidden="true" />
                Abrir contato
              </MenuItem>
              <MenuItem onClick={() => onAddRepresentative(party.id)}>
                <UserRoundPlusIcon aria-hidden="true" />
                Adicionar representante
              </MenuItem>
              <MenuSeparator />
              <MenuItem
                onClick={() => removeParty(party.id)}
                variant="destructive"
              >
                <Trash2Icon aria-hidden="true" />
                Remover
              </MenuItem>
            </RowMenu>
          </RecordGroupItem>
          <Representatives
            onRemove={(representativeId) =>
              removeRepresentative(party.id, representativeId)
            }
            party={party}
          />
        </div>
      ))}
    </RecordGroup>
  )
}
