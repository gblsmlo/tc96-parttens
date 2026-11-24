import { ReceiptIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordGroup, RecordGroupItem } from '@tc96/parttens'
import { Input } from '@tc96/ui/input'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  InstallmentsGroup,
  InstallmentsLinkGroup,
  installments,
} from '../layouts/items'
import { RecordGroupCanvas } from '../record-group-canvas'

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

function AmountsGroup() {
  const [amount, setAmount] = useState<Record<string, string>>(
    Object.fromEntries(installments.map(({ id }) => [id, '1.200,00'])),
  )

  return (
    <RecordGroup title="Valores" variant="inset">
      {installments.map((installment) => (
        <RecordGroupItem
          key={installment.id}
          leading={<ReceiptIcon aria-hidden />}
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
  decorators: [RecordGroupCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Records/Group/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const itemOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelector('[data-slot="record-group-item"]') as HTMLElement

const slotOf = (canvasElement: HTMLElement, name: 'title' | 'trailing') =>
  canvasElement.querySelector(`[data-slot="record-group-item-${name}"]`)

export const ItemTitleTruncatesBesideTheControl: Story = {
  play: async ({ canvasElement }) => {
    await expectItemsFit(
      within(canvasElement).getByRole('region', { name: 'Parcelas' }),
    )
  },
  render: () => <InstallmentsGroup editable />,
}

export const ItemTrailingSelectStaysOperable: Story = {
  play: async ({ canvasElement }) => {
    const statuses = within(canvasElement).getByRole('region', {
      name: 'Parcelas',
    })

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
    await expectItemsFit(statuses)
  },
  render: () => <InstallmentsGroup editable />,
}

export const ItemTrailingInputStaysOperable: Story = {
  play: async ({ canvasElement }) => {
    const amounts = within(canvasElement).getByRole('region', {
      name: 'Valores',
    })

    await expectItemsFit(amounts)
    const amount = within(amounts).getByRole('textbox', {
      name: 'Valor da Parcela 1',
    })
    await expect(amount).toHaveValue('1.200,00')
    await userEvent.clear(amount)
    await userEvent.type(amount, '950,00')
    await expect(amount).toHaveValue('950,00')
  },
  render: () => <AmountsGroup />,
}

export const ItemInteractiveRunsOnlyTheTitleAction: StoryObj<{
  onOpen: (id: string) => void
}> = {
  args: { onOpen: fn() },
  play: async ({ args, canvasElement }) => {
    const links = within(canvasElement).getByRole('region', {
      name: 'Parcelas com link',
    })
    const [firstLinkItem] = itemsOf(links) as [HTMLElement]

    await expectItemsFit(links)
    for (const item of itemsOf(links)) {
      await expect(item).toHaveAttribute('data-interactive', 'true')
    }
    await userEvent.click(within(firstLinkItem).getByText('Paga'))
    await expect(args.onOpen).not.toHaveBeenCalled()
    await userEvent.click(
      within(links).getByRole('link', { name: 'Parcela 1' }),
    )
    await expect(args.onOpen).toHaveBeenCalledOnce()
    await expect(args.onOpen).toHaveBeenLastCalledWith('parcela-1')
  },
  render: ({ onOpen }) => (
    <InstallmentsLinkGroup onOpen={onOpen} title="Parcelas com link" />
  ),
}

export const ItemLeadingTitleAndTrailingInOrder: Story = {
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

export const ItemLeadingAndTrailingOnlyWhenPassed: Story = {
  render: () => <RecordGroupItem title="Parcela 1" />,
  play: async ({ canvasElement }) => {
    await expect(itemOf(canvasElement).children).toHaveLength(1)
    await expect(slotOf(canvasElement, 'trailing')).toBeNull()
  },
}

export const ItemMergesClassName: Story = {
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

export const ItemInteractiveHoversTheWholeRow: Story = {
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
