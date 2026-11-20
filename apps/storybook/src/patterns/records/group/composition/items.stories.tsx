import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  RecordGroup,
  RecordGroupItem,
  type RecordGroupVariant,
  RecordStatusBadge,
  SelectProperty,
  type SelectPropertyOption,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { Input } from '@tc96/ui/input'
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
  ReceiptTextIcon,
  Trash2Icon,
} from 'lucide-react'
import { type ComponentType, useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import type { UsageDocsParameters } from '../../../../../.storybook/docs-page.tsx'
import { IconSlot, Slot } from '../../../../test-utils/anatomy-slot'
import {
  booleanArgType,
  recordGroupArgTypes,
} from '../../../../test-utils/story-arg-types'

interface ItemsArgs {
  editable: boolean
  interactive: boolean
  leading: boolean
  trailing: boolean
  variant: RecordGroupVariant
}

const hidden = { table: { disable: true } } as const
const onOpenInstallment = fn()
const onMarkPaid = fn()
const onDeleteInstallment = fn()

const statusOptions: readonly SelectPropertyOption[] = [
  { label: 'Paga', value: 'paid' },
  { label: 'Prevista', value: 'scheduled' },
  { label: 'Atrasada', value: 'overdue' },
]

const installments = [
  { id: 'parcela-1', status: 'paid', title: 'Parcela 1' },
  { id: 'parcela-2', status: 'scheduled', title: 'Parcela 2' },
  {
    id: 'parcela-3',
    status: 'scheduled',
    title:
      'Parcela 3 do contrato de honorários da ação revisional bancária, renegociada em setembro',
  },
] as const

const usage = `
import { RecordGroup, RecordGroupItem, SelectProperty } from '@acme/patterns'

<RecordGroup title="Installments">
  {installments.map((installment) => (
    <RecordGroupItem
      key={installment.id}
      leading={<ReceiptTextIcon aria-hidden="true" />}
      title={installment.title}
    >
      <SelectProperty
        ariaLabel={installment.statusLabel}
        onValueChange={(status) => setStatus(installment.id, status)}
        options={statusOptions}
        value={installment.status}
        variant="plain"
      />
    </RecordGroupItem>
  ))}
</RecordGroup>
`

const docs = {
  api: [
    {
      description:
        'List row of a `RecordGroup`: an optional `leading` icon, a `title` that truncates first, and `children` as the trailing control, which holds at most half the row. The trailing control is a read-only property, an editable property or an input, and carries its own accessible name; the item never knows it. It is a `div`, never a link, because a link cannot contain a control: when the whole row opens another record and holds no control, use `RecordGroupLink`. `interactive` is for an item whose title is a link or a button: the whole row takes the link hover (the same 8px inline offset), while the action stays on the title control and a trailing control keeps its own. Layouts compose the trailing slot in one order: the meta text (a date, an amount), then a `RecordStatusBadge`, then the three-dots menu, and keep it within half the row.',
      name: 'RecordGroupItem',
    },
  ],
  description: {
    component:
      '`RecordGroupItem` fills a `RecordGroup` with a list of records that each carry one control. `Anatomy` shows the slots of an item (`leading`, `title`, `children`), driven by the controls. `Usage` is a list of installments whose status is read-only or editable through the `editable` control, `Usage With Menu` puts a three-dots icon button that opens a menu in the trailing slot, and `With On Click` makes the title a link with `interactive`: the whole row hovers while only the link runs the action. `Behavior` is under test: a long title truncates while the trailing control stays whole inside the row, a status changes from its select, and an amount is typed in an input.',
  },
  usage,
} satisfies UsageDocsParameters & Record<string, unknown>

const itemsOf = (scope: HTMLElement) => [
  ...scope.querySelectorAll<HTMLElement>('[data-slot="record-group-item"]'),
]

const expectItemsFit = async (scope: HTMLElement) => {
  const items = itemsOf(scope)
  const long = (items[2] as HTMLElement).querySelector(
    '[data-slot="record-group-item-title"]',
  ) as HTMLElement

  await expect(items).toHaveLength(3)
  await expect(long.scrollWidth).toBeGreaterThan(long.clientWidth)
  for (const item of items) {
    const box = item.getBoundingClientRect()
    const trailing = (
      item.querySelector(
        '[data-slot="record-group-item-trailing"]',
      ) as HTMLElement
    ).getBoundingClientRect()

    await expect(trailing.width).toBeGreaterThan(0)
    await expect(trailing.right).toBeLessThanOrEqual(box.right + 0.5)
    await expect(item.scrollWidth).toBeLessThanOrEqual(item.clientWidth)
  }
}

function InstallmentsGroup({
  editable,
  variant,
}: Readonly<Pick<ItemsArgs, 'editable' | 'variant'>>) {
  const [status, setStatus] = useState<Record<string, string | null>>(
    Object.fromEntries(installments.map(({ id, status }) => [id, status])),
  )

  return (
    <RecordGroup title="Parcelas" variant={variant}>
      {installments.map((installment) => (
        <RecordGroupItem
          key={installment.id}
          leading={<ReceiptTextIcon aria-hidden />}
          title={installment.title}
        >
          <SelectProperty
            ariaLabel={`Status da ${installment.title}`}
            onValueChange={(next) =>
              setStatus((current) => ({ ...current, [installment.id]: next }))
            }
            options={statusOptions}
            readOnly={!editable}
            value={status[installment.id] ?? null}
            variant="plain"
          />
        </RecordGroupItem>
      ))}
    </RecordGroup>
  )
}

function InstallmentsMenuGroup({
  variant,
}: Readonly<Pick<ItemsArgs, 'variant'>>) {
  return (
    <RecordGroup title="Parcelas" variant={variant}>
      {installments.map((installment) => (
        <RecordGroupItem
          key={installment.id}
          leading={<ReceiptTextIcon aria-hidden />}
          title={installment.title}
        >
          <Menu>
            <MenuTrigger
              aria-label={`Ações da ${installment.title}`}
              render={<Button size="icon-sm" variant="ghost" />}
            >
              <EllipsisIcon aria-hidden="true" />
            </MenuTrigger>
            <MenuPopup align="end">
              <MenuItem onClick={() => onOpenInstallment(installment.id)}>
                <ExternalLinkIcon aria-hidden="true" />
                Abrir
              </MenuItem>
              <MenuItem onClick={() => onMarkPaid(installment.id)}>
                <CircleCheckIcon aria-hidden="true" />
                Marcar como paga
              </MenuItem>
              <MenuSeparator />
              <MenuItem
                onClick={() => onDeleteInstallment(installment.id)}
                variant="destructive"
              >
                <Trash2Icon aria-hidden="true" />
                Excluir
              </MenuItem>
            </MenuPopup>
          </Menu>
        </RecordGroupItem>
      ))}
    </RecordGroup>
  )
}

const installmentStatus = {
  paid: { color: 'var(--success-foreground)', label: 'Paga' },
  scheduled: { color: 'var(--muted-foreground)', label: 'Prevista' },
} as const

function InstallmentsLinkGroup({
  title = 'Parcelas',
  variant,
}: Readonly<{ title?: string; variant: RecordGroupVariant }>) {
  return (
    <RecordGroup title={title} variant={variant}>
      {installments.map((installment) => {
        const status = installmentStatus[installment.status]
        return (
          <RecordGroupItem
            interactive
            key={installment.id}
            leading={<ReceiptTextIcon aria-hidden />}
            title={
              <a
                className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                href={`#/parcelas/${installment.id}`}
                onClick={(event) => {
                  event.preventDefault()
                  onOpenInstallment(installment.id)
                }}
              >
                {installment.title}
              </a>
            }
          >
            <RecordStatusBadge color={status.color}>
              {status.label}
            </RecordStatusBadge>
          </RecordGroupItem>
        )
      })}
    </RecordGroup>
  )
}

function AmountsGroup() {
  const [amount, setAmount] = useState<Record<string, string>>(
    Object.fromEntries(installments.map(({ id }) => [id, '1.200,00'])),
  )

  return (
    <RecordGroup title="Valores" variant="inset">
      {installments.map((installment) => (
        <RecordGroupItem
          key={installment.id}
          leading={<ReceiptTextIcon aria-hidden />}
          title={installment.title}
        >
          <Input
            aria-label={`Valor da ${installment.title}`}
            className="w-28"
            inputMode="decimal"
            onChange={(event) =>
              setAmount((current) => ({
                ...current,
                [installment.id]: event.target.value,
              }))
            }
            size="sm"
            value={amount[installment.id]}
          />
        </RecordGroupItem>
      ))}
    </RecordGroup>
  )
}

const meta = {
  args: {
    editable: true,
    interactive: false,
    leading: true,
    trailing: true,
    variant: 'plain',
  },
  argTypes: {
    editable: booleanArgType,
    interactive: booleanArgType,
    leading: booleanArgType,
    trailing: booleanArgType,
    variant: recordGroupArgTypes.variant,
  },
  component: RecordGroupItem as unknown as ComponentType<ItemsArgs>,
  decorators: [
    (Story) => (
      <div className="w-96 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { docs },
  title: 'Patterns/Records/Group/Composition/Items',
} satisfies Meta<ItemsArgs>

export default meta

type Story = StoryObj<typeof meta>

const contract = ['!dev', '!autodocs']

const itemOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelector('[data-slot="record-group-item"]') as HTMLElement

const slotOf = (canvasElement: HTMLElement, name: 'title' | 'trailing') =>
  canvasElement.querySelector(`[data-slot="record-group-item-${name}"]`)

export const Anatomy: Story = {
  argTypes: { editable: hidden },
  play: async ({ args, canvasElement }) => {
    for (const item of itemsOf(canvasElement)) {
      await expect(
        [...item.querySelectorAll('[data-slot^="record-group-item-"]')].map(
          (node) => node.getAttribute('data-slot'),
        ),
      ).toEqual([
        'record-group-item-title',
        ...(args.trailing ? ['record-group-item-trailing'] : []),
      ])
    }
  },
  render: ({ interactive, leading, trailing, variant }) => (
    <RecordGroup title="Group" variant={variant}>
      {['first', 'second'].map((key) => (
        <RecordGroupItem
          interactive={interactive}
          key={key}
          leading={leading ? <IconSlot /> : undefined}
          title={<Slot name="title" />}
        >
          {trailing ? <Slot name="children" /> : null}
        </RecordGroupItem>
      ))}
    </RecordGroup>
  ),
}

export const Usage: Story = {
  argTypes: { interactive: hidden, leading: hidden, trailing: hidden },
  render: ({ editable, variant }) => (
    <InstallmentsGroup editable={editable} variant={variant} />
  ),
}

export const UsageWithMenu: Story = {
  argTypes: {
    editable: hidden,
    interactive: hidden,
    leading: hidden,
    trailing: hidden,
  },
  render: ({ variant }) => <InstallmentsMenuGroup variant={variant} />,
}

export const WithOnClick: Story = {
  argTypes: {
    editable: hidden,
    interactive: hidden,
    leading: hidden,
    trailing: hidden,
  },
  render: ({ variant }) => <InstallmentsLinkGroup variant={variant} />,
}

export const Behavior: Story = {
  argTypes: {
    editable: hidden,
    interactive: hidden,
    leading: hidden,
    trailing: hidden,
    variant: hidden,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const statuses = canvas.getByRole('region', { name: 'Parcelas' })
    const links = canvas.getByRole('region', { name: 'Parcelas com link' })
    const [firstLinkItem] = itemsOf(links) as [HTMLElement]

    await expectItemsFit(links)
    for (const item of itemsOf(links)) {
      await expect(item).toHaveAttribute('data-interactive', 'true')
    }
    onOpenInstallment.mockClear()
    await userEvent.click(within(firstLinkItem).getByText('Paga'))
    await expect(onOpenInstallment).not.toHaveBeenCalled()
    await userEvent.click(
      within(links).getByRole('link', { name: 'Parcela 1' }),
    )
    await expect(onOpenInstallment).toHaveBeenCalledWith('parcela-1')

    const amounts = canvas.getByRole('region', { name: 'Valores' })

    await expectItemsFit(statuses)
    await userEvent.click(
      within(statuses).getByRole('combobox', {
        name: /^Status da Parcela 2/,
      }),
    )
    await userEvent.click(await screen.findByRole('option', { name: 'Paga' }))
    await waitFor(() =>
      expect(within(statuses).getAllByText('Paga')).toHaveLength(2),
    )
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())

    await expectItemsFit(amounts)
    const amount = within(amounts).getByRole('textbox', {
      name: 'Valor da Parcela 1',
    })
    await expect(amount).toHaveValue('1.200,00')
    await userEvent.clear(amount)
    await userEvent.type(amount, '950,00')
    await expect(amount).toHaveValue('950,00')
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <InstallmentsGroup editable variant="plain" />
      <InstallmentsLinkGroup title="Parcelas com link" variant="plain" />
      <AmountsGroup />
    </div>
  ),
}

export const LeadingTitleAndTrailingInOrder: Story = {
  tags: contract,
  render: () => (
    <RecordGroupItem leading={<svg aria-hidden="true" />} title="Parcela 1">
      <input aria-label="Valor da Parcela 1" />
    </RecordGroupItem>
  ),
  play: async ({ canvasElement }) => {
    const item = itemOf(canvasElement)

    await expect(item.tagName).toBe('DIV')
    await expect(item.getAttribute('role')).toBeNull()
    await expect(item.firstElementChild?.querySelector('svg')).not.toBeNull()
    await expect(slotOf(canvasElement, 'title')?.textContent).toBe('Parcela 1')
    await expect(
      slotOf(canvasElement, 'trailing')?.contains(
        within(canvasElement).getByRole('textbox', {
          name: 'Valor da Parcela 1',
        }),
      ),
    ).toBe(true)
  },
}

export const LeadingAndTrailingOnlyWhenPassed: Story = {
  tags: contract,
  render: () => <RecordGroupItem title="Parcela 1" />,
  play: async ({ canvasElement }) => {
    await expect(itemOf(canvasElement).children).toHaveLength(1)
    await expect(slotOf(canvasElement, 'trailing')).toBeNull()
  },
}

export const MergesClassName: Story = {
  tags: contract,
  render: () => <RecordGroupItem className="extra" title="Parcela 1" />,
  play: async ({ canvasElement }) => {
    const item = itemOf(canvasElement)

    await expect(item.className).toContain('extra')
    await expect(item.className).toContain(
      'min-h-[var(--record-group-row-height,calc(var(--spacing)*8))]',
    )
    await expect(item.className).toContain(
      'px-[var(--record-group-row-padding,0px)]',
    )
  },
}

export const InteractiveHoversTheWholeRow: Story = {
  tags: contract,
  render: () => (
    <div className="flex flex-col">
      <RecordGroupItem
        interactive
        title={<a href="#/parcela-1">Parcela 1</a>}
      />
      <RecordGroupItem title="Parcela 2" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [interactiveItem, plainItem] = [
      ...canvasElement.querySelectorAll<HTMLElement>(
        '[data-slot="record-group-item"]',
      ),
    ] as [HTMLElement, HTMLElement]

    await expect(interactiveItem).toHaveAttribute('data-interactive', 'true')
    await expect(interactiveItem.className).toContain('hover:bg-accent')
    await expect(interactiveItem.className).toContain(
      '-mx-[var(--record-group-hover-offset,0px)]',
    )
    await expect(interactiveItem.tagName).toBe('DIV')
    await expect(plainItem).not.toHaveAttribute('data-interactive')
    await expect(plainItem.className).not.toContain('hover:bg-accent')
  },
}
