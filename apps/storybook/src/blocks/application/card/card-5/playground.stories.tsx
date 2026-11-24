import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Card5Controls,
  card5ControlArgs,
  card5ControlArgTypes,
} from './card-5-controls.ts'
import { ComposedCard5 } from './card-5-layouts.tsx'

const meta = {
  args: card5ControlArgs,
  argTypes: card5ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedCard5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card5/Playground',
} satisfies Meta<Card5Controls>

export default meta

type Story = StoryObj<Card5Controls>

export const Playground: Story = {}
