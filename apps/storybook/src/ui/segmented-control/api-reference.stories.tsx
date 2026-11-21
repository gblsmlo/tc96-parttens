import type { Meta, StoryObj } from '@storybook/react-vite'
import { RadioGroupPrimitive, RadioPrimitive } from '@tc96/ui/radio-group'
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@tc96/ui/segmented-control'
import { expect, within } from 'storybook/test'
import { inactiveItemContrast } from './segmented-control-contrast.ts'

const meta = {
  component: SegmentedControl,
  parameters: inactiveItemContrast,
  tags: ['!autodocs', '!dev'],
  title: 'UI/SegmentedControl/API Reference',
} satisfies Meta<typeof SegmentedControl>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <SegmentedControl
      {...args}
      aria-label="SegmentedControl"
      render={<RadioGroupPrimitive defaultValue="first" />}
    >
      <SegmentedControlItem render={<RadioPrimitive.Root value="first" />}>
        SegmentedControlItem
      </SegmentedControlItem>
      <SegmentedControlItem render={<RadioPrimitive.Root value="second" />}>
        SegmentedControlItem
      </SegmentedControlItem>
    </SegmentedControl>
  ),
  play: async ({ canvasElement }) => {
    const root = within(canvasElement).getByRole('radiogroup', {
      name: 'SegmentedControl',
    })
    await expect(root).toHaveAttribute('data-slot', 'segmented-control')
    await expect(within(root).getAllByRole('radio')).toHaveLength(2)
    await expect(
      within(root).getAllByText('SegmentedControlItem'),
    ).toHaveLength(2)
    await expect(
      root.querySelector('[data-slot="segmented-control-indicator"]'),
    ).toBeVisible()
  },
}
