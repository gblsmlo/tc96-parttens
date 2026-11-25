import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type RichTextEditor4Controls,
  richTextEditor4ControlArgs,
  richTextEditor4ControlArgTypes,
} from './rich-text-editor-4-controls.ts'
import {
  ComposedRichTextEditor4,
  withToasts,
} from './rich-text-editor-4-layouts.tsx'

const meta = {
  args: richTextEditor4ControlArgs,
  argTypes: richTextEditor4ControlArgTypes,
  decorators: [withToasts],
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedRichTextEditor4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Rich Text Editor/RichTextEditor4/Playground',
} satisfies Meta<RichTextEditor4Controls>

export default meta

type Story = StoryObj<RichTextEditor4Controls>

export const Playground: Story = {}
