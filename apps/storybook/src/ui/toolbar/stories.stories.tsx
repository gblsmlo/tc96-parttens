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
  parameters: {
    controls: { exclude: ['orientation'] },
    layout: 'centered',
  },
  render: (args) => <ComposedToolbar {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Toolbar/Stories',
} satisfies Meta<ToolbarControls>

export default meta

type Story = StoryObj<ToolbarControls>

export const Default: Story = {}

export const Vertical: Story = {
  args: { orientation: 'vertical' },
}
