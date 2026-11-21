import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type PaginationControls,
  paginationControlArgs,
  paginationControlArgTypes,
} from './pagination-controls.ts'
import { ComposedPagination } from './pagination-layouts.tsx'

const meta = {
  args: paginationControlArgs,
  argTypes: paginationControlArgTypes,
  parameters: {
    controls: { exclude: ['size', 'element'] },
    layout: 'centered',
  },
  render: (args) => <ComposedPagination {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Pagination/Stories',
} satisfies Meta<PaginationControls>

export default meta

type Story = StoryObj<PaginationControls>

export const Default: Story = {}

export const SizeXs: Story = {
  args: { size: 'xs' },
  name: 'Size xs',
}

export const SizeSm: Story = {
  args: { size: 'sm' },
  name: 'Size sm',
}

export const SizeLg: Story = {
  args: { size: 'lg' },
  name: 'Size lg',
}

export const SizeXl: Story = {
  args: { size: 'xl' },
  name: 'Size xl',
}
