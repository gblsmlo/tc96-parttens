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
  parameters: { layout: 'centered' },
  render: (args) => <ComposedTextarea {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Textarea/Playground',
} satisfies Meta<TextareaControls>

export default meta

type Story = StoryObj<TextareaControls>

export const Playground: Story = {}
