import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { recordDialog6ControlArgs } from './record-dialog-6-controls.ts'
import { ComposedRecordDialog6 } from './record-dialog-6-layouts.tsx'

const meta = {
  args: {
    ...recordDialog6ControlArgs,
    onCreate: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedRecordDialog6 {...args} />,
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Record Dialog/Legal/RecordDialog6/API Reference',
} satisfies Meta<typeof ComposedRecordDialog6>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
