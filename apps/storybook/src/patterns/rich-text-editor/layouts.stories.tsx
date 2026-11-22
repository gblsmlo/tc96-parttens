import type { Meta, StoryObj } from '@storybook/react-vite'
import { RichTextEditorCanvas } from './rich-text-editor-canvas.tsx'
import { richTextEditorControlArgs } from './rich-text-editor-controls.ts'
import { ComposedRichTextEditor } from './rich-text-editor-layouts.tsx'

const meta = {
  decorators: [RichTextEditorCanvas],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Rich Text Editor/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutTitle: Story = {
  render: () => (
    <ComposedRichTextEditor {...richTextEditorControlArgs} title={false} />
  ),
}

export const DraggableBlocks: Story = {
  render: () => (
    <ComposedRichTextEditor
      {...richTextEditorControlArgs}
      content
      draggableBlocks
    />
  ),
}

export const NarrowColumn: Story = {
  render: () => (
    <div className="max-w-xs">
      <ComposedRichTextEditor
        {...richTextEditorControlArgs}
        content
        title={false}
      />
    </div>
  ),
}
