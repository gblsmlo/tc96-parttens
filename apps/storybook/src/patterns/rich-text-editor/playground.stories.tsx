import type { Meta, StoryObj } from '@storybook/react-vite'
import { RichTextEditorCanvas } from './rich-text-editor-canvas.tsx'
import {
  type RichTextEditorControls,
  richTextEditorControlArgs,
  richTextEditorControlArgTypes,
} from './rich-text-editor-controls.ts'
import { ComposedRichTextEditor } from './rich-text-editor-layouts.tsx'

const meta = {
  args: richTextEditorControlArgs,
  argTypes: richTextEditorControlArgTypes,
  decorators: [RichTextEditorCanvas],
  parameters: { layout: 'padded' },
  render: (args) => <ComposedRichTextEditor {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Rich Text Editor/Playground',
} satisfies Meta<RichTextEditorControls>

export default meta

type Story = StoryObj<RichTextEditorControls>

export const Playground: Story = {}
