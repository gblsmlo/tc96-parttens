import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { recordDialog7ControlArgs } from './record-dialog-7-controls.ts'
import { ComposedRecordDialog7 } from './record-dialog-7-layouts.tsx'

const meta = {
  args: {
    ...recordDialog7ControlArgs,
    onCreate: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedRecordDialog7 {...args} />,
  tags: ['!autodocs', '!dev'],
  title:
    'Blocks/Application/Record Dialog/Projects/RecordDialog7/API Reference',
} satisfies Meta<typeof ComposedRecordDialog7>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
