import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type Support3Controls,
  support3ControlArgs,
  support3ControlArgTypes,
} from './support-3-controls.ts'
import { ComposedSupport3 } from './support-3-layouts.tsx'

const meta = {
  args: support3ControlArgs,
  argTypes: support3ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSupport3 {...args} onRowAction={fn()} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Support/Support3/Playground',
} satisfies Meta<Support3Controls>

export default meta

type Story = StoryObj<Support3Controls>

export const Playground: Story = {}
