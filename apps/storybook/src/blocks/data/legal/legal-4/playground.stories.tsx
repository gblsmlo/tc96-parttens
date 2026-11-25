import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Legal4Controls,
  legal4ControlArgs,
  legal4ControlArgTypes,
} from './legal-4-controls.ts'
import { ComposedLegal4 } from './legal-4-layouts.tsx'

const meta = {
  args: legal4ControlArgs,
  argTypes: legal4ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedLegal4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Legal/Legal4/Playground',
} satisfies Meta<Legal4Controls>

export default meta

type Story = StoryObj<Legal4Controls>

export const Playground: Story = {}
