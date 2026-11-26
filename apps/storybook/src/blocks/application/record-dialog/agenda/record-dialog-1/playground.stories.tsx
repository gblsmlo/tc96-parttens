import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type RecordDialog1Controls,
  recordDialog1ControlArgs,
  recordDialog1ControlArgTypes,
} from './record-dialog-1-controls.ts'
import { ComposedRecordDialog1 } from './record-dialog-1-layouts.tsx'

const meta = {
  args: {
    ...recordDialog1ControlArgs,
    onCreate: fn(),
  },
  argTypes: recordDialog1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedRecordDialog1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Dialog/Agenda/RecordDialog1/Playground',
} satisfies Meta<
  RecordDialog1Controls & {
    onCreate: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}
