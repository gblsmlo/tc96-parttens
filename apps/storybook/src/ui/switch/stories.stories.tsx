import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SwitchControls,
  switchControlArgs,
  switchControlArgTypes,
} from './switch-controls.ts'
import { ComposedSwitch } from './switch-layouts.tsx'

const meta = {
  args: switchControlArgs,
  argTypes: switchControlArgTypes,
  parameters: {
    controls: { exclude: ['checked', 'disabled', 'size'] },
    layout: 'centered',
  },
  render: (args) => <ComposedSwitch {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Switch/Stories',
} satisfies Meta<SwitchControls>

export default meta

type Story = StoryObj<SwitchControls>

export const Default: Story = {}

export const Checked: Story = {
  args: { checked: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}
