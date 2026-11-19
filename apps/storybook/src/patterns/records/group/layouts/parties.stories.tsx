import type { Meta, StoryObj } from '@storybook/react-vite'
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
  EllipsisIcon,
  ExternalLinkIcon,
  PlusIcon,
  Trash2Icon,
  UserRoundIcon,
  UserRoundPlusIcon,
  XIcon,
} from 'lucide-react'
import { type ComponentType, type ReactNode, useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../../.storybook/docs-page.tsx'
import { recordGroupArgTypes } from '../../../../test-utils/story-arg-types'

interface PartiesArgs {
  variant: RecordGroupVariant
}

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

const hidden = { table: { disable: true } } as const
const onAddParty = fn()
const onOpenContact = fn()
const onAddRepresentative = fn()

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

const usage = `
import { IconFrame } from '@acme/elements/icon-frame'
import {
  RecordGroup,
  RecordGroupAction,
  RecordGroupItem,
  RecordGroupLink,
  RecordStatusBadge,
} from '@acme/patterns'

<RecordGroup
  actions={<RecordGroupAction icon={PlusIcon} label="Add party" onClick={addParty} />}
  title="Parties"
>
  {parties.map((party) => (
    <div className="flex flex-col gap-1" key={party.id}>
      <RecordGroupLink
        href={party.url}
        leading={
          <IconFrame color={party.isClient ? clientColor : undefined} shape="rounded" size="xs">
            {party.isCompany ? <Building2Icon aria-hidden /> : <UserRoundIcon aria-hidden />}
          </IconFrame>
        }
        meta={
          <span className="flex items-center gap-2">
            {party.roleAndPole}
            {party.isClient ? <RecordStatusBadge color={clientColor}>Client</RecordStatusBadge> : null}
          </span>
        }
      >
        <span className={party.isClient ? 'font-medium' : undefined}>{party.name}</span>
      </RecordGroupLink>
      <ul aria-label={\`Representatives of \${party.name}\`} className="flex flex-col gap-1 ps-8">
        {party.representatives.map((representative) => (
          <li key={representative.id}>
            <RecordGroupItem title={representative.name}>
              <span className="truncate text-muted-foreground">{representative.oab}</span>
            </RecordGroupItem>
          </li>
        ))}
      </ul>
    </div>
  ))}
</RecordGroup>
`

const docs = {
  api: [
    {
      description:
        'A party that only opens its contact is a `RecordGroupLink`: an `IconFrame` `xs` in `leading` whose icon tells a person from a company, the name as content and, in `meta`, the role and the pole. The client is the one highlighted party: its name is `font-medium`, its role becomes a `RecordStatusBadge` and the frame takes the same color as the badge.',
      name: 'RecordGroupLink',
    },
    {
      description:
        'A party with a menu is a `RecordGroupItem`, since a link row cannot hold a button: the name is a link in `title`, and `children` holds the role and pole, the client badge and the three-dots button (`Abrir contato`, `Adicionar representante`, `Remover`). Each representative is a `RecordGroupItem` too, with the OAB registration as trailing text and, in `With Menu`, a remove button.',
      name: 'RecordGroupItem',
    },
    {
      description:
        'In `With Filter`, the filter in `actions` has two checkbox `sections`, Polo and Papel, keeps the parties that match both and sorts them by role or by name. The story filters and sorts; the pattern only lays the rows out.',
      name: 'RecordGroupFilter',
    },
  ],
  description: {
    component:
      'The parties of a lawsuit or a case, modeled on the Lemind "Partes" group: each party with its role (client, counterparty, witness, correspondent, referrer), its pole (active, passive, third party) and the lawyers who represent it, with their OAB registration. The representatives sit under their party as a list indented to the party name (`ps-8`, the width of the `IconFrame` `xs` and its gap), wrapped with the party row in one column. A `RecordGroupSubgroup` was rejected for this nesting: its trigger is a button, so the party row could hold neither the link to the contact nor the party menu, and it starts closed, which would hide the lawyers that are the point of the list. `Parties` is read-only, `With Menu` adds the party menu, the remove button of each representative and the `Adicionar parte` action, and `With Filter` adds a `RecordGroupFilter` by pole and by role with a sort by role or name. `Behavior` is under test.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

function PartyFrame({ party }: Readonly<{ party: Party }>) {
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

function ClientBadge({ party }: Readonly<{ party: Party }>) {
  return party.role === 'client' ? (
    <RecordStatusBadge color={clientColor}>
      {roleLabel[party.role]}
    </RecordStatusBadge>
  ) : null
}

function PartyName({ party }: Readonly<{ party: Party }>) {
  return (
    <span
      className={party.role === 'client' ? 'font-medium' : undefined}
      data-party-name=""
    >
      {party.name}
    </span>
  )
}

function TitleLink({
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

function RowMenu({
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

function Representatives({
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

function PartiesGroup({
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

function usePartiesView(list: readonly Party[]) {
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

function PartiesMenuGroup({
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

const meta = {
  args: { variant: 'plain' },
  argTypes: { variant: recordGroupArgTypes.variant },
  component: RecordGroupItem as unknown as ComponentType<PartiesArgs>,
  decorators: [
    (Story) => (
      <div className="w-96 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  title: 'Patterns/Records/Group/Layouts/Parties',
} satisfies Meta<PartiesArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Parties: Story = {
  render: ({ variant }) => <PartiesGroup title="Partes" variant={variant} />,
}

export const WithMenu: Story = {
  render: ({ variant }) => (
    <PartiesMenuGroup title="Partes" variant={variant} />
  ),
}

export const WithFilter: Story = {
  render: ({ variant }) => (
    <PartiesMenuGroup title="Partes" variant={variant} withFilter />
  ),
}

const rowsFit = async (region: HTMLElement) => {
  for (const row of region.querySelectorAll<HTMLElement>(
    '[data-slot="record-group-item"], [data-slot="record-group-link"]',
  )) {
    await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth)
  }
}

const menuItemsFor = async (
  group: ReturnType<typeof within>,
  label: string,
) => {
  await userEvent.click(group.getByRole('button', { name: label }))
  const items = (await screen.findAllByRole('menuitem')).map(
    (item) => item.textContent,
  )
  await userEvent.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  return items
}

const partyNamesIn = (region: HTMLElement) =>
  [...region.querySelectorAll('[data-party-name]')].map(
    (name) => name.textContent,
  )

export const Behavior: Story = {
  argTypes: { variant: hidden },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const partiesRegion = canvas.getByRole('region', { name: 'Partes' })
    const menuRegion = canvas.getByRole('region', { name: 'Partes com menu' })
    const filterRegion = canvas.getByRole('region', {
      name: 'Partes com filtro',
    })

    for (const region of [partiesRegion, menuRegion, filterRegion]) {
      await rowsFit(region)
    }

    const links = within(partiesRegion).getAllByRole('link')
    await expect(links).toHaveLength(parties.length)
    await expect(links[0]).toHaveAccessibleName(
      'Mariana Costa Polo ativo Cliente',
    )
    await expect(links[1]).toHaveAccessibleName(
      'Banco Meridional S.A. Contraparte · Polo passivo',
    )
    await expect(links[3]).toHaveAccessibleName(
      'João Pereira Testemunha · Terceiro',
    )
    for (const [index, party] of parties.entries()) {
      await expect(links[index]).toHaveAttribute('href', party.href)
    }

    const names = [
      ...partiesRegion.querySelectorAll<HTMLElement>('[data-party-name]'),
    ]
    await expect(getComputedStyle(names[0] as HTMLElement).fontWeight).toBe(
      '500',
    )
    for (const name of names.slice(1)) {
      await expect(getComputedStyle(name).fontWeight).toBe('400')
    }
    const badges = partiesRegion.querySelectorAll<HTMLElement>(
      '[data-slot="badge"]',
    )
    await expect(badges).toHaveLength(1)
    await expect(links[0]).toContainElement(badges[0] as HTMLElement)
    await expect(badges[0]?.getAttribute('style')).toContain(clientColor)
    const frame = links[0]?.querySelector(
      '[data-slot="icon-frame"]',
    ) as HTMLElement
    await expect(frame.getAttribute('style')).toContain(clientColor)

    for (const party of parties) {
      const block = partiesRegion.querySelector(
        `[data-party="${party.id}"]`,
      ) as HTMLElement
      const list = within(block).queryByRole('list', {
        name: `Representantes de ${party.name}`,
      })
      if (party.representatives.length === 0) {
        await expect(list).toBeNull()
        continue
      }
      await expect(
        within(list as HTMLElement)
          .getAllByRole('listitem')
          .map((item) => item.textContent),
      ).toEqual(
        party.representatives.map(
          (representative) => `${representative.name}${oab(representative)}`,
        ),
      )
      const partyRow = within(block).getByRole('link')
      const firstRepresentative = within(list as HTMLElement).getAllByRole(
        'listitem',
      )[0] as HTMLElement
      await expect(
        firstRepresentative.getBoundingClientRect().left -
          partyRow.getBoundingClientRect().left,
      ).toBeGreaterThan(0)
    }

    const menuGroup = within(menuRegion)
    await expect(
      await menuItemsFor(menuGroup, 'Ações de Banco Meridional S.A.'),
    ).toEqual(['Abrir contato', 'Adicionar representante', 'Remover'])
    onAddRepresentative.mockClear()
    await userEvent.click(
      menuGroup.getByRole('button', { name: 'Ações de Mariana Costa' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Adicionar representante' }),
    )
    await expect(onAddRepresentative).toHaveBeenCalledWith('mariana')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())

    await userEvent.click(
      menuGroup.getByRole('button', {
        name: 'Remover representante Diego Lima',
      }),
    )
    await expect(
      within(
        menuGroup.getByRole('list', {
          name: 'Representantes de Banco Meridional S.A.',
        }),
      )
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['Carla MendesOAB 45678/RJ'])
    await userEvent.click(
      menuGroup.getByRole('button', {
        name: 'Ações de Seguradora Atlântica Ltda.',
      }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Remover' }),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    await expect(partyNamesIn(menuRegion)).toEqual([
      'Mariana Costa',
      'Banco Meridional S.A.',
      'João Pereira',
    ])
    onAddParty.mockClear()
    await userEvent.click(
      menuGroup.getByRole('button', { name: 'Adicionar parte' }),
    )
    await expect(onAddParty).toHaveBeenCalledOnce()

    const filterGroup = within(filterRegion)
    await userEvent.click(
      filterGroup.getByRole('button', { name: 'Filtrar e ordenar partes' }),
    )
    const dialogElement = await screen.findByRole('dialog')
    await waitFor(() => expect(dialogElement).toBeVisible())
    const dialog = within(dialogElement)
    await userEvent.click(dialog.getByRole('radio', { name: 'Nome' }))
    await expect(partyNamesIn(filterRegion)).toEqual([
      'Banco Meridional S.A.',
      'João Pereira',
      'Mariana Costa',
      'Seguradora Atlântica Ltda.',
    ])
    await userEvent.click(
      dialog.getByRole('checkbox', { name: 'Polo passivo' }),
    )
    await expect(partyNamesIn(filterRegion)).toEqual([
      'João Pereira',
      'Mariana Costa',
    ])
    await userEvent.click(
      within(dialog.getByRole('group', { name: 'Papel' })).getByRole(
        'checkbox',
        { name: 'Testemunha' },
      ),
    )
    await expect(partyNamesIn(filterRegion)).toEqual(['Mariana Costa'])
    await userEvent.click(
      within(dialog.getByRole('group', { name: 'Papel' })).getByRole(
        'checkbox',
        { name: 'Testemunha' },
      ),
    )
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await expect(
      await menuItemsFor(filterGroup, 'Ações de João Pereira'),
    ).toEqual(['Abrir contato', 'Adicionar representante', 'Remover'])
    await rowsFit(filterRegion)
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <PartiesGroup title="Partes" variant="plain" />
      <PartiesMenuGroup title="Partes com menu" variant="plain" />
      <PartiesMenuGroup title="Partes com filtro" variant="plain" withFilter />
    </div>
  ),
}
