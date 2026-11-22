import type { Meta, StoryObj } from '@storybook/react-vite'
import { FinanceCanvas } from './finance-canvas.tsx'
import {
  type FinanceControls,
  financeControlArgs,
  financeControlArgTypes,
} from './finance-controls.ts'
import { ComposedFinance } from './finance-layouts.tsx'

const meta = {
  args: financeControlArgs,
  argTypes: financeControlArgTypes,
  decorators: [FinanceCanvas],
  parameters: { layout: 'padded' },
  render: (args) => <ComposedFinance key={args.widget} {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/Finance/Playground',
} satisfies Meta<FinanceControls>

export default meta

type Story = StoryObj<FinanceControls>

export const Playground: Story = {}
