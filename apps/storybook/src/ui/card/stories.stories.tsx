import type { Meta, StoryObj } from '@storybook/react-vite'
import { CardCanvas } from './card-canvas.tsx'
import {
  type CardControls,
  cardControlArgs,
  cardControlArgTypes,
} from './card-controls.ts'
import { ComposedCard } from './card-layouts.tsx'

const meta = {
  args: cardControlArgs,
  argTypes: cardControlArgTypes,
  decorators: [CardCanvas],
  parameters: {
    controls: { exclude: ['element'] },
    layout: 'centered',
  },
  render: (args) => <ComposedCard {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Card/Stories',
} satisfies Meta<CardControls>

export default meta

type Story = StoryObj<CardControls>

export const Default: Story = {}
