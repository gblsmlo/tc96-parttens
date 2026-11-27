import type { Meta, StoryObj } from '@storybook/react-vite'
import { TaskProperties } from './record-properties-1-layouts.tsx'

const meta = {
  component: TaskProperties,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Properties/RecordProperties1/Variants',
} satisfies Meta<typeof TaskProperties>

export default meta

type Story = StoryObj<typeof meta>

export const MixedLabelIcons: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Status and Prioridade pass `icon: null`; the other rows take the catalog icon.',
      },
    },
  },
}

export const AllLabelIcons: Story = {
  args: { iconlessKeys: [] },
}

export const NoLabelIcons: Story = {
  args: { showLabelIcons: false },
}

export const CustomProperty: Story = {
  args: { customProperty: true },
  parameters: {
    docs: {
      description: {
        story:
          'Revisão is not in the catalog: the item passes its own `label` and `icon`.',
      },
    },
  },
}

export const PendingProperty: Story = {
  args: { pendingKeys: ['owner', 'tags'] },
  parameters: {
    docs: {
      description: {
        story:
          'Responsável and Tags pass `pending: true`: the label stays and a skeleton named by `labels.loadingValue` takes the place of the value.',
      },
    },
  },
}
