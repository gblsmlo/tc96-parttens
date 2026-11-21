import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type ContextMenuControls,
  contextMenuControlArgs,
  contextMenuControlArgTypes,
} from './context-menu-controls.ts'
import { ComposedContextMenu } from './context-menu-layouts.tsx'

const meta = {
  args: contextMenuControlArgs,
  argTypes: contextMenuControlArgTypes,
  parameters: { layout: 'centered' },
  render: (args) => <ComposedContextMenu {...args} />,
  tags: ['!autodocs'],
  title: 'UI/ContextMenu/Playground',
} satisfies Meta<ContextMenuControls>

export default meta

type Story = StoryObj<ContextMenuControls>

export const Playground: Story = {}
