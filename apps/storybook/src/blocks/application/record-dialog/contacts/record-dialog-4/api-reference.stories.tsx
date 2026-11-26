import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { recordDialog4ControlArgs } from './record-dialog-4-controls.ts'
import { ComposedRecordDialog4 } from './record-dialog-4-layouts.tsx'

const meta = {
  args: {
    ...recordDialog4ControlArgs,
    onCreate: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedRecordDialog4 {...args} />,
  tags: ['!autodocs', '!dev'],
  title:
    'Blocks/Application/Record Dialog/Contacts/RecordDialog4/API Reference',
} satisfies Meta<typeof ComposedRecordDialog4>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
