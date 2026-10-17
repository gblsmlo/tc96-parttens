import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  RecordGroup,
  RecordGroupItem,
  RecordGroupLink,
  SelectProperty,
  type SelectPropertyOption,
} from '@tc96/parttens'
import { Input } from '@tc96/ui/input'
import { FileTextIcon, ReceiptTextIcon } from 'lucide-react'
import { useState } from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { recordGroupArgTypes } from '../../../test-utils/story-arg-types'

const statusOptions: readonly SelectPropertyOption[] = [
  { label: 'Paga', value: 'paid' },
  { label: 'Prevista', value: 'scheduled' },
  { label: 'Atrasada', value: 'overdue' },
]

const meta = {
  argTypes: recordGroupArgTypes,
  args: {
    children: (
      <>
        <RecordGroupItem
          leading={<ReceiptTextIcon aria-hidden />}
          title="Parcela 1"
        >
          <SelectProperty
            ariaLabel="Status da Parcela 1"
            options={statusOptions}
            readOnly
            value="paid"
            variant="plain"
          />
        </RecordGroupItem>
        <RecordGroupItem
          leading={<ReceiptTextIcon aria-hidden />}
          title="Parcela 2"
        >
          <SelectProperty
            ariaLabel="Status da Parcela 2"
            options={statusOptions}
            readOnly
            value="scheduled"
            variant="plain"
          />
        </RecordGroupItem>
        <RecordGroupItem
          leading={<ReceiptTextIcon aria-hidden />}
          title="Parcela 3 do contrato de honorários da ação revisional bancária, renegociada em setembro"
        >
          <SelectProperty
            ariaLabel="Status da Parcela 3"
            options={statusOptions}
            readOnly
            value="scheduled"
            variant="plain"
          />
        </RecordGroupItem>
      </>
    ),
    title: 'Parcelas',
  },
  component: RecordGroup,
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
  title: 'Patterns/Records/Group/Lists',
} satisfies Meta<typeof RecordGroup>

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

export const EditableProperty: Story = {
  render: function EditableProperty(args) {
    const [status, setStatus] = useState<Record<string, string | null>>({
      'parcela-1': 'paid',
      'parcela-2': 'scheduled',
      'parcela-3': 'scheduled',
    })

    return (
      <RecordGroup {...args}>
        <RecordGroupItem
          leading={<ReceiptTextIcon aria-hidden />}
          title="Parcela 1"
        >
          <SelectProperty
            ariaLabel="Status da Parcela 1"
            onValueChange={(next) =>
              setStatus((current) => ({ ...current, 'parcela-1': next }))
            }
            options={statusOptions}
            value={status['parcela-1'] ?? null}
            variant="plain"
          />
        </RecordGroupItem>
        <RecordGroupItem
          leading={<ReceiptTextIcon aria-hidden />}
          title="Parcela 2"
        >
          <SelectProperty
            ariaLabel="Status da Parcela 2"
            onValueChange={(next) =>
              setStatus((current) => ({ ...current, 'parcela-2': next }))
            }
            options={statusOptions}
            value={status['parcela-2'] ?? null}
            variant="plain"
          />
        </RecordGroupItem>
        <RecordGroupItem
          leading={<ReceiptTextIcon aria-hidden />}
          title="Parcela 3 do contrato de honorários da ação revisional bancária, renegociada em setembro"
        >
          <SelectProperty
            ariaLabel="Status da Parcela 3"
            onValueChange={(next) =>
              setStatus((current) => ({ ...current, 'parcela-3': next }))
            }
            options={statusOptions}
            value={status['parcela-3'] ?? null}
            variant="plain"
          />
        </RecordGroupItem>
      </RecordGroup>
    )
  },
}

export const EditablePropertyInteraction: Story = {
  ...EditableProperty,
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

export const WithInput: Story = {
  render: function WithInput(args) {
    const [amount, setAmount] = useState({
      'parcela-1': '1.200,00',
      'parcela-2': '1.200,00',
      'parcela-3': '1.200,00',
    })

    return (
      <RecordGroup {...args}>
        <RecordGroupItem
          leading={<ReceiptTextIcon aria-hidden />}
          title="Parcela 1"
        >
          <Input
            aria-label="Valor da Parcela 1"
            className="w-28"
            inputMode="decimal"
            onChange={(event) =>
              setAmount((current) => ({
                ...current,
                'parcela-1': event.target.value,
              }))
            }
            size="sm"
            value={amount['parcela-1']}
          />
        </RecordGroupItem>
        <RecordGroupItem
          leading={<ReceiptTextIcon aria-hidden />}
          title="Parcela 2"
        >
          <Input
            aria-label="Valor da Parcela 2"
            className="w-28"
            inputMode="decimal"
            onChange={(event) =>
              setAmount((current) => ({
                ...current,
                'parcela-2': event.target.value,
              }))
            }
            size="sm"
            value={amount['parcela-2']}
          />
        </RecordGroupItem>
        <RecordGroupItem
          leading={<ReceiptTextIcon aria-hidden />}
          title="Parcela 3 do contrato de honorários da ação revisional bancária, renegociada em setembro"
        >
          <Input
            aria-label="Valor da Parcela 3"
            className="w-28"
            inputMode="decimal"
            onChange={(event) =>
              setAmount((current) => ({
                ...current,
                'parcela-3': event.target.value,
              }))
            }
            size="sm"
            value={amount['parcela-3']}
          />
        </RecordGroupItem>
      </RecordGroup>
    )
  },
}

export const WithInputInteraction: Story = {
  ...WithInput,
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
    const surface = content.closest('[data-slot="card"]') as HTMLElement
    const card = getComputedStyle(surface)
    const box = content.getBoundingClientRect()

    expect(section).toHaveAttribute('data-variant', 'inset')
    expect(getComputedStyle(section).borderTopWidth).toBe('0px')
    expect(surface.parentElement).toContainElement(content)
    expect(section).not.toBe(surface)
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
  args: {
    children: (
      <>
        <RecordGroupLink
          href="#/parcelas/1"
          leading={<ReceiptTextIcon aria-hidden />}
          meta="Paga"
        >
          Parcela 1
        </RecordGroupLink>
        <RecordGroupLink
          href="#/parcelas/2"
          leading={<ReceiptTextIcon aria-hidden />}
          meta="Prevista"
        >
          Parcela 2
        </RecordGroupLink>
        <RecordGroupLink
          href="#/parcelas/3"
          leading={<ReceiptTextIcon aria-hidden />}
          meta="Prevista"
        >
          Parcela 3 do contrato de honorários da ação revisional bancária,
          renegociada em setembro
        </RecordGroupLink>
        <RecordGroupLink
          href="#/documentos/contrato-assinado.pdf"
          leading={<FileTextIcon aria-hidden />}
          meta="PDF · 12/08/2026"
        >
          contrato-assinado.pdf
        </RecordGroupLink>
      </>
    ),
  },
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
