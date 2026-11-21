import type { Meta, StoryObj } from '@storybook/react-vite'
import { tableControlArgs } from './table-controls.ts'
import { TableCanvas } from './table-frame.tsx'
import {
  CardFrameTable,
  ComposedTable,
  RowHeadersTable,
  ScrollRegionTable,
} from './table-layouts.tsx'

const meta = {
  decorators: [TableCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Table/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithFooter: Story = {
  render: () => <ComposedTable {...tableControlArgs} footer />,
}

export const WithSelection: Story = {
  render: () => <ComposedTable {...tableControlArgs} selection />,
}

export const EmptyBody: Story = {
  render: () => <ComposedTable {...tableControlArgs} empty />,
}

export const RowHeaders: Story = {
  render: () => <RowHeadersTable />,
}

export const InCardFrame: Story = {
  render: () => <CardFrameTable {...tableControlArgs} />,
}

export const ScrollRegion: Story = {
  render: () => <ScrollRegionTable {...tableControlArgs} />,
}
