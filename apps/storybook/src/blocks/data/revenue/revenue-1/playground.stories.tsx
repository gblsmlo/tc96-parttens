import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Revenue1Controls,
  revenue1ControlArgs,
  revenue1ControlArgTypes,
} from './revenue-1-controls.ts'
import { ComposedRevenue1 } from './revenue-1-layouts.tsx'

const meta = {
  args: revenue1ControlArgs,
  argTypes: revenue1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedRevenue1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Revenue/Revenue1/Playground',
} satisfies Meta<Revenue1Controls>

export default meta

type Story = StoryObj<Revenue1Controls>

export const Playground: Story = {}
