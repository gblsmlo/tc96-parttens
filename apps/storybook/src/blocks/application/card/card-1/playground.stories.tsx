import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Card1Controls,
  card1ControlArgs,
  card1ControlArgTypes,
} from './card-1-controls.ts'
import { ComposedCard1 } from './card-1-layouts.tsx'

const meta = {
  args: card1ControlArgs,
  argTypes: card1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedCard1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card1/Playground',
} satisfies Meta<Card1Controls>

export default meta

type Story = StoryObj<Card1Controls>

export const Playground: Story = {}
