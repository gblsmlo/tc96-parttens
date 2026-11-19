import type { Meta, StoryObj } from '@storybook/react-vite'
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
import { type ComponentType, useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../../.storybook/docs-page.tsx'
import { recordGroupArgTypes } from '../../../../test-utils/story-arg-types'

interface MatterArgs {
  variant: RecordGroupVariant
}

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

const hidden = { table: { disable: true } } as const

const poleOptions: readonly { label: string; value: Pole }[] = [
  { label: 'Polo ativo', value: 'plaintiff' },
  { label: 'Polo passivo', value: 'defendant' },
  { label: 'Terceiros', value: 'third_party' },
]

const sortOptions: readonly { label: string; value: MatterSort }[] = [
  { label: 'Ordem do processo', value: 'process' },
  { label: 'Nome', value: 'name' },
]
const onAdd = fn()

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

const usage = `
import { IconFrame } from '@acme/elements/icon-frame'
import { RecordGroup, RecordGroupFilter, RecordGroupItem, RecordGroupLink } from '@acme/patterns'

<RecordGroup actions={<><PartiesFilter /><AddPartyMenu /></>} title="Process">
  {parties.map((party) => (
    <div className="flex flex-col" key={party.id}>
      <RecordGroupLink href={party.url} leading={<PartyFrame party={party} />} meta={party.roleAndPole}>
        {party.name}
      </RecordGroupLink>
      <div className="ps-8">
        {party.representatives.map((lawyer) => (
          <RecordGroupItem key={lawyer.id} title={lawyer.name}>
            <span className="truncate text-muted-foreground">{lawyer.oab}</span>
          </RecordGroupItem>
        ))}
      </div>
    </div>
  ))}
</RecordGroup>
`

const docs = {
  api: [
    {
      description:
        'The parties of the lawsuit as its direct children, with no subgroup or divider since they are its only job. The header holds a `RecordGroupFilter` and the only `+`, whose menu adds a party (a person or a company).',
      name: 'RecordGroup',
    },
    {
      description:
        'A party opens its contact: an `IconFrame` `xs` with one color per kind (person, company), the name and, in `meta`, the role and the pole; the client shows a `RecordStatusBadge` instead.',
      name: 'RecordGroupLink',
    },
    {
      description:
        'A representative of a party, indented to the party name, with the OAB registration as trailing text, as in `Layouts/Parties`.',
      name: 'RecordGroupItem',
    },
    {
      description:
        'Filters the parties by pole (Polo) and sorts them by the order of the lawsuit or by name; the story applies both.',
      name: 'RecordGroupFilter',
    },
  ],
  description: {
    component:
      'The lawsuit (matter) of a record page as one `RecordGroup` of its parties, modeled on the Lemind Processo page: each party with its role, pole and lawyers, a `RecordGroupFilter` and one `+` in the header. Decided by the owner: the proceedings (originário, recursos, cumprimento, cautelar, incidental and apensos) moved to `Layouts/Court`, and each group keeps its own `+`, so this one adds only parties. The filter has one section, Polo, and sorts by the order of the lawsuit or by name; the story applies both. It follows `Layouts/Parties`. `Behavior` is under test.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

function AddMenu() {
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

function PartyFrame({ party }: Readonly<{ party: Party }>) {
  const { color, icon: Icon } = kindFrame[party.kind]
  return (
    <IconFrame color={color} shape="rounded" size="xs">
      <Icon aria-hidden />
    </IconFrame>
  )
}

function PartyRows({ party }: Readonly<{ party: Party }>) {
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

function MatterGroup({
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

const meta = {
  args: { variant: 'plain' },
  argTypes: { variant: recordGroupArgTypes.variant },
  component: RecordGroupLink as unknown as ComponentType<MatterArgs>,
  decorators: [
    (Story) => (
      <div className="w-96 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  title: 'Patterns/Records/Group/Layouts/Matter',
} satisfies Meta<MatterArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Grouped: Story = {
  render: ({ variant }) => <MatterGroup title="Processo" variant={variant} />,
}

const rowsFit = async (region: HTMLElement) => {
  for (const row of region.querySelectorAll<HTMLElement>(
    '[data-slot="record-group-item"], [data-slot="record-group-link"]',
  )) {
    await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth)
    const panel = row.closest('[data-slot="collapsible-panel"]') as HTMLElement
    await expect(row.getBoundingClientRect().right).toBeLessThanOrEqual(
      panel.getBoundingClientRect().right + 0.5,
    )
  }
}

export const Behavior: Story = {
  argTypes: { variant: hidden },
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole('region', {
      name: 'Processo',
    })
    const group = within(region)

    await expect(group.queryAllByRole('heading', { level: 3 })).toHaveLength(0)
    await expect(group.queryAllByRole('separator')).toHaveLength(0)
    await expect(
      region.querySelector('[data-slot="record-group-subgroup"]'),
    ).toBeNull()
    await expect(
      group
        .getAllByRole('button')
        .filter((button) => button.getAttribute('aria-haspopup') === 'menu'),
    ).toHaveLength(1)

    await expect(
      group.getByRole('link', { name: 'Mariana Costa Cliente' }),
    ).toHaveAttribute('href', '#/contatos/pessoas/mariana-costa')
    await expect(
      group.getByRole('link', {
        name: 'Banco Meridional S.A. Contraparte · Polo passivo',
      }),
    ).toBeVisible()
    await expect(
      within(
        group.getByRole('list', { name: 'Representantes de Mariana Costa' }),
      )
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['Ana RibeiroOAB 123456/SP', 'Bruno TavaresOAB 98765/SP'])
    await expect(
      group.queryByRole('list', { name: 'Representantes de João Pereira' }),
    ).toBeNull()
    await rowsFit(region)

    onAdd.mockClear()
    await userEvent.click(
      group.getByRole('button', { name: 'Adicionar ao processo' }),
    )
    const menuElement = await screen.findByRole('menu')
    await waitFor(() => expect(menuElement).toBeVisible())
    const menu = within(menuElement)
    await expect(menu.getAllByRole('group')).toHaveLength(addGroups.length)
    await expect(
      menu.getAllByRole('menuitem').map((item) => item.textContent),
    ).toEqual(['Pessoa', 'Empresa'])
    await userEvent.click(menu.getByRole('menuitem', { name: 'Empresa' }))
    await expect(onAdd).toHaveBeenCalledWith('party-company')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())

    const partyNames = () =>
      [
        ...region.querySelectorAll<HTMLElement>(
          '[data-party] > [data-slot="record-group-link"] [data-slot="record-group-link-name"]',
        ),
      ].map((name) => name.textContent)
    await userEvent.click(
      group.getByRole('button', { name: 'Filtrar e ordenar o processo' }),
    )
    const dialogElement = await screen.findByRole('dialog')
    await waitFor(() => expect(dialogElement).toBeVisible())
    const dialog = within(dialogElement)
    await expect(dialog.queryByRole('group', { name: 'Exibir' })).toBeNull()
    const poles = within(dialog.getByRole('group', { name: 'Polo' }))

    await userEvent.click(poles.getByRole('checkbox', { name: 'Polo passivo' }))
    await expect(partyNames()).toEqual(['Mariana Costa', 'João Pereira'])
    await userEvent.click(dialog.getByRole('radio', { name: 'Nome' }))
    await expect(partyNames()).toEqual(['João Pereira', 'Mariana Costa'])

    for (const option of ['Polo ativo', 'Terceiros']) {
      await userEvent.click(poles.getByRole('checkbox', { name: option }))
    }
    await expect(partyNames()).toEqual([])
    await expect(region).toHaveAttribute('data-empty', 'true')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
  render: () => <MatterGroup title="Processo" variant="plain" />,
}
