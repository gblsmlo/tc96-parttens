import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Support1Controls,
  support1ControlArgs,
  support1ControlArgTypes,
} from './support-1-controls.ts'
import { ComposedSupport1 } from './support-1-layouts.tsx'

const meta = {
  args: support1ControlArgs,
  argTypes: support1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSupport1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Support/Support1/Playground',
} satisfies Meta<Support1Controls>

export default meta

type Story = StoryObj<Support1Controls>

export const Playground: Story = {}
