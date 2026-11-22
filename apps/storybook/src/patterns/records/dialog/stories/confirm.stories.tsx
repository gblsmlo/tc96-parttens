import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type RecordConfirmDialogControls,
  recordConfirmDialogControlArgs,
  recordConfirmDialogControlArgTypes,
} from '../record-dialog-controls.ts'
import { ComposedRecordConfirmDialog } from '../record-dialog-layouts.tsx'

const meta = {
  args: recordConfirmDialogControlArgs,
  argTypes: recordConfirmDialogControlArgTypes,
  parameters: {
    controls: { exclude: ['confirmDisabled', 'tone'] },
  },
  render: (args) => <ComposedRecordConfirmDialog {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Records/Dialog/Stories',
} satisfies Meta<RecordConfirmDialogControls>

export default meta

type Story = StoryObj<RecordConfirmDialogControls>

export const Confirm: Story = {}

export const ConfirmToneDefault: Story = {
  args: { tone: 'default' },
  name: 'Confirm tone default',
}

export const ConfirmDisabled: Story = {
  args: { confirmDisabled: true },
  name: 'Confirm confirmDisabled',
}
