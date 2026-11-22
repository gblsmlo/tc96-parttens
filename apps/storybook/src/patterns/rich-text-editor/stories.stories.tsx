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
  parameters: {
    controls: { exclude: ['content', 'titleCounter'] },
    layout: 'padded',
  },
  render: (args) => <ComposedRichTextEditor {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Rich Text Editor/Stories',
} satisfies Meta<RichTextEditorControls>

export default meta

type Story = StoryObj<RichTextEditorControls>

export const Default: Story = {}

export const WithContent: Story = {
  args: { content: true },
}

export const TitleCounter: Story = {
  args: { titleCounter: true },
}
