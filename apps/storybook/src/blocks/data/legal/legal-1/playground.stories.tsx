import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Legal1Controls,
  legal1ControlArgs,
  legal1ControlArgTypes,
} from './legal-1-controls.ts'
import { ComposedLegal1 } from './legal-1-layouts.tsx'

const meta = {
  args: legal1ControlArgs,
  argTypes: legal1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedLegal1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Legal/Legal1/Playground',
} satisfies Meta<Legal1Controls>

export default meta

type Story = StoryObj<Legal1Controls>

export const Playground: Story = {}
