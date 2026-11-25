import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type RichTextEditor2Controls,
  richTextEditor2ControlArgs,
  richTextEditor2ControlArgTypes,
} from './rich-text-editor-2-controls.ts'
import { ComposedRichTextEditor2 } from './rich-text-editor-2-layouts.tsx'

const meta = {
  args: richTextEditor2ControlArgs,
  argTypes: richTextEditor2ControlArgTypes,
  parameters: { layout: 'fullscreen' },
  render: (args) => <ComposedRichTextEditor2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Rich Text Editor/RichTextEditor2/Playground',
} satisfies Meta<RichTextEditor2Controls>

export default meta

type Story = StoryObj<RichTextEditor2Controls>

export const Playground: Story = {}
