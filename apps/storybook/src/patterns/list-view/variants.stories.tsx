import type { Meta, StoryObj } from '@storybook/react-vite'
import { ListCanvas } from './list-canvas.tsx'
import {
  type ListControls,
  listControlArgs,
  listControlArgTypes,
} from './list-controls.ts'
import { ComposedList } from './list-layouts.tsx'

const meta = {
  args: listControlArgs,
  argTypes: listControlArgTypes,
  decorators: [ListCanvas],
  parameters: {
    controls: {
      exclude: [
        'collapseEmptyGroups',
        'density',
        'empty',
        'grouped',
        'loading',
        'separated',
      ],
    },
  },
  render: (args) => <ComposedList {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/ListView/Variants',
} satisfies Meta<ListControls>

export default meta

type Story = StoryObj<ListControls>

export const Default: Story = {}

export const Loading: Story = {
  args: { loading: true },
}

export const Empty: Story = {
  args: { empty: true },
}

export const CollapseEmptyGroups: Story = {
  args: { collapseEmptyGroups: true },
}

export const Separated: Story = {
  args: { separated: true },
}

export const Compact: Story = {
  args: { density: 'compact' },
}
