import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type RecordDialog3Controls,
  recordDialog3ControlArgs,
  recordDialog3ControlArgTypes,
} from './record-dialog-3-controls.ts'
import { ComposedRecordDialog3 } from './record-dialog-3-layouts.tsx'

const meta = {
  args: {
    ...recordDialog3ControlArgs,
    onCreate: fn(),
  },
  argTypes: recordDialog3ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedRecordDialog3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Dialog/Leads/RecordDialog3/Playground',
} satisfies Meta<
  RecordDialog3Controls & {
    onCreate: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}
