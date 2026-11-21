import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type InputGroupControls,
  inputGroupControlArgs,
  inputGroupControlArgTypes,
} from './input-group-controls.ts'
import { InputGroupCanvas } from './input-group-frame.tsx'
import { ComposedInputGroup } from './input-group-layouts.tsx'

const meta = {
  args: inputGroupControlArgs,
  argTypes: inputGroupControlArgTypes,
  decorators: [InputGroupCanvas],
  parameters: {
    controls: { exclude: ['align', 'disabled', 'invalid', 'size'] },
    layout: 'centered',
  },
  render: (args) => <ComposedInputGroup {...args} />,
  tags: ['!autodocs'],
  title: 'UI/InputGroup/Stories',
} satisfies Meta<InputGroupControls>

export default meta

type Story = StoryObj<InputGroupControls>

export const Default: Story = {}

export const SizeSm: Story = {
  args: { size: 'sm' },
  name: 'Size sm',
}

export const SizeLg: Story = {
  args: { size: 'lg' },
  name: 'Size lg',
}

export const AlignInlineEnd: Story = {
  args: { align: 'inline-end' },
  name: 'Align inline-end',
}

export const AlignBlockStart: Story = {
  args: { align: 'block-start' },
  name: 'Align block-start',
}

export const AlignBlockEnd: Story = {
  args: { align: 'block-end' },
  name: 'Align block-end',
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Invalid: Story = {
  args: { invalid: true },
}
