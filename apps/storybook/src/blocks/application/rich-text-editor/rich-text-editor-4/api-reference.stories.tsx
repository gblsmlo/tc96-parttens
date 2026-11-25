import type { Meta, StoryObj } from '@storybook/react-vite'
import { RichTextEditor4 } from '@tc96/ui/blocks/application/rich-text-editor/rich-text-editor-4'
import {
  type RichTextEditor4Controls,
  richTextEditor4ControlArgs,
} from './rich-text-editor-4-controls.ts'
import {
  ComposedRichTextEditor4,
  withToasts,
} from './rich-text-editor-4-layouts.tsx'

const meta = {
  args: { ...richTextEditor4ControlArgs, autoplay: false },
  component: RichTextEditor4 as never,
  decorators: [withToasts],
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedRichTextEditor4 {...args} />,
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Rich Text Editor/RichTextEditor4/API Reference',
} satisfies Meta<RichTextEditor4Controls>

export default meta

type Story = StoryObj<RichTextEditor4Controls>

export const Anatomy: Story = {}
