import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Legal6Controls,
  legal6ControlArgs,
  legal6ControlArgTypes,
} from './legal-6-controls.ts'
import { ComposedLegal6 } from './legal-6-layouts.tsx'

const meta = {
  args: legal6ControlArgs,
  argTypes: legal6ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedLegal6 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Legal/Legal6/Playground',
} satisfies Meta<Legal6Controls>

export default meta

type Story = StoryObj<Legal6Controls>

export const Playground: Story = {}
