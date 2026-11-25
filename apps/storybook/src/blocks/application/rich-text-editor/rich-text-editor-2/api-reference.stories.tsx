import type { Meta, StoryObj } from '@storybook/react-vite'
import { RichTextEditor2 } from '@tc96/ui/blocks/application/rich-text-editor/rich-text-editor-2'
import { fn } from 'storybook/test'
import { people, playbook } from '../fixtures/rich-text-editor-2.ts'
import { WikiPage } from './rich-text-editor-2-layouts.tsx'

const meta = {
  args: {
    defaultValue: playbook,
    onSave: fn(),
    onSettingsChange: fn(),
    people,
  },
  component: RichTextEditor2,
  render: (args) => <WikiPage {...args} />,
  decorators: [
    (Story) => (
      <div className="p-6">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Rich Text Editor/RichTextEditor2/API Reference',
} satisfies Meta<typeof RichTextEditor2>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
