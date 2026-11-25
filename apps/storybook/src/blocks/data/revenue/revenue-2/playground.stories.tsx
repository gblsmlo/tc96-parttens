import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Revenue2Controls,
  revenue2ControlArgs,
  revenue2ControlArgTypes,
} from './revenue-2-controls.ts'
import { ComposedRevenue2 } from './revenue-2-layouts.tsx'

const meta = {
  args: revenue2ControlArgs,
  argTypes: revenue2ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedRevenue2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Revenue/Revenue2/Playground',
} satisfies Meta<Revenue2Controls>

export default meta

type Story = StoryObj<Revenue2Controls>

export const Playground: Story = {}
