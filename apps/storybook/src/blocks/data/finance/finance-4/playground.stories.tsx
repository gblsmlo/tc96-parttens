import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Finance4Controls,
  finance4ControlArgs,
  finance4ControlArgTypes,
} from './finance-4-controls.ts'
import { ComposedFinance4 } from './finance-4-layouts.tsx'

const meta = {
  args: finance4ControlArgs,
  argTypes: finance4ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedFinance4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Finance/Finance4/Playground',
} satisfies Meta<Finance4Controls>

export default meta

type Story = StoryObj<Finance4Controls>

export const Playground: Story = {}
