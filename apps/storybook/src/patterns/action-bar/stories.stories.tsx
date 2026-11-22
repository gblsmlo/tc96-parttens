import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type ActionBarControls,
  actionBarControlArgs,
  actionBarControlArgTypes,
} from './action-bar-controls.ts'
import { ComposedActionBar } from './action-bar-layouts.tsx'

const meta = {
  args: actionBarControlArgs,
  argTypes: actionBarControlArgTypes,
  parameters: {
    controls: { exclude: ['disabled', 'selectedCount', 'variant'] },
    layout: 'centered',
  },
  render: (args) => <ComposedActionBar {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/ActionBar/Stories',
} satisfies Meta<ActionBarControls>

export default meta

type Story = StoryObj<ActionBarControls>

export const Default: Story = {}

export const MultipleRows: Story = {
  args: { selectedCount: 4 },
}

export const VariantDefault: Story = {
  args: { variant: 'default' },
  name: 'Variant default',
}

export const Destructive: Story = {
  args: { variant: 'destructive' },
}

export const DisabledAction: Story = {
  args: { disabled: true },
}
