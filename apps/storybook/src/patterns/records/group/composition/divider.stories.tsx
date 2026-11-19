import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  RecordGroup,
  RecordGroupDivider,
  RecordGroupRow,
  RecordGroupSubgroup,
} from '@tc96/parttens'
import { expect, within } from 'storybook/test'

const meta = {
  tags: ['!autodocs'],
  title: 'Patterns/Records/Group/Composition/Divider',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const SplitsChildrenAcrossTheContent: Story = {
  render: () => (
    <div className="w-96">
      <RecordGroup title="Financeiro">
        <RecordGroupSubgroup defaultOpen meta={1} title="Honorários">
          <RecordGroupRow label="Recebido">R$ 7.500,00</RecordGroupRow>
        </RecordGroupSubgroup>
        <RecordGroupDivider />
        <RecordGroupSubgroup meta={2} title="Despesas">
          <RecordGroupRow label="Total">R$ 720,40</RecordGroupRow>
        </RecordGroupSubgroup>
      </RecordGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const divider = within(canvasElement).getByRole('separator')
    const content = canvasElement.querySelector(
      '[data-slot="record-group-content"]',
    ) as HTMLElement

    await expect(divider.parentElement).toBe(content)
    await expect(divider).toHaveAttribute('aria-orientation', 'horizontal')
    await expect(divider).toHaveAttribute('data-record-group-divider')
    await expect(divider.getBoundingClientRect().height).toBe(1)
    await expect(divider.getBoundingClientRect().width).toBe(
      content.getBoundingClientRect().width,
    )
    await expect(divider.tabIndex).toBe(-1)
    await expect(
      [...content.children].map((child) =>
        child.getAttribute('data-slot') === 'record-group-subgroup'
          ? 'subgroup'
          : 'divider',
      ),
    ).toEqual(['subgroup', 'divider', 'subgroup'])
  },
}

export const MergesClassName: Story = {
  render: () => <RecordGroupDivider className="extra" />,
  play: async ({ canvasElement }) => {
    const divider = within(canvasElement).getByRole('separator')

    await expect(divider.className).toContain('extra')
    await expect(divider.className).toContain('my-1')
  },
}
