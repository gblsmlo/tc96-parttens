import type { Meta, StoryObj } from '@storybook/react-vite'
import { EditorTitle, RichTextEditor } from '@tc96/parttens'
import { expect } from 'storybook/test'
import { RichTextEditorCanvas } from './rich-text-editor-canvas.tsx'
import { paragraph } from './rich-text-editor-data.ts'

const meta = {
  args: { 'aria-label': 'Nota' },
  component: RichTextEditor,
  decorators: [RichTextEditorCanvas],
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Rich Text Editor/API Reference',
} satisfies Meta<typeof RichTextEditor>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <EditorTitle defaultValue="EditorTitle" emptyLabel="Nota sem título" />
      <RichTextEditor {...args} defaultValue={[paragraph('RichTextEditor')]} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const slot of [
      'editor-title',
      'editor-title-heading',
      'editor-title-field',
      'rich-text-editor',
      'rich-text-editor-content',
    ]) {
      await expect(
        canvasElement.querySelector(`[data-slot="${slot}"]`),
      ).not.toBeNull()
    }
  },
}
