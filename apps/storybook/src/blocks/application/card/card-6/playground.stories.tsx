import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Card6Controls,
  card6ControlArgs,
  card6ControlArgTypes,
} from './card-6-controls.ts'
import { ComposedCard6 } from './card-6-layouts.tsx'

const meta = {
  args: card6ControlArgs,
  argTypes: card6ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedCard6 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card6/Playground',
} satisfies Meta<Card6Controls>

export default meta

type Story = StoryObj<Card6Controls>

export const Playground: Story = {}
