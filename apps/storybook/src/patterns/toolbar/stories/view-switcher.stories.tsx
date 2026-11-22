import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToolbarCanvas } from '../toolbar-canvas.tsx'
import {
  type ToolbarControls,
  toolbarControlArgs,
  toolbarControlArgTypes,
} from '../toolbar-controls.ts'
import { ComposedToolbar } from '../toolbar-layouts.tsx'

const meta = {
  args: toolbarControlArgs,
  argTypes: toolbarControlArgTypes,
  decorators: [ToolbarCanvas],
  parameters: {
    controls: { exclude: ['switcherVariant'] },
    layout: 'fullscreen',
  },
  render: (args) => <ComposedToolbar {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Toolbar/Stories',
} satisfies Meta<ToolbarControls>

export default meta

type Story = StoryObj<ToolbarControls>

export const SwitcherDefault: Story = {
  args: { switcherVariant: 'default' },
  name: 'Switcher default',
}

export const SwitcherSecondary: Story = {
  args: { switcherVariant: 'secondary' },
  name: 'Switcher secondary',
}

export const SwitcherOutline: Story = {
  args: { switcherVariant: 'outline' },
  name: 'Switcher outline',
}

export const SwitcherDestructive: Story = {
  args: { switcherVariant: 'destructive' },
  name: 'Switcher destructive',
}

export const SwitcherDestructiveOutline: Story = {
  args: { switcherVariant: 'destructive-outline' },
  name: 'Switcher destructive-outline',
}

export const SwitcherLink: Story = {
  args: { switcherVariant: 'link' },
  name: 'Switcher link',
}
