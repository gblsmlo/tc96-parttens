import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type RecordDialog5Controls,
  recordDialog5ControlArgs,
  recordDialog5ControlArgTypes,
} from './record-dialog-5-controls.ts'
import { ComposedRecordDialog5 } from './record-dialog-5-layouts.tsx'

const meta = {
  args: {
    ...recordDialog5ControlArgs,
    onCreate: fn(),
  },
  argTypes: recordDialog5ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedRecordDialog5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Dialog/Notes/RecordDialog5/Playground',
} satisfies Meta<
  RecordDialog5Controls & {
    onCreate: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}
