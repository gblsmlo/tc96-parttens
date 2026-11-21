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
  parameters: { layout: 'centered' },
  render: (args) => <ComposedPagination {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Pagination/Playground',
} satisfies Meta<PaginationControls>

export default meta

type Story = StoryObj<PaginationControls>

export const Playground: Story = {}
