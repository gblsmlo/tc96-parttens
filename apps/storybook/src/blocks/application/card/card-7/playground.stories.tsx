import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Card7Controls,
  card7ControlArgs,
  card7ControlArgTypes,
} from './card-7-controls.ts'
import { ComposedCard7 } from './card-7-layouts.tsx'

const meta = {
  args: card7ControlArgs,
  argTypes: card7ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedCard7 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card7/Playground',
} satisfies Meta<Card7Controls>

export default meta

type Story = StoryObj<Card7Controls>

export const Playground: Story = {}
