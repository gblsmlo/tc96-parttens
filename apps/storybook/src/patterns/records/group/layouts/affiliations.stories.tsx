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
  CircleOffIcon,
  EllipsisIcon,
  ExternalLinkIcon,
  PencilIcon,
  PlusIcon,
  UserRoundIcon,
} from 'lucide-react'
import { type ComponentType, useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../../.storybook/docs-page.tsx'
import { recordGroupArgTypes } from '../../../../test-utils/story-arg-types'

interface AffiliationsArgs {
  variant: RecordGroupVariant
}

interface Affiliation {
  endedOn: string | null
  href: string
  id: string
  jobTitle: string | null
  kind: 'person' | 'company'
  name: string
  startedOn: string
}

const hidden = { table: { disable: true } } as const
const onLink = fn()
const onOpen = fn()
const onEditJobTitle = fn()

const today = '2026-11-19'

const status = {
  active: { color: 'var(--success-foreground)', label: 'Ativo' },
  ended: { color: 'var(--muted-foreground)', label: 'Encerrado' },
} as const

const people: readonly Affiliation[] = [
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

const companies: readonly Affiliation[] = [
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

const usage = `
import { IconFrame } from '@acme/elements/icon-frame'
import {
  RecordGroup,
  RecordGroupAction,
  RecordGroupLink,
  RecordStatusBadge,
} from '@acme/patterns'

<RecordGroup
  actions={<RecordGroupAction icon={PlusIcon} label="Link person" onClick={linkPerson} />}
  title="People"
>
  {links.map((link) => (
    <RecordGroupLink
      href={link.url}
      key={link.id}
      leading={
        <IconFrame color={kindColor[link.kind]} shape="rounded" size="xs">
          <UserRoundIcon aria-hidden />
        </IconFrame>
      }
      meta={
        <span className="flex items-center gap-2">
          {link.jobTitle}
          <RecordStatusBadge color={statusColor[link.state]}>{statusLabel[link.state]}</RecordStatusBadge>
        </span>
      }
    >
      {link.name}
    </RecordGroupLink>
  ))}
</RecordGroup>
`

const docs = {
  api: [
    {
      description:
        'A link between a company and a person is a `RecordGroupLink` to the other record: an `IconFrame` `xs` in `leading` (a person on a company page, a company on a person page) with one fixed color per record kind (person, company), as `Layouts/Documents` gives one color per file type, the name as content and, in `meta`, the job title of a person (`Sem cargo` when there is none; a company has none) and the state as a `RecordStatusBadge`, success for `Ativo` and muted for `Encerrado`. Active links come first; ended ones follow as history; the name keeps the title ink and only the badge tells the state.',
      name: 'RecordGroupLink',
    },
    {
      description:
        'A link with a menu is a `RecordGroupItem`, since a link row cannot hold a button: the name is a link in `title`, and `children` holds the job title, the state and the three-dots button. The menu offers `Abrir` and `Editar cargo`, and `Encerrar vínculo` only while the link is active.',
      name: 'RecordGroupItem',
    },
    {
      description:
        'In `With Filter`, the filter in `actions` keeps the active or the ended links and sorts them by start date or by name. The story filters and sorts; the pattern only lays the rows out.',
      name: 'RecordGroupFilter',
    },
  ],
  description: {
    component:
      'A relationship with a job title, modeled on the Lemind company "Pessoas" and person "Empresas" groups: who works at a company, or where a person works, with the job title and whether the link is active or ended. The consumer orders the links (active first, then history) and ends a link; the pattern only lays the rows out. `Affiliations` is read-only, `With Menu` adds the menu of each link (`Editar cargo` calls the consumer) and the end of a link, which moves it to the history in the story state, and `With Filter` adds a `RecordGroupFilter` by state with a sort by start date or name. `Behavior` is under test.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const kindColor = {
  company: '#7c3aed',
  person: '#2563eb',
} as const

function AffiliationFrame({
  affiliation,
}: Readonly<{ affiliation: Affiliation }>) {
  const Icon = affiliation.kind === 'company' ? Building2Icon : UserRoundIcon
  return (
    <IconFrame color={kindColor[affiliation.kind]} shape="rounded" size="xs">
      <Icon aria-hidden />
    </IconFrame>
  )
}

function StatusBadge({ affiliation }: Readonly<{ affiliation: Affiliation }>) {
  const { color, label } = statusOf(affiliation)
  return <RecordStatusBadge color={color}>{label}</RecordStatusBadge>
}

function AffiliationName({
  affiliation,
}: Readonly<{ affiliation: Affiliation }>) {
  return <span data-affiliation-name="">{affiliation.name}</span>
}

function AffiliationsGroup({
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

function AffiliationRow({
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

function AffiliationsMenuGroup({
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

const rgbOf = (hex: string) =>
  `rgb(${[1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16)).join(', ')})`

const meta = {
  args: { variant: 'plain' },
  argTypes: { variant: recordGroupArgTypes.variant },
  component: RecordGroupLink as unknown as ComponentType<AffiliationsArgs>,
  decorators: [
    (Story) => (
      <div className="w-96 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  title: 'Patterns/Records/Group/Layouts/Affiliations',
} satisfies Meta<AffiliationsArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Affiliations: Story = {
  render: ({ variant }) => (
    <AffiliationsGroup links={people} title="Pessoas" variant={variant} />
  ),
}

export const WithMenu: Story = {
  render: ({ variant }) => (
    <AffiliationsMenuGroup title="Pessoas" variant={variant} />
  ),
}

export const WithFilter: Story = {
  render: ({ variant }) => (
    <AffiliationsMenuGroup title="Pessoas" variant={variant} withFilter />
  ),
}

const rowsFit = async (region: HTMLElement) => {
  for (const row of region.querySelectorAll<HTMLElement>(
    '[data-slot="record-group-row"], [data-slot="record-group-item"], [data-slot="record-group-link"]',
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

const namesIn = (region: HTMLElement) =>
  [...region.querySelectorAll('[data-affiliation-name]')].map(
    (name) => name.textContent,
  )

const badgesIn = (region: HTMLElement) =>
  [
    ...region.querySelectorAll<HTMLElement>(
      '[data-slot="record-group-content"] [data-slot="badge"]',
    ),
  ].map((badge) => badge.textContent)

export const Behavior: Story = {
  argTypes: { variant: hidden },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const peopleRegion = canvas.getByRole('region', { name: 'Pessoas' })
    const companiesRegion = canvas.getByRole('region', { name: 'Empresas' })
    const menuRegion = canvas.getByRole('region', { name: 'Pessoas com menu' })
    const filterRegion = canvas.getByRole('region', {
      name: 'Pessoas com filtro',
    })

    for (const region of [
      peopleRegion,
      companiesRegion,
      menuRegion,
      filterRegion,
    ]) {
      await rowsFit(region)
    }

    const links = within(peopleRegion).getAllByRole('link')
    await expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '#/contatos/pessoas/paulo-andrade',
      '#/contatos/pessoas/mariana-costa',
      '#/contatos/pessoas/lucia-ferraz',
      '#/contatos/pessoas/roberto-sampaio',
    ])
    await expect(links[0]).toHaveAccessibleName(
      'Paulo Henrique Andrade Gerente financeiro Ativo',
    )
    await expect(links[1]).toHaveAccessibleName(
      'Mariana Costa Diretora jurídica Ativo',
    )
    await expect(links[2]).toHaveAccessibleName(
      'Lúcia Ferraz Analista de contratos Encerrado',
    )
    await expect(links[3]).toHaveAccessibleName(
      'Roberto Sampaio Sem cargo Encerrado',
    )
    for (const [index, link] of links.entries()) {
      const color = index < 2 ? status.active.color : status.ended.color
      const badge = link.querySelector('[data-slot="badge"]') as HTMLElement
      const frame = link.querySelector(
        '[data-slot="icon-frame"]',
      ) as HTMLElement
      await expect(badge.getAttribute('style')).toContain(color)
      await expect(getComputedStyle(frame).color).toBe(rgbOf(kindColor.person))
    }
    const names = [
      ...peopleRegion.querySelectorAll<HTMLElement>('[data-affiliation-name]'),
    ]
    await expect(getComputedStyle(names[2] as HTMLElement).color).toBe(
      getComputedStyle(names[0] as HTMLElement).color,
    )

    await expect(
      within(companiesRegion)
        .getAllByRole('link')
        .map((link) => link.textContent),
    ).toEqual(['Construtora HorizonteAtivo', 'Grupo Vale VerdeEncerrado'])

    const menuGroup = within(menuRegion)
    await expect(
      await menuItemsFor(menuGroup, 'Ações de Mariana Costa'),
    ).toEqual(['Abrir', 'Editar cargo', 'Encerrar vínculo'])
    await expect(
      await menuItemsFor(menuGroup, 'Ações de Lúcia Ferraz'),
    ).toEqual(['Abrir'])
    await expect(menuGroup.queryAllByRole('textbox')).toHaveLength(0)

    onEditJobTitle.mockClear()
    await userEvent.click(
      menuGroup.getByRole('button', { name: 'Ações de Mariana Costa' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Editar cargo' }),
    )
    await expect(onEditJobTitle).toHaveBeenCalledWith('mariana')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())

    await userEvent.click(
      menuGroup.getByRole('button', {
        name: 'Ações de Paulo Henrique Andrade',
      }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Encerrar vínculo' }),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    await expect(namesIn(menuRegion)).toEqual([
      'Mariana Costa',
      'Paulo Henrique Andrade',
      'Lúcia Ferraz',
      'Roberto Sampaio',
    ])
    await expect(badgesIn(menuRegion)).toEqual([
      'Ativo',
      'Encerrado',
      'Encerrado',
      'Encerrado',
    ])
    const paulo = within(menuRegion)
      .getByRole('link', { name: 'Paulo Henrique Andrade' })
      .closest('[data-slot="record-group-item"]') as HTMLElement
    await expect(paulo).toHaveTextContent('Gerente financeiro')
    await expect(
      await menuItemsFor(menuGroup, 'Ações de Paulo Henrique Andrade'),
    ).toEqual(['Abrir'])
    await rowsFit(menuRegion)

    const filterGroup = within(filterRegion)
    await userEvent.click(
      filterGroup.getByRole('button', { name: 'Filtrar e ordenar vínculos' }),
    )
    const dialogElement = await screen.findByRole('dialog')
    await waitFor(() => expect(dialogElement).toBeVisible())
    const dialog = within(dialogElement)
    await userEvent.click(dialog.getByRole('checkbox', { name: 'Ativos' }))
    await expect(namesIn(filterRegion)).toEqual([
      'Lúcia Ferraz',
      'Roberto Sampaio',
    ])
    await userEvent.click(dialog.getByRole('checkbox', { name: 'Ativos' }))
    await userEvent.click(dialog.getByRole('radio', { name: 'Nome' }))
    await expect(namesIn(filterRegion)).toEqual([
      'Lúcia Ferraz',
      'Mariana Costa',
      'Paulo Henrique Andrade',
      'Roberto Sampaio',
    ])
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <AffiliationsGroup links={people} title="Pessoas" variant="plain" />
      <AffiliationsGroup links={companies} title="Empresas" variant="plain" />
      <AffiliationsMenuGroup title="Pessoas com menu" variant="plain" />
      <AffiliationsMenuGroup
        title="Pessoas com filtro"
        variant="plain"
        withFilter
      />
    </div>
  ),
}
