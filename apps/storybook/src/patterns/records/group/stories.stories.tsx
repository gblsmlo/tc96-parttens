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
  parameters: {
    controls: {
      exclude: [
        'actionsAlign',
        'chevron',
        'collapsible',
        'defaultOpen',
        'empty',
        'variant',
      ],
    },
  },
  render: (args) => <ComposedRecordGroup {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Records/Group/Stories',
} satisfies Meta<RecordGroupControls>

export default meta

type Story = StoryObj<RecordGroupControls>

export const Default: Story = {}

export const Card: Story = {
  args: { variant: 'card' },
}

export const Inset: Story = {
  args: { variant: 'inset' },
}

export const ActionsAlignStart: Story = {
  args: { actionsAlign: 'start' },
  name: 'actionsAlign start',
}

export const ChevronEnd: Story = {
  args: { chevron: 'end' },
  name: 'chevron end',
}

export const Empty: Story = {
  args: { empty: true },
}

export const NotCollapsible: Story = {
  args: { collapsible: false },
  name: 'collapsible false',
}

export const Closed: Story = {
  args: { defaultOpen: false },
  name: 'defaultOpen false',
}
