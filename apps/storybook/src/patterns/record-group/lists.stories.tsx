import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  RecordGroup,
  RecordGroupItem,
  RecordGroupLink,
  type RecordGroupVariant,
  SelectProperty,
  type SelectPropertyOption,
} from '@tc96/parttens'
import { Input } from '@tc96/ui/input'
import { FileTextIcon, ReceiptTextIcon } from 'lucide-react'
import { useState } from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'

type ListTrailing = 'input' | 'property' | 'read-only'

const longTitle =
  'Parcela 3 do contrato de honorários da ação revisional bancária, renegociada em setembro'

const statusOptions: readonly SelectPropertyOption[] = [
  { label: 'Paga', value: 'paid' },
  { label: 'Prevista', value: 'scheduled' },
  { label: 'Atrasada', value: 'overdue' },
]

const installments = [
  { amount: '1.200,00', id: 'parcela-1', status: 'paid', title: 'Parcela 1' },
  {
    amount: '1.200,00',
    id: 'parcela-2',
    status: 'scheduled',
    title: 'Parcela 2',
  },
  {
    amount: '1.200,00',
    id: 'parcela-3',
    status: 'scheduled',
    title: longTitle,
  },
]

interface ListDemoProps {
  trailing?: ListTrailing
  variant?: RecordGroupVariant
}

function ListDemo({
  trailing = 'read-only',
  variant,
}: Readonly<ListDemoProps>) {
  const [status, setStatus] = useState<Record<string, string | null>>(() =>
    Object.fromEntries(installments.map((item) => [item.id, item.status])),
  )
  const [amount, setAmount] = useState<Record<string, string>>(() =>
    Object.fromEntries(installments.map((item) => [item.id, item.amount])),
  )

  return (
    <RecordGroup title="Parcelas" variant={variant}>
      {installments.map((item) => (
        <RecordGroupItem
          key={item.id}
          leading={<ReceiptTextIcon aria-hidden="true" />}
          title={item.title}
        >
          {trailing === 'input' ? (
            <Input
              aria-label={`Valor da ${item.title}`}
              className="w-28"
              inputMode="decimal"
              onChange={(event) =>
                setAmount((current) => ({
                  ...current,
                  [item.id]: event.target.value,
                }))
              }
              size="sm"
              value={amount[item.id]}
            />
          ) : (
            <SelectProperty
              ariaLabel={`Status da ${item.title}`}
              onValueChange={(next) =>
                setStatus((current) => ({ ...current, [item.id]: next }))
              }
              options={statusOptions}
              readOnly={trailing === 'read-only'}
              value={status[item.id] ?? null}
              variant="plain"
            />
          )}
        </RecordGroupItem>
      ))}
    </RecordGroup>
  )
}

function LinksDemo() {
  return (
    <RecordGroup title="Parcelas">
      <RecordGroupLink
        href="#/parcelas/1"
        leading={<ReceiptTextIcon aria-hidden="true" />}
        meta="Paga"
      >
        Parcela 1
      </RecordGroupLink>
      <RecordGroupLink
        href="#/parcelas/2"
        leading={<ReceiptTextIcon aria-hidden="true" />}
        meta="Prevista"
      >
        Parcela 2
      </RecordGroupLink>
      <RecordGroupLink
        href="#/parcelas/3"
        leading={<ReceiptTextIcon aria-hidden="true" />}
        meta="Prevista"
      >
        {longTitle}
      </RecordGroupLink>
      <RecordGroupLink
        href="#/documentos/contrato-assinado.pdf"
        leading={<FileTextIcon aria-hidden="true" />}
        meta="PDF · 12/08/2026"
      >
        contrato-assinado.pdf
      </RecordGroupLink>
    </RecordGroup>
  )
}

const meta = {
  args: { trailing: 'read-only' },
  argTypes: {
    trailing: {
      control: 'inline-radio',
      options: ['read-only', 'property', 'input'],
    },
  },
  component: ListDemo,
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'A RecordGroup whose rows are `RecordGroupItem`: icon, title and a trailing slot. The trailing slot takes a read-only property, an editable property or an input; the item never knows the control, and the control carries its own accessible name. `inset` frames the rows in a card. `RecordGroupLink` is the row when the whole row opens another record or a document.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'Patterns/RecordGroup/Lists',
} satisfies Meta<typeof ListDemo>

export default meta

type Story = StoryObj<typeof meta>

const interaction = ['!dev', '!autodocs']

const slotOf = (canvasElement: HTMLElement, slot: string) =>
  canvasElement.querySelector(`[data-slot="${slot}"]`) as HTMLElement

