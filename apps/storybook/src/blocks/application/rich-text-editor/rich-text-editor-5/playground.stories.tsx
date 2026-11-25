import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type RichTextEditor5Controls,
  richTextEditor5ControlArgs,
  richTextEditor5ControlArgTypes,
} from './rich-text-editor-5-controls.ts'
import { ComposedRichTextEditor5 } from './rich-text-editor-5-layouts.tsx'

const meta = {
  args: richTextEditor5ControlArgs,
  argTypes: richTextEditor5ControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedRichTextEditor5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Rich Text Editor/RichTextEditor5/Playground',
} satisfies Meta<RichTextEditor5Controls>

export default meta

type Story = StoryObj<RichTextEditor5Controls>

export const Playground: Story = {}
