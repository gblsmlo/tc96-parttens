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
  render: (args) => <ComposedAttachments {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Attachments/Playground',
} satisfies Meta<AttachmentsControls>

export default meta

type Story = StoryObj<AttachmentsControls>

export const Playground: Story = {}
