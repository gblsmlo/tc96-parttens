import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Legal7Controls,
  legal7ControlArgs,
  legal7ControlArgTypes,
} from './legal-7-controls.ts'
import { ComposedLegal7 } from './legal-7-layouts.tsx'

const meta = {
  args: legal7ControlArgs,
  argTypes: legal7ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedLegal7 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Legal/Legal7/Playground',
} satisfies Meta<Legal7Controls>

export default meta

type Story = StoryObj<Legal7Controls>

export const Playground: Story = {}
