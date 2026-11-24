import { PaperclipIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AttachmentProperty, AttachmentsProperty } from '@tc96/ui/patterns'
import { expect } from 'storybook/test'
import { AttachmentsCanvas } from './attachments-canvas.tsx'

const ignore = () => undefined

const meta = {
  args: {
    action: { icon: PaperclipIcon, label: 'action.label', onSelect: ignore },
    ariaLabel: 'Attachments',
  },
  component: AttachmentsProperty,
  decorators: [AttachmentsCanvas],
  tags: ['!autodocs', '!dev'],
  title: 'Patterns/Properties/Display/Attachments/API Reference',
} satisfies Meta<typeof AttachmentsProperty>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {
  render: (args) => (
    <AttachmentsProperty {...args}>
      <AttachmentProperty
        href="#attachment"
        label="AttachmentProperty"
        onRemove={ignore}
        removeLabel="Remove AttachmentProperty"
        type="pdf"
      />
    </AttachmentsProperty>
  ),
  play: async ({ canvasElement }) => {
    for (const slot of [
      'attachments-property',
      'attachment-property',
      'attachment-type-icon',
      'attachment-property-link',
      'attachment-property-remove',
    ]) {
      await expect(
        canvasElement.querySelector(`[data-slot="${slot}"]`),
      ).not.toBeNull()
    }
  },
}

export const EmptyAnatomy: Story = {}
