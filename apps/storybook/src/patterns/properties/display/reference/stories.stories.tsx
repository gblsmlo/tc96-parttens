import type { Meta, StoryObj } from '@storybook/react-vite'
import { ReferenceCanvas } from './reference-canvas.tsx'
import {
  type ReferenceControls,
  referenceControlArgs,
  referenceControlArgTypes,
} from './reference-controls.ts'
import { ComposedReference } from './reference-layouts.tsx'

const meta = {
  args: referenceControlArgs,
  argTypes: referenceControlArgTypes,
  decorators: [ReferenceCanvas],
  parameters: { controls: { exclude: ['kind', 'variant'] } },
  render: (args) => <ComposedReference {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Reference/Stories',
} satisfies Meta<ReferenceControls>

export default meta

type Story = StoryObj<ReferenceControls>

export const Default: Story = {}

export const Plain: Story = {
  args: { variant: 'plain' },
}

export const Account: Story = {
  args: { kind: 'account' },
}

export const Product: Story = {
  args: { kind: 'product' },
}
