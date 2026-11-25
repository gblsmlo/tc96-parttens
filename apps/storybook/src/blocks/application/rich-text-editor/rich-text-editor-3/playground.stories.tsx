import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type RichTextEditor3Controls,
  richTextEditor3ControlArgs,
  richTextEditor3ControlArgTypes,
} from './rich-text-editor-3-controls.ts'
import { ComposedRichTextEditor3 } from './rich-text-editor-3-layouts.tsx'

const meta = {
  args: richTextEditor3ControlArgs,
  argTypes: richTextEditor3ControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedRichTextEditor3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Rich Text Editor/RichTextEditor3/Playground',
} satisfies Meta<RichTextEditor3Controls>

export default meta

type Story = StoryObj<RichTextEditor3Controls>

export const Playground: Story = {}
