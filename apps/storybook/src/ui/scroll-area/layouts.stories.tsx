import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  BothAxesScrollArea,
  FillScrollArea,
  HorizontalScrollArea,
  NestedScrollArea,
} from './scroll-area-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/ScrollArea/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => <HorizontalScrollArea />,
}

export const BothAxes: Story = {
  render: () => <BothAxesScrollArea />,
}

export const PinnedFooter: Story = {
  render: () => <FillScrollArea />,
}

export const Nested: Story = {
  render: () => <NestedScrollArea />,
}
