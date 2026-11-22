import type { Meta, StoryObj } from '@storybook/react-vite'
import { AttachmentsCanvas } from './attachments-canvas.tsx'
import {
  type AttachmentsControls,
  attachmentsControlArgs,
  attachmentsControlArgTypes,
} from './attachments-controls.ts'
import { ComposedAttachments } from './attachments-layouts.tsx'

const meta = {
  args: attachmentsControlArgs,
  argTypes: attachmentsControlArgTypes,
  decorators: [AttachmentsCanvas],
  parameters: {
    controls: { exclude: ['actionDisabled', 'empty', 'type'] },
  },
  render: (args) => <ComposedAttachments {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Attachments/Stories',
} satisfies Meta<AttachmentsControls>

export default meta

type Story = StoryObj<AttachmentsControls>

export const Default: Story = {}

export const Empty: Story = {
  args: { empty: true },
}

export const DisabledAction: Story = {
  args: { actionDisabled: true },
}

export const TypeDoc: Story = {
  args: { type: 'doc' },
  name: 'Type doc',
}

export const TypeAudio: Story = {
  args: { type: 'audio' },
  name: 'Type audio',
}

export const TypeLink: Story = {
  args: { type: 'link' },
  name: 'Type link',
}
