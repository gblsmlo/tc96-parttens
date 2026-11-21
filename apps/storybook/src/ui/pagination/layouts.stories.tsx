import type { Meta, StoryObj } from '@storybook/react-vite'
import { paginationControlArgs } from './pagination-controls.ts'
import { ComposedPagination } from './pagination-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Pagination/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutEllipsis: Story = {
  render: () => (
    <ComposedPagination {...paginationControlArgs} ellipsis={false} />
  ),
}

export const PagesOnly: Story = {
  render: () => (
    <ComposedPagination
      {...paginationControlArgs}
      next={false}
      previous={false}
    />
  ),
}

export const PreviousAndNextOnly: Story = {
  render: () => (
    <ComposedPagination
      {...paginationControlArgs}
      ellipsis={false}
      pages={false}
    />
  ),
}

export const AsButtons: Story = {
  render: () => (
    <ComposedPagination {...paginationControlArgs} element="button" />
  ),
}
