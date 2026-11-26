import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type RecordDialog6Controls,
  recordDialog6ControlArgs,
  recordDialog6ControlArgTypes,
} from './record-dialog-6-controls.ts'
import { ComposedRecordDialog6 } from './record-dialog-6-layouts.tsx'

const meta = {
  args: {
    ...recordDialog6ControlArgs,
    onCreate: fn(),
  },
  argTypes: recordDialog6ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedRecordDialog6 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Dialog/Legal/RecordDialog6/Playground',
} satisfies Meta<
  RecordDialog6Controls & {
    onCreate: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}
