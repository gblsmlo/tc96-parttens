import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { recordDialog3ControlArgs } from './record-dialog-3-controls.ts'
import { ComposedRecordDialog3 } from './record-dialog-3-layouts.tsx'

const meta = {
  args: {
    ...recordDialog3ControlArgs,
    onCreate: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedRecordDialog3 {...args} />,
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Record Dialog/Leads/RecordDialog3/API Reference',
} satisfies Meta<typeof ComposedRecordDialog3>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
