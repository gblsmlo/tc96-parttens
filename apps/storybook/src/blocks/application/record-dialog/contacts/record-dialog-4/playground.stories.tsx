import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type RecordDialog4Controls,
  recordDialog4ControlArgs,
  recordDialog4ControlArgTypes,
} from './record-dialog-4-controls.ts'
import { ComposedRecordDialog4 } from './record-dialog-4-layouts.tsx'

const meta = {
  args: {
    ...recordDialog4ControlArgs,
    onCreate: fn(),
  },
  argTypes: recordDialog4ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedRecordDialog4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Dialog/Contacts/RecordDialog4/Playground',
} satisfies Meta<
  RecordDialog4Controls & {
    onCreate: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}
