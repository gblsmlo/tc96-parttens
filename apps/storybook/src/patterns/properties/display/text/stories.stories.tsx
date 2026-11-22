import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextCanvas } from './text-canvas.tsx'
import {
  type TextControls,
  textControlArgs,
  textControlArgTypes,
} from './text-controls.ts'
import { ComposedText } from './text-layouts.tsx'

const meta = {
  args: textControlArgs,
  argTypes: textControlArgTypes,
  decorators: [TextCanvas],
  parameters: {
    controls: { exclude: ['value', 'variant'] },
  },
  render: (args) => <ComposedText {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Text/Stories',
} satisfies Meta<TextControls>

export default meta

type Story = StoryObj<TextControls>

export const Default: Story = {}

export const Plain: Story = {
  args: { variant: 'plain' },
}

export const Empty: Story = {
  args: { value: '' },
}
