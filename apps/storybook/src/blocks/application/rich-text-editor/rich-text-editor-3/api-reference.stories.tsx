import type { Meta, StoryObj } from '@storybook/react-vite'
import { RichTextEditor3 } from '@tc96/ui/blocks/application/rich-text-editor/rich-text-editor-3'
import { fn } from 'storybook/test'
import {
  contractValue,
  redlineAuthor,
  redlineAuthors,
  redlineTime,
} from '../fixtures/rich-text-editor-3.ts'

const meta = {
  args: {
    author: redlineAuthor,
    authors: redlineAuthors,
    defaultValue: contractValue(),
    formatTime: redlineTime,
    onChange: fn(),
    onDecision: fn(),
    onExport: fn(),
  },
  component: RichTextEditor3,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Rich Text Editor/RichTextEditor3/API Reference',
} satisfies Meta<typeof RichTextEditor3>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
