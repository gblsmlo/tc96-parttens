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
  parameters: { layout: 'padded' },
  render: (args) => <ComposedCollapsible {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Collapsible/Playground',
} satisfies Meta<CollapsibleControls>

export default meta

type Story = StoryObj<CollapsibleControls>

export const Playground: Story = {}
