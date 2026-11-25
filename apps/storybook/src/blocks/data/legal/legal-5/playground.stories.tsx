import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Legal5Controls,
  legal5ControlArgs,
  legal5ControlArgTypes,
} from './legal-5-controls.ts'
import { ComposedLegal5 } from './legal-5-layouts.tsx'

const meta = {
  args: legal5ControlArgs,
  argTypes: legal5ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedLegal5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Legal/Legal5/Playground',
} satisfies Meta<Legal5Controls>

export default meta

type Story = StoryObj<Legal5Controls>

export const Playground: Story = {}
