import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToolbarCanvas } from './toolbar-canvas.tsx'
import {
  type ToolbarControls,
  toolbarControlArgs,
  toolbarControlArgTypes,
} from './toolbar-controls.ts'
import { ComposedToolbar } from './toolbar-layouts.tsx'

const meta = {
  args: toolbarControlArgs,
  argTypes: toolbarControlArgTypes,
  decorators: [ToolbarCanvas],
  parameters: {
    controls: { exclude: ['variant'] },
    layout: 'fullscreen',
  },
  render: (args) => <ComposedToolbar {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Toolbar/Stories',
} satisfies Meta<ToolbarControls>

export default meta

type Story = StoryObj<ToolbarControls>

export const Default: Story = {}

export const VariantDefault: Story = {
  args: { variant: 'default' },
  name: 'Variant default',
}

export const Text: Story = {
  args: { variant: 'text' },
}
