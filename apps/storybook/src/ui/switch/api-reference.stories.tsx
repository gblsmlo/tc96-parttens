import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from '@tc96/ui/label'
import { Switch } from '@tc96/ui/switch'
import { expect, within } from 'storybook/test'
import { Slot } from '../../test-utils/anatomy-slot'

const meta = {
  component: Switch,
  parameters: { layout: 'centered' },
  tags: ['!autodocs', '!dev'],
  title: 'UI/Switch/API Reference',
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <Label>
      <Switch {...args} defaultChecked />
      <Slot name="label" />
    </Label>
  ),
  play: async ({ canvasElement }) => {
    const control = within(canvasElement).getByRole('switch', {
      name: 'label',
    })
    await expect(control).toHaveAttribute('data-slot', 'switch')
    await expect(
      control.querySelector('[data-slot="switch-thumb"]'),
    ).not.toBeNull()
  },
}
