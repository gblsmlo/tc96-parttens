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

export const Default: Story = {
  render: () => <ComposedAttachments {...attachmentsControlArgs} />,
}
