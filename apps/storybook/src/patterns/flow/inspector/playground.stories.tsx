import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type InspectorControls,
  inspectorControlArgs,
  inspectorControlArgTypes,
} from './inspector-controls.ts'
import { desktop, InspectorFrame } from './inspector-frame.tsx'
import { ComposedInspector } from './inspector-layouts.tsx'

const meta = {
  args: inspectorControlArgs,
  argTypes: inspectorControlArgTypes,
  decorators: [InspectorFrame],
  globals: desktop,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedInspector {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Flow/Inspector/Playground',
} satisfies Meta<InspectorControls>

export default meta

type Story = StoryObj<InspectorControls>

export const Playground: Story = {}
