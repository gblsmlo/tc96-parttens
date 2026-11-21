import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type CollapsibleControls,
  collapsibleControlArgs,
  collapsibleControlArgTypes,
} from './collapsible-controls.ts'
import { CollapsibleCanvas } from './collapsible-frame.tsx'
import { ComposedCollapsible } from './collapsible-layouts.tsx'

const meta = {
  args: collapsibleControlArgs,
  argTypes: collapsibleControlArgTypes,
  decorators: [CollapsibleCanvas],
  parameters: {
    controls: { exclude: ['defaultOpen'] },
    layout: 'centered',
  },
  render: (args) => <ComposedCollapsible {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Collapsible/Stories',
} satisfies Meta<CollapsibleControls>

export default meta

type Story = StoryObj<CollapsibleControls>

export const Default: Story = {}

export const DefaultOpen: Story = {
  args: { defaultOpen: true },
}
