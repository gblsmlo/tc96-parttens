import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { recordDialog2ControlArgs } from './record-dialog-2-controls.ts'
import { ComposedRecordDialog2 } from './record-dialog-2-layouts.tsx'

const meta = {
  args: {
    ...recordDialog2ControlArgs,
    onCreate: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedRecordDialog2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Dialog/Agenda/RecordDialog2/States',
} satisfies Meta<typeof ComposedRecordDialog2>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Closed: Story = {
  args: { open: false },
  render: (args) => <ComposedRecordDialog2 {...args} open={false} />,
}
