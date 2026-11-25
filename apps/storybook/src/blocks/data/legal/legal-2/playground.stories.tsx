import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Legal2Controls,
  legal2ControlArgs,
  legal2ControlArgTypes,
} from './legal-2-controls.ts'
import { ComposedLegal2 } from './legal-2-layouts.tsx'

const meta = {
  args: legal2ControlArgs,
  argTypes: legal2ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedLegal2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Legal/Legal2/Playground',
} satisfies Meta<Legal2Controls>

export default meta

type Story = StoryObj<Legal2Controls>

export const Playground: Story = {}
