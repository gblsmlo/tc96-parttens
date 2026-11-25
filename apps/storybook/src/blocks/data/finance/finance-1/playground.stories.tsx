import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Finance1Controls,
  finance1ControlArgs,
  finance1ControlArgTypes,
} from './finance-1-controls.ts'
import { ComposedFinance1 } from './finance-1-layouts.tsx'

const meta = {
  args: finance1ControlArgs,
  argTypes: finance1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedFinance1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Finance/Finance1/Playground',
} satisfies Meta<Finance1Controls>

export default meta

type Story = StoryObj<Finance1Controls>

export const Playground: Story = {}
