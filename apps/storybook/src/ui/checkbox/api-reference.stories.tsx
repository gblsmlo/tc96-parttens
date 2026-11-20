import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from '@tc96/ui/checkbox'
import { Label } from '@tc96/ui/label'
import { expect, within } from 'storybook/test'
import { Slot } from '../../test-utils/anatomy-slot'

const meta = {
  component: Checkbox,
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Checkbox/API Reference',
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <Label>
      <Checkbox {...args} defaultChecked />
      <Slot name="label" />
    </Label>
  ),
  play: async ({ canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', {
      name: 'label',
    })
    await expect(checkbox).toHaveAttribute('data-slot', 'checkbox')
    await expect(
      checkbox.querySelector('[data-slot="checkbox-indicator"] svg'),
    ).not.toBeNull()
  },
}
