import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Card4Controls,
  card4ControlArgs,
  card4ControlArgTypes,
} from './card-4-controls.ts'
import { ComposedCard4 } from './card-4-layouts.tsx'

const meta = {
  args: card4ControlArgs,
  argTypes: card4ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedCard4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card4/Playground',
} satisfies Meta<Card4Controls>

export default meta

type Story = StoryObj<Card4Controls>

export const Playground: Story = {}
