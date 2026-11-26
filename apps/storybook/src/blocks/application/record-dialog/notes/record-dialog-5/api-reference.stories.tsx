import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { recordDialog5ControlArgs } from './record-dialog-5-controls.ts'
import { ComposedRecordDialog5 } from './record-dialog-5-layouts.tsx'

const meta = {
  args: {
    ...recordDialog5ControlArgs,
    onCreate: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedRecordDialog5 {...args} />,
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Record Dialog/Notes/RecordDialog5/API Reference',
} satisfies Meta<typeof ComposedRecordDialog5>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
