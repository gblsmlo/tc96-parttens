import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Legal9Controls,
  legal9ControlArgs,
  legal9ControlArgTypes,
} from './legal-9-controls.ts'
import { ComposedLegal9 } from './legal-9-layouts.tsx'

const meta = {
  args: legal9ControlArgs,
  argTypes: legal9ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedLegal9 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Legal/Legal9/Playground',
} satisfies Meta<Legal9Controls>

export default meta

type Story = StoryObj<Legal9Controls>

export const Playground: Story = {}
