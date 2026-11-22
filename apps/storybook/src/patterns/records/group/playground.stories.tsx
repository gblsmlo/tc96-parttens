import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordGroupCanvas } from './record-group-canvas.tsx'
import {
  type RecordGroupControls,
  recordGroupControlArgs,
  recordGroupControlArgTypes,
} from './record-group-controls.ts'
import { ComposedRecordGroup } from './record-group-layouts.tsx'

const meta = {
  args: recordGroupControlArgs,
  argTypes: recordGroupControlArgTypes,
  decorators: [RecordGroupCanvas],
  render: (args) => <ComposedRecordGroup {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Records/Group/Playground',
} satisfies Meta<RecordGroupControls>

export default meta

type Story = StoryObj<RecordGroupControls>

export const Playground: Story = {}
