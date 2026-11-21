import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type ToolbarControls,
  toolbarControlArgs,
  toolbarControlArgTypes,
} from './toolbar-controls.ts'
import { ComposedToolbar } from './toolbar-layouts.tsx'

const meta = {
  args: toolbarControlArgs,
  argTypes: toolbarControlArgTypes,
  parameters: { layout: 'centered' },
  render: (args) => <ComposedToolbar {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Toolbar/Playground',
} satisfies Meta<ToolbarControls>

export default meta

type Story = StoryObj<ToolbarControls>

export const Playground: Story = {}
