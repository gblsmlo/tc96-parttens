import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type RecordDialog2Controls,
  recordDialog2ControlArgs,
  recordDialog2ControlArgTypes,
} from './record-dialog-2-controls.ts'
import { ComposedRecordDialog2 } from './record-dialog-2-layouts.tsx'

const meta = {
  args: {
    ...recordDialog2ControlArgs,
    onCreate: fn(),
  },
  argTypes: recordDialog2ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedRecordDialog2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Dialog/Agenda/RecordDialog2/Playground',
} satisfies Meta<
  RecordDialog2Controls & {
    onCreate: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}
