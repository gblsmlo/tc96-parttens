import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { recordDialog1ControlArgs } from './record-dialog-1-controls.ts'
import { ComposedRecordDialog1 } from './record-dialog-1-layouts.tsx'

const meta = {
  args: {
    ...recordDialog1ControlArgs,
    onCreate: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedRecordDialog1 {...args} />,
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Record Dialog/Agenda/RecordDialog1/API Reference',
} satisfies Meta<typeof ComposedRecordDialog1>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
