import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Legal3Controls,
  legal3ControlArgs,
  legal3ControlArgTypes,
} from './legal-3-controls.ts'
import { ComposedLegal3 } from './legal-3-layouts.tsx'

const meta = {
  args: legal3ControlArgs,
  argTypes: legal3ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedLegal3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Legal/Legal3/Playground',
} satisfies Meta<Legal3Controls>

export default meta

type Story = StoryObj<Legal3Controls>

export const Playground: Story = {}
