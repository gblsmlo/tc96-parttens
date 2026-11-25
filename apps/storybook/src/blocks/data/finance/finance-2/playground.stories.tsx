import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Finance2Controls,
  finance2ControlArgs,
  finance2ControlArgTypes,
} from './finance-2-controls.ts'
import { ComposedFinance2 } from './finance-2-layouts.tsx'

const meta = {
  args: finance2ControlArgs,
  argTypes: finance2ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedFinance2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Finance/Finance2/Playground',
} satisfies Meta<Finance2Controls>

export default meta

type Story = StoryObj<Finance2Controls>

export const Playground: Story = {}
