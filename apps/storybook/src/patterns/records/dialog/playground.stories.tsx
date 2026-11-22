import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type RecordDialogControls,
  recordDialogControlArgs,
  recordDialogControlArgTypes,
} from './record-dialog-controls.ts'
import { ComposedRecordDialog } from './record-dialog-layouts.tsx'

const meta = {
  args: recordDialogControlArgs,
  argTypes: recordDialogControlArgTypes,
  render: (args) => <ComposedRecordDialog {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Records/Dialog/Playground',
} satisfies Meta<RecordDialogControls>

export default meta

type Story = StoryObj<RecordDialogControls>

export const Playground: Story = {}
