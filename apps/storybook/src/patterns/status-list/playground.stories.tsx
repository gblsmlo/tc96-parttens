import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordStatusListCanvas } from './status-list-canvas.tsx'
import {
  type RecordStatusListControls,
  recordStatusListControlArgs,
  recordStatusListControlArgTypes,
} from './status-list-controls.ts'
import { ComposedRecordStatusList } from './status-list-layouts.tsx'

const meta = {
  args: recordStatusListControlArgs,
  argTypes: recordStatusListControlArgTypes,
  decorators: [RecordStatusListCanvas],
  render: (args) => <ComposedRecordStatusList {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/StatusList/Playground',
} satisfies Meta<RecordStatusListControls>

export default meta

type Story = StoryObj<RecordStatusListControls>

export const Playground: Story = {}
