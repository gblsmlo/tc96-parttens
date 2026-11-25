import type { Meta, StoryObj } from '@storybook/react-vite'
import { RichTextEditor1 } from '@tc96/ui/blocks/application/rich-text-editor/rich-text-editor-1'
import { fn } from 'storybook/test'
import {
  launchBrief,
  launchBriefDescription,
  launchBriefStatus,
  launchBriefTitle,
} from '../fixtures/rich-text-editor-1.ts'
import { DocumentPage } from './rich-text-editor-1-layouts.tsx'

const meta = {
  args: {
    defaultTitle: launchBriefTitle,
    defaultValue: launchBrief,
    description: launchBriefDescription,
    onChange: fn(),
    onCopy: fn(),
    onSave: fn(),
    status: launchBriefStatus,
  },
  component: RichTextEditor1,
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-6xl p-6">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'fullscreen' },
  render: (args) => <DocumentPage {...args} />,
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Rich Text Editor/RichTextEditor1/API Reference',
} satisfies Meta<typeof RichTextEditor1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