const itemsOf = (canvasElement: HTMLElement) =>
  Array.from(
    canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="record-group-item"]',
    ),
  )

const expectItemsFit = (canvasElement: HTMLElement) => {
  const items = itemsOf(canvasElement)
  const long = items[2] as HTMLElement
  const title = long.querySelector(
    '[data-slot="record-group-item-title"]',
  ) as HTMLElement

  expect(items).toHaveLength(3)
  expect(title.scrollWidth).toBeGreaterThan(title.clientWidth)
  for (const item of items) {
    const box = item.getBoundingClientRect()
    const trailing = (
      item.querySelector(
        '[data-slot="record-group-item-trailing"]',
      ) as HTMLElement
    ).getBoundingClientRect()

    expect(trailing.width).toBeGreaterThan(0)
    expect(trailing.right).toBeLessThanOrEqual(box.right + 0.5)
    expect(item.scrollWidth).toBeLessThanOrEqual(item.clientWidth)
  }
}

const controlSelector = 'button, input, [role="combobox"], [role="textbox"]'

export const Default: Story = {}

export const DefaultInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expectItemsFit(canvasElement)
    expect(canvas.getByText('Paga')).toBeVisible()
    for (const item of itemsOf(canvasElement)) {
      expect(item.querySelector(controlSelector)).toBeNull()
    }
  },
  tags: interaction,
}

export const DefaultPropertyInteraction: Story = {
  args: { trailing: 'property' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    expectItemsFit(canvasElement)
    await userEvent.click(
      canvas.getByRole('combobox', { name: /^Status da Parcela 2/ }),
    )
    await userEvent.click(await screen.findByRole('option', { name: 'Paga' }))
    await waitFor(() => expect(canvas.getAllByText('Paga')).toHaveLength(2))
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
  tags: interaction,
}

export const DefaultInputInteraction: Story = {
  args: { trailing: 'input' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const amount = canvas.getByRole('textbox', {
      name: 'Valor da Parcela 1',
    })

    expectItemsFit(canvasElement)
    expect(amount).toHaveValue('1.200,00')

    await userEvent.clear(amount)
    await userEvent.type(amount, '950,00')
    expect(amount).toHaveValue('950,00')
  },
  tags: interaction,
}

export const Inset: Story = {
  args: { variant: 'inset' },
}

export const InsetInteraction: Story = {
  ...Inset,
  play: async ({ canvasElement }) => {
    const section = slotOf(canvasElement, 'record-group')
    const header = slotOf(canvasElement, 'record-group-header')
    const content = slotOf(canvasElement, 'record-group-content')
    const card = getComputedStyle(content)
    const box = content.getBoundingClientRect()

    expect(section).toHaveAttribute('data-variant', 'inset')
    expect(getComputedStyle(section).borderTopWidth).toBe('0px')
    expect(card.borderTopWidth).toBe('1px')
    expect(card.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(header.getBoundingClientRect().bottom).toBeLessThanOrEqual(box.top)

    for (const item of itemsOf(canvasElement)) {
      const row = item.getBoundingClientRect()

      expect(item).toHaveStyle({
        borderBottomWidth: '0px',
        borderTopWidth: '0px',
      })
      expect(getComputedStyle(item, '::after').content).toBe('none')
      expect(row.left).toBeGreaterThan(box.left)
      expect(row.right).toBeLessThan(box.right)
    }
    expectItemsFit(canvasElement)
  },
  tags: interaction,
}

export const Links: Story = {
  render: () => <LinksDemo />,
}

export const LinksInteraction: Story = {
  ...Links,
  play: async ({ canvasElement }) => {
    const links = within(canvasElement).getAllByRole('link')
    const long = links[2] as HTMLElement
    const name = long.querySelector(
      '[data-slot="record-group-link-name"]',
    ) as HTMLElement
    const linkMeta = long.querySelector(
      '[data-slot="record-group-link-meta"]',
    ) as HTMLElement

    expect(links).toHaveLength(4)
    expect(links[0]).toHaveAccessibleName('Parcela 1 Paga')
    expect(links[0]).toHaveAttribute('href', '#/parcelas/1')
    expect(name.scrollWidth).toBeGreaterThan(name.clientWidth)
    expect(linkMeta).toBeVisible()
    expect(linkMeta.scrollWidth).toBeLessThanOrEqual(linkMeta.clientWidth)
    for (const link of links) {
      expect(link.scrollWidth).toBeLessThanOrEqual(link.clientWidth)
    }

    long.focus()
    expect(long).toHaveFocus()
  },
  tags: interaction,
}
