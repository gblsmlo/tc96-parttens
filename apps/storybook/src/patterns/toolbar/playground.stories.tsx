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
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedToolbar {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Toolbar/Playground',
} satisfies Meta<ToolbarControls>

export default meta

type Story = StoryObj<ToolbarControls>

export const Playground: Story = {}
