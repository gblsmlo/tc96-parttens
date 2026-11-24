import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Card8Controls,
  card8ControlArgs,
  card8ControlArgTypes,
} from './card-8-controls.ts'
import { ComposedCard8 } from './card-8-layouts.tsx'

const meta = {
  args: card8ControlArgs,
  argTypes: card8ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedCard8 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card8/Playground',
} satisfies Meta<Card8Controls>

export default meta

type Story = StoryObj<Card8Controls>

export const Playground: Story = {}
