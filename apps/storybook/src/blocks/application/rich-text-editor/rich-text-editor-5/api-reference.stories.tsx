import type { Meta, StoryObj } from '@storybook/react-vite'
import { RichTextEditor5 } from '@tc96/ui/blocks/application/rich-text-editor/rich-text-editor-5'
import { fn } from 'storybook/test'
import {
  rolloutAuthor,
  rolloutTime,
  rolloutValue,
} from '../fixtures/rich-text-editor-5.ts'

const meta = {
  args: {
    author: rolloutAuthor,
    defaultValue: rolloutValue(),
    formatTime: rolloutTime,
    onChange: fn(),
    onDecision: fn(),
    stepDelay: 0,
  },
  component: RichTextEditor5,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Rich Text Editor/RichTextEditor5/API Reference',
} satisfies Meta<typeof RichTextEditor5>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
