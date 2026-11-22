import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type RecordPreviewControls,
  recordPreviewControlArgs,
  recordPreviewControlArgTypes,
} from './record-preview-controls.ts'
import { ComposedRecordPreview } from './record-preview-layouts.tsx'

const meta = {
  args: recordPreviewControlArgs,
  argTypes: recordPreviewControlArgTypes,
  render: (args) => <ComposedRecordPreview {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Records/Preview/Playground',
} satisfies Meta<RecordPreviewControls>

export default meta

type Story = StoryObj<RecordPreviewControls>

export const Playground: Story = {}
