import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ToggleGroup,
  ToggleGroupItem,
  ToggleGroupSeparator,
} from '@tc96/ui/toggle-group'
import { expect, within } from 'storybook/test'
import { Slot } from '../../test-utils/anatomy-slot'

const meta = {
  component: ToggleGroup,
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/ToggleGroup/API Reference',
} satisfies Meta<typeof ToggleGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <ToggleGroup {...args} aria-label="ToggleGroup">
      <ToggleGroupItem value="first">
        <Slot name="ToggleGroupItem" />
      </ToggleGroupItem>
      <ToggleGroupSeparator />
      <ToggleGroupItem value="second">
        <Slot name="ToggleGroupItem" />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', {
      name: 'ToggleGroup',
    })
    await expect(group).toHaveAttribute('data-slot', 'toggle-group')
    const items = within(group).getAllByRole('button', {
      name: 'ToggleGroupItem',
    })
    await expect(items).toHaveLength(2)
    await expect(items[0]).toHaveAttribute('data-slot', 'toggle')
    await expect(within(group).getByRole('separator')).toHaveAttribute(
      'data-slot',
      'separator',
    )
  },
}
