import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Card3Controls,
  card3ControlArgs,
  card3ControlArgTypes,
} from './card-3-controls.ts'
import { ComposedCard3 } from './card-3-layouts.tsx'

const meta = {
  args: card3ControlArgs,
  argTypes: card3ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedCard3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card3/Playground',
} satisfies Meta<Card3Controls>

export default meta

type Story = StoryObj<Card3Controls>

export const Playground: Story = {}
