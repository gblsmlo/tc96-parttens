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
  render: (args) => <ComposedText {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Text/Playground',
} satisfies Meta<TextControls>

export default meta

type Story = StoryObj<TextControls>

export const Playground: Story = {}
