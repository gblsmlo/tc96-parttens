import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Support2Controls,
  support2ControlArgs,
  support2ControlArgTypes,
} from './support-2-controls.ts'
import { ComposedSupport2 } from './support-2-layouts.tsx'

const meta = {
  args: support2ControlArgs,
  argTypes: support2ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSupport2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Support/Support2/Playground',
} satisfies Meta<Support2Controls>

export default meta

type Story = StoryObj<Support2Controls>

export const Playground: Story = {}
