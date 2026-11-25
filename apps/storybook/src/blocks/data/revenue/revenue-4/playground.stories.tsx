import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Revenue4Controls,
  revenue4ControlArgs,
  revenue4ControlArgTypes,
} from './revenue-4-controls.ts'
import { ComposedRevenue4 } from './revenue-4-layouts.tsx'

const meta = {
  args: revenue4ControlArgs,
  argTypes: revenue4ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedRevenue4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Revenue/Revenue4/Playground',
} satisfies Meta<Revenue4Controls>

export default meta

type Story = StoryObj<Revenue4Controls>

export const Playground: Story = {}
