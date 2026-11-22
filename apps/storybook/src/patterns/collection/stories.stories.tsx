import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type CollectionControls,
  collectionControlArgs,
  collectionControlArgTypes,
} from './collection-controls'
import { ComposedCollection } from './collection-layouts'

const meta = {
  args: collectionControlArgs,
  argTypes: collectionControlArgTypes,
  parameters: {
    controls: { exclude: ['empty', 'layout', 'loading'] },
    layout: 'fullscreen',
  },
  render: (args) => <ComposedCollection {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Collection/Stories',
} satisfies Meta<CollectionControls>

export default meta

type Story = StoryObj<CollectionControls>

export const Default: Story = {}

export const List: Story = {
  args: { layout: 'list' },
}

export const DataGrid: Story = {
  args: { layout: 'datagrid' },
  name: 'Data Grid',
}

export const Gallery: Story = {
  args: { layout: 'gallery' },
}

export const Kanban: Story = {
  args: { layout: 'kanban' },
}

export const Calendar: Story = {
  args: { layout: 'calendar' },
}

export const Loading: Story = {
  args: { loading: true },
}

export const Empty: Story = {
  args: { empty: true },
}
