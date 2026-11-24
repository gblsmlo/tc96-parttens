import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Card9Controls,
  card9ControlArgs,
  card9ControlArgTypes,
} from './card-9-controls.ts'
import { ComposedCard9 } from './card-9-layouts.tsx'

const meta = {
  args: card9ControlArgs,
  argTypes: card9ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedCard9 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Card/Card9/Playground',
} satisfies Meta<Card9Controls>

export default meta

type Story = StoryObj<Card9Controls>

export const Playground: Story = {}
