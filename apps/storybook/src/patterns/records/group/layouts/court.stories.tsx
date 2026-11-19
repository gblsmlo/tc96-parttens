import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  RecordGroup,
  RecordGroupDivider,
  RecordGroupLink,
  RecordGroupRow,
  RecordGroupSubgroup,
  type RecordGroupVariant,
  SelectProperty,
  type SelectPropertyOption,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import {
  ExternalLinkIcon,
  LinkIcon,
  type LucideIcon,
  PlusIcon,
  ScaleIcon,
} from 'lucide-react'
import { type ComponentType, Fragment, useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../../.storybook/docs-page.tsx'
import { recordGroupArgTypes } from '../../../../test-utils/story-arg-types'

interface CourtArgs {
  variant: RecordGroupVariant
}

type ProceedingRole =
  | 'origin'
  | 'appeal'
  | 'enforcement'
  | 'precautionary'
  | 'incidental'
  | 'attachment'

type CourtInstance =
  | 'first_degree'
  | 'second_degree'
  | 'superior'
  | 'supreme'
  | 'other'

interface Proceeding {
  caseNumber: string
  courtLink: string
  courtName: string
  courtInstance: CourtInstance
  href: string
  id: string
  role: ProceedingRole
  stage: string
}

const hidden = { table: { disable: true } } as const
const onAdd = fn()

const roleOptions: readonly SelectPropertyOption[] = [
  { label: 'Originário', value: 'origin' },
  { label: 'Recurso', value: 'appeal' },
  { label: 'Cumprimento', value: 'enforcement' },
  { label: 'Cautelar', value: 'precautionary' },
  { label: 'Incidental', value: 'incidental' },
  { label: 'Apenso', value: 'attachment' },
]

const instanceOptions: readonly SelectPropertyOption[] = [
  { label: '1º grau', value: 'first_degree' },
  { label: '2º grau', value: 'second_degree' },
  { label: 'Tribunal superior', value: 'superior' },
  { label: 'STF', value: 'supreme' },
  { label: 'Outra', value: 'other' },
]

const courtOptions: readonly SelectPropertyOption[] = [
  {
    label: '2ª Vara Cível do Foro Central',
    value: '2ª Vara Cível do Foro Central',
  },
  {
    label: '15ª Câmara de Direito Privado do TJSP',
    value: '15ª Câmara de Direito Privado do TJSP',
  },
  { label: 'Terceira Turma do STJ', value: 'Terceira Turma do STJ' },
]

const addItems: readonly {
  icon: LucideIcon
  label: string
  value: ProceedingRole
}[] = [
  { icon: ScaleIcon, label: 'Recurso', value: 'appeal' },
  { icon: ScaleIcon, label: 'Cumprimento', value: 'enforcement' },
  { icon: ScaleIcon, label: 'Cautelar', value: 'precautionary' },
  { icon: ScaleIcon, label: 'Incidental', value: 'incidental' },
  { icon: LinkIcon, label: 'Apenso', value: 'attachment' },
]

const proceedings: readonly Proceeding[] = [
  {
    caseNumber: '1002345-67.2025.8.26.0100',
    courtInstance: 'first_degree',
    courtLink: 'https://tribunal.example/processos/1002345-67.2025.8.26.0100',
    courtName: '2ª Vara Cível do Foro Central',
    href: '#/juridico/processos/originario',
    id: 'origin',
    role: 'origin',
    stage: '1º grau',
  },
  {
    caseNumber: '2104567-89.2026.8.26.0000',
    courtInstance: 'second_degree',
    courtLink: 'https://tribunal.example/processos/2104567-89.2026.8.26.0000',
    courtName: '15ª Câmara de Direito Privado do TJSP',
    href: '#/juridico/processos/apelacao',
    id: 'appeal',
    role: 'appeal',
    stage: 'TJSP',
  },
  {
    caseNumber: '1987654-32.2026.3.00.0000',
    courtInstance: 'superior',
    courtLink: 'https://tribunal.example/processos/1987654-32.2026.3.00.0000',
    courtName: 'Terceira Turma do STJ',
    href: '#/juridico/processos/recurso-especial',
    id: 'special-appeal',
    role: 'appeal',
    stage: 'STJ',
  },
  {
    caseNumber: '0012345-12.2026.8.26.0100',
    courtInstance: 'first_degree',
    courtLink: 'https://tribunal.example/processos/0012345-12.2026.8.26.0100',
    courtName: '2ª Vara Cível do Foro Central',
    href: '#/juridico/processos/cumprimento',
    id: 'enforcement',
    role: 'enforcement',
    stage: '1º grau',
  },
  {
    caseNumber: '0034567-90.2026.8.26.0100',
    courtInstance: 'first_degree',
    courtLink: 'https://tribunal.example/processos/0034567-90.2026.8.26.0100',
    courtName: '2ª Vara Cível do Foro Central',
    href: '#/juridico/processos/embargos',
    id: 'attachment',
    role: 'attachment',
    stage: '1º grau',
  },
]

const labelOf = (options: readonly SelectPropertyOption[], value: string) =>
  options.find((option) => option.value === value)?.label ?? value

const roleLabel = (role: string) => labelOf(roleOptions, role)

const rowMeta = (proceeding: Proceeding) =>
  `${roleLabel(proceeding.role)} · ${proceeding.stage}`

const rowName = (proceeding: Proceeding) =>
  `${proceeding.caseNumber} ${rowMeta(proceeding)} · ${proceeding.courtName}`

const usage = `
import {
  RecordGroup,
  RecordGroupDivider,
  RecordGroupLink,
  RecordGroupRow,
  RecordGroupSubgroup,
  SelectProperty,
} from '@acme/patterns'

<RecordGroup actions={<AddProceedingMenu />} title="Court">
  {proceedings.map((proceeding) => (
    <RecordGroupLink
      aria-label={\`\${proceeding.caseNumber} \${proceeding.roleLabel} · \${proceeding.stage} · \${proceeding.courtName}\`}
      href={proceeding.url}
      key={proceeding.id}
      meta={\`\${proceeding.roleLabel} · \${proceeding.stage}\`}
      title={proceeding.courtName}
    >
      <span className="tabular-nums">{proceeding.caseNumber}</span>
    </RecordGroupLink>
  ))}
</RecordGroup>

<RecordGroup actions={<AddProceedingMenu />} title="Court">
  {proceedings.map((proceeding, index) => (
    <Fragment key={proceeding.id}>
      {index > 0 ? <RecordGroupDivider /> : null}
      <RecordGroupSubgroup
        defaultOpen={index === 0}
        meta={proceeding.roleLabel}
        title={<span className="tabular-nums">{proceeding.caseNumber}</span>}
      >
        <RecordGroupRow label="Role">
          <SelectProperty ariaLabel={\`Role of \${proceeding.caseNumber}\`} options={roleOptions} value={proceeding.role} variant="plain" />
        </RecordGroupRow>
        <RecordGroupRow label="Instance">…</RecordGroupRow>
        <RecordGroupRow label="Court">…</RecordGroupRow>
        <RecordGroupLink href={proceeding.courtLink} leading={<ExternalLinkIcon aria-hidden />} rel="noopener noreferrer" target="_blank">
          Open at the court
        </RecordGroupLink>
      </RecordGroupSubgroup>
    </Fragment>
  ))}
</RecordGroup>
`

const docs = {
  api: [
    {
      description:
        'The only `+` of the group, a `PlusIcon` menu trigger in `actions` named "Adicionar processo vinculado". Its menu lists the proceedings that can be linked to the lawsuit: Recurso, Cumprimento, Cautelar, Incidental and Apenso. Parties are added from `Layouts/Matter`, not here.',
      name: 'RecordGroup',
    },
    {
      description:
        'One row per proceeding in `Court`: the originário first, the others in tramitação order and the apensos last, in the same row format. The whole row opens the proceeding. The name is the case number in `tabular-nums` and stays whole within a 384px group; `meta` is the role and where the proceeding stands (`1º grau`, `TJSP`, `STJ`), the short form the partner scans. The vara does not fit beside the number, so it goes into the accessible name (`aria-label`: number, role, stage, vara) and the `title` tooltip, and is visible and editable in `With Properties`. In `With Properties` a `RecordGroupLink` "Abrir no tribunal" with an external icon opens `courtLink` in a new tab (`target="_blank"`, `rel="noopener noreferrer"`).',
      name: 'RecordGroupLink',
    },
    {
      description:
        'One per proceeding in `With Properties`: the case number as the title, which wraps instead of truncating, and the role in `meta`. The originário starts open, the others closed, so the lawyer opens the one to file or check.',
      name: 'RecordGroupSubgroup',
    },
    {
      description:
        'Inside each subgroup, one `start` row per property, each with its own `SelectProperty` (`plain`, named by `ariaLabel` with the case number): Papel, Instância (1º grau, 2º grau, Tribunal superior, STF, Outra) and Vara/Tribunal. The story keeps the values in its state.',
      name: 'RecordGroupRow',
    },
    {
      description:
        'Between each pair of proceeding subgroups in `With Properties`, as in `Layouts/Finance` `Grouped`.',
      name: 'RecordGroupDivider',
    },
  ],
  description: {
    component:
      'The proceedings of a lawsuit (its tramitações: originário, recursos, cumprimento, cautelar, incidental and apensos) as one `RecordGroup` "Tribunal", modeled on the Lemind proceedings group, whose fields are case number, court name, court instance and court link. Decided by the owner: the proceedings live only in this group, and `Layouts/Matter` keeps the parties; each group has its own `+`, and this one adds a linked proceeding. `Court` answers "where does it stand": one link row per proceeding, the case number whole as the name and the role with the stage (`Recurso · TJSP`) in `meta`, with the vara in the accessible name and the tooltip because it does not fit the row. `With Properties` serves the lawyer who files or checks a proceeding: each proceeding is a subgroup titled by its number whose rows are selectable properties (Papel, Instância, Vara/Tribunal) and an external link to the court. The pattern never orders, edits or links: the story does. `Behavior` is under test.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

function AddProceedingMenu() {
  return (
    <Menu>
      <MenuTrigger
        aria-label="Adicionar processo vinculado"
        render={<Button size="icon-sm" variant="ghost" />}
      >
        <PlusIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuPopup align="end">
        {addItems.map(({ icon: Icon, label, value }) => (
          <MenuItem key={value} onClick={() => onAdd(value)}>
            <Icon aria-hidden="true" />
            {label}
          </MenuItem>
        ))}
      </MenuPopup>
    </Menu>
  )
}

function CourtGroup({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  return (
    <RecordGroup
      actions={<AddProceedingMenu />}
      title={title}
      variant={variant}
    >
      {proceedings.map((proceeding) => (
        <RecordGroupLink
          aria-label={rowName(proceeding)}
          href={proceeding.href}
          key={proceeding.id}
          meta={rowMeta(proceeding)}
          title={proceeding.courtName}
        >
          <span className="tabular-nums">{proceeding.caseNumber}</span>
        </RecordGroupLink>
      ))}
    </RecordGroup>
  )
}

type ProceedingValues = Record<
  string,
  { court: string | null; instance: string | null; role: string | null }
>

function CourtPropertiesGroup({
  title,
  variant,
}: Readonly<{ title: string; variant: RecordGroupVariant }>) {
  const [values, setValues] = useState<ProceedingValues>(
    Object.fromEntries(
      proceedings.map((proceeding) => [
        proceeding.id,
        {
          court: proceeding.courtName,
          instance: proceeding.courtInstance,
          role: proceeding.role,
        },
      ]),
    ),
  )
  const change =
    (id: string, field: keyof ProceedingValues[string]) =>
    (next: string | null) =>
      setValues((current) => ({
        ...current,
        [id]: { ...current[id], [field]: next },
      }))

  return (
    <RecordGroup
      actions={<AddProceedingMenu />}
      title={title}
      variant={variant}
    >
      {proceedings.map((proceeding, index) => {
        const value = values[proceeding.id]
        return (
          <Fragment key={proceeding.id}>
            {index > 0 ? <RecordGroupDivider /> : null}
            <RecordGroupSubgroup
              defaultOpen={index === 0}
              meta={value.role ? roleLabel(value.role) : null}
              title={
                <span className="tabular-nums">{proceeding.caseNumber}</span>
              }
            >
              <RecordGroupRow label="Papel">
                <SelectProperty
                  ariaLabel={`Papel de ${proceeding.caseNumber}`}
                  onValueChange={change(proceeding.id, 'role')}
                  options={roleOptions}
                  value={value.role}
                  variant="plain"
                />
              </RecordGroupRow>
              <RecordGroupRow label="Instância">
                <SelectProperty
                  ariaLabel={`Instância de ${proceeding.caseNumber}`}
                  onValueChange={change(proceeding.id, 'instance')}
                  options={instanceOptions}
                  value={value.instance}
                  variant="plain"
                />
              </RecordGroupRow>
              <RecordGroupRow label="Vara/Tribunal">
                <SelectProperty
                  ariaLabel={`Vara/Tribunal de ${proceeding.caseNumber}`}
                  onValueChange={change(proceeding.id, 'court')}
                  options={courtOptions}
                  value={value.court}
                  variant="plain"
                />
              </RecordGroupRow>
              <RecordGroupLink
                href={proceeding.courtLink}
                leading={<ExternalLinkIcon aria-hidden />}
                meta={proceeding.stage}
                rel="noopener noreferrer"
                target="_blank"
              >
                Abrir no tribunal
              </RecordGroupLink>
            </RecordGroupSubgroup>
          </Fragment>
        )
      })}
    </RecordGroup>
  )
}

const meta = {
  args: { variant: 'plain' },
  argTypes: { variant: recordGroupArgTypes.variant },
  component: RecordGroupLink as unknown as ComponentType<CourtArgs>,
  decorators: [
    (Story) => (
      <div className="w-96 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  title: 'Patterns/Records/Group/Layouts/Court',
} satisfies Meta<CourtArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Court: Story = {
  render: ({ variant }) => <CourtGroup title="Tribunal" variant={variant} />,
}

export const WithProperties: Story = {
  render: ({ variant }) => (
    <CourtPropertiesGroup title="Tribunal" variant={variant} />
  ),
}

const rowsFit = async (region: HTMLElement) => {
  for (const row of region.querySelectorAll<HTMLElement>(
    '[data-slot="record-group-row"], [data-slot="record-group-link"]',
  )) {
    await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth)
    const panel = row.closest('[data-slot="collapsible-panel"]') as HTMLElement
    await expect(row.getBoundingClientRect().right).toBeLessThanOrEqual(
      panel.getBoundingClientRect().right + 0.5,
    )
  }
}

const numbersWhole = async (region: HTMLElement) => {
  const names = region.querySelectorAll<HTMLElement>(
    '[data-slot="record-group-link-name"]',
  )
  await expect(names.length).toBeGreaterThan(0)
  for (const name of names) {
    await expect(name.scrollWidth).toBeLessThanOrEqual(name.clientWidth)
  }
}

const listboxClosed = () =>
  waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())

const checkAddMenu = async (region: HTMLElement) => {
  const group = within(region)
  const triggers = group
    .getAllByRole('button')
    .filter((button) => button.getAttribute('aria-haspopup') === 'menu')
  await expect(triggers).toHaveLength(1)
  await expect(triggers[0]).toHaveAccessibleName('Adicionar processo vinculado')

  onAdd.mockClear()
  await userEvent.click(triggers[0])
  const menuElement = await screen.findByRole('menu')
  await waitFor(() => expect(menuElement).toBeVisible())
  const menu = within(menuElement)
  await expect(
    menu.getAllByRole('menuitem').map((item) => item.textContent),
  ).toEqual(addItems.map((item) => item.label))
  await userEvent.click(menu.getByRole('menuitem', { name: 'Apenso' }))
  await expect(onAdd).toHaveBeenCalledWith('attachment')
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
}

export const Behavior: Story = {
  argTypes: { variant: hidden },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const courtRegion = canvas.getByRole('region', { name: 'Tribunal' })
    const court = within(courtRegion)

    const links = court.getAllByRole('link')
    await expect(links.map((link) => link.getAttribute('aria-label'))).toEqual(
      proceedings.map(rowName),
    )
    await expect(links[0]).toHaveAccessibleName(
      '1002345-67.2025.8.26.0100 Originário · 1º grau · 2ª Vara Cível do Foro Central',
    )
    for (const [index, proceeding] of proceedings.entries()) {
      await expect(links[index]).toHaveAttribute('href', proceeding.href)
      await expect(links[index]).toHaveAttribute('title', proceeding.courtName)
    }
    await expect(
      courtRegion.querySelector('[data-slot="record-group-link-meta"]'),
    ).toHaveTextContent('Originário · 1º grau')
    await numbersWhole(courtRegion)
    await rowsFit(courtRegion)
    await checkAddMenu(courtRegion)

    const detailRegion = canvas.getByRole('region', {
      name: 'Tribunal detalhado',
    })
    const detail = within(detailRegion)
    await expect(
      detail.getAllByRole('heading', { level: 3 }).map((h) => h.textContent),
    ).toEqual(
      proceedings.map(
        (proceeding) => `${proceeding.caseNumber}${roleLabel(proceeding.role)}`,
      ),
    )
    await expect(detail.getAllByRole('separator')).toHaveLength(
      proceedings.length - 1,
    )
    const triggers = detail
      .getAllByRole('heading', { level: 3 })
      .map((heading) => within(heading).getByRole('button'))
      .filter((button) => button.getAttribute('aria-expanded') === 'true')
    await expect(triggers).toHaveLength(1)
    await expect(triggers[0]).toHaveAccessibleName(
      '1002345-67.2025.8.26.0100 Originário',
    )
    for (const heading of detail.getAllByRole('heading', { level: 3 })) {
      await expect(heading.scrollWidth).toBeLessThanOrEqual(heading.clientWidth)
    }

    const origin = proceedings[0]
    for (const label of ['Papel', 'Instância', 'Vara/Tribunal']) {
      await expect(
        detail.getByRole('combobox', {
          name: new RegExp(`^${label} de ${origin.caseNumber}`),
        }),
      ).toBeVisible()
    }
    const courtLink = detail.getByRole('link', {
      name: 'Abrir no tribunal 1º grau',
    })
    await expect(courtLink).toHaveAttribute('href', origin.courtLink)
    await expect(courtLink).toHaveAttribute('target', '_blank')
    await expect(courtLink).toHaveAttribute('rel', 'noopener noreferrer')
    await rowsFit(detailRegion)

    await userEvent.click(
      detail.getByRole('combobox', {
        name: new RegExp(`^Instância de ${origin.caseNumber}`),
      }),
    )
    await userEvent.click(
      await screen.findByRole('option', { name: '2º grau' }),
    )
    await listboxClosed()
    await expect(
      detail.getByRole('combobox', {
        name: new RegExp(`^Instância de ${origin.caseNumber}`),
      }),
    ).toHaveTextContent('2º grau')

    await userEvent.click(
      detail.getByRole('combobox', {
        name: new RegExp(`^Papel de ${origin.caseNumber}`),
      }),
    )
    await userEvent.click(
      await screen.findByRole('option', { name: 'Cautelar' }),
    )
    await listboxClosed()
    await expect(
      detail.getByRole('button', {
        name: `${origin.caseNumber} Cautelar`,
      }),
    ).toBeVisible()

    const appeal = proceedings[1]
    await userEvent.click(
      detail.getByRole('button', {
        name: `${appeal.caseNumber} ${roleLabel(appeal.role)}`,
      }),
    )
    await expect(
      await detail.findByRole('combobox', {
        name: new RegExp(`^Vara/Tribunal de ${appeal.caseNumber}`),
      }),
    ).toHaveTextContent(appeal.courtName)
    await expect(
      detail.getByRole('link', { name: 'Abrir no tribunal TJSP' }),
    ).toHaveAttribute('href', appeal.courtLink)
    await waitFor(() => rowsFit(detailRegion))
    await checkAddMenu(detailRegion)
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <CourtGroup title="Tribunal" variant="plain" />
      <CourtPropertiesGroup title="Tribunal detalhado" variant="plain" />
    </div>
  ),
}
