import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordGroupItem } from '@tc96/parttens'
import { expect, within } from 'storybook/test'

const itemOf = (canvasElement: HTMLElement) =>
  canvasElement.querySelector('[data-slot="record-group-item"]') as HTMLElement

const slotOf = (canvasElement: HTMLElement, name: 'title' | 'trailing') =>
  canvasElement.querySelector(`[data-slot="record-group-item-${name}"]`)

const meta = {
  tags: ['!autodocs'],
  title: 'Patterns/Records/Group/Composition/Item',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const LeadingTitleAndTrailingInOrder: Story = {
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
  render: () => <RecordGroupItem title="Parcela 1" />,
  play: async ({ canvasElement }) => {
    await expect(itemOf(canvasElement).children).toHaveLength(1)
    await expect(slotOf(canvasElement, 'trailing')).toBeNull()
  },
}

export const MergesClassName: Story = {
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
