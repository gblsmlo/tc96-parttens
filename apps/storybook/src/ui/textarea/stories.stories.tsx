import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type TextareaControls,
  textareaControlArgs,
  textareaControlArgTypes,
} from './textarea-controls.ts'
import { TextareaCanvas } from './textarea-frame.tsx'
import { ComposedTextarea } from './textarea-layouts.tsx'

const meta = {
  args: textareaControlArgs,
  argTypes: textareaControlArgTypes,
  decorators: [TextareaCanvas],
  parameters: {
    controls: { exclude: ['size', 'disabled', 'invalid', 'unstyled'] },
    layout: 'centered',
  },
  render: (args) => <ComposedTextarea {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Textarea/Stories',
} satisfies Meta<TextareaControls>

export default meta

type Story = StoryObj<TextareaControls>

export const Default: Story = {}

export const Small: Story = {
  args: { size: 'sm' },
}

export const Large: Story = {
  args: { size: 'lg' },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Invalid: Story = {
  args: { invalid: true },
}

export const Unstyled: Story = {
  args: { unstyled: true },
}
