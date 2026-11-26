import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type RecordDialog7Controls,
  recordDialog7ControlArgs,
  recordDialog7ControlArgTypes,
} from './record-dialog-7-controls.ts'
import { ComposedRecordDialog7 } from './record-dialog-7-layouts.tsx'

const meta = {
  args: {
    ...recordDialog7ControlArgs,
    onCreate: fn(),
  },
  argTypes: recordDialog7ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedRecordDialog7 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Dialog/Projects/RecordDialog7/Playground',
} satisfies Meta<
  RecordDialog7Controls & {
    onCreate: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}
