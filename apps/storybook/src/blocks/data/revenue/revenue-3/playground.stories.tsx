import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Revenue3Controls,
  revenue3ControlArgs,
  revenue3ControlArgTypes,
} from './revenue-3-controls.ts'
import { ComposedRevenue3 } from './revenue-3-layouts.tsx'

const meta = {
  args: revenue3ControlArgs,
  argTypes: revenue3ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedRevenue3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Revenue/Revenue3/Playground',
} satisfies Meta<Revenue3Controls>

export default meta

type Story = StoryObj<Revenue3Controls>

export const Playground: Story = {}
