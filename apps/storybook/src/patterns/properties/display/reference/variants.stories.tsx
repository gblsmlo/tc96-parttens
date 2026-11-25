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
  render: (args) => <ComposedReference {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Reference/Variants',
} satisfies Meta<ReferenceControls>

export default meta

type Story = StoryObj<ReferenceControls>

export const Default: Story = {}

export const Plain: Story = {
  args: { variant: 'plain' },
  parameters: { controls: { exclude: ['variant'] } },
}

export const Account: Story = {
  args: { kind: 'account' },
  parameters: { controls: { exclude: ['kind'] } },
}

export const Product: Story = {
  args: { kind: 'product' },
  parameters: { controls: { exclude: ['kind'] } },
}
