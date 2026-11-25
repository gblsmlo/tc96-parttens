import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Finance3Controls,
  finance3ControlArgs,
  finance3ControlArgTypes,
} from './finance-3-controls.ts'
import { ComposedFinance3 } from './finance-3-layouts.tsx'

const meta = {
  args: finance3ControlArgs,
  argTypes: finance3ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedFinance3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Finance/Finance3/Playground',
} satisfies Meta<Finance3Controls>

export default meta

type Story = StoryObj<Finance3Controls>

export const Playground: Story = {}
