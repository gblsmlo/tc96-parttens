import type { Meta, StoryObj } from '@storybook/react-vite'
import { AttachmentsCanvas } from './attachments-canvas.tsx'
import { attachmentsControlArgs } from './attachments-controls.ts'
import { ComposedAttachments } from './attachments-layouts.tsx'

const meta = {
  decorators: [AttachmentsCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Attachments/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutRemove: Story = {
  render: () => (
    <ComposedAttachments {...attachmentsControlArgs} remove={false} />
  ),
}

export const WithoutAddAction: Story = {
  render: () => (
    <ComposedAttachments {...attachmentsControlArgs} action={false} />
  ),
}

export const ReadOnly: Story = {
  render: () => (
    <ComposedAttachments
      {...attachmentsControlArgs}
      action={false}
      remove={false}
    />
  ),
}

export const WithoutTypeIcon: Story = {
  render: () => (
    <ComposedAttachments {...attachmentsControlArgs} typeIcon={false} />
  ),
}

export const EmptyWithoutIcon: Story = {
  render: () => (
    <ComposedAttachments {...attachmentsControlArgs} actionIcon={false} empty />
  ),
}
