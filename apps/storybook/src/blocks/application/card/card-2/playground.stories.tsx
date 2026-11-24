import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Card2Controls,
  card2ControlArgs,
  card2ControlArgTypes,
} from './card-2-controls.ts'
import { ComposedCard2 } from './card-2-layouts.tsx'

const meta = {
  args: card2ControlArgs,
  argTypes: card2ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedCard2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card2/Playground',
} satisfies Meta<Card2Controls>

export default meta

type Story = StoryObj<Card2Controls>

export const Playground: Story = {}
