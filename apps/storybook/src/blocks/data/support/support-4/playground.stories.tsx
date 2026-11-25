import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type Support4Controls,
  support4ControlArgs,
  support4ControlArgTypes,
} from './support-4-controls.ts'
import { ComposedSupport4 } from './support-4-layouts.tsx'

const meta = {
  args: support4ControlArgs,
  argTypes: support4ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSupport4 {...args} onRowAction={fn()} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Support/Support4/Playground',
} satisfies Meta<Support4Controls>

export default meta

type Story = StoryObj<Support4Controls>

export const Playground: Story = {}
