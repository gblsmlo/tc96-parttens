import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dashboard4 } from '@tc96/blocks/application/dashboard/dashboard-4'
import { fn } from 'storybook/test'
import {
  filterOptionsFor,
  initialSort,
  metrics,
  moduleActions,
  modules,
  pageModules,
  sortModules,
  team,
} from '../fixtures/dashboard-4.ts'
import { dashboard4Breadcrumbs } from './dashboard-4-layouts.tsx'

const firstPage = pageModules(sortModules(modules, initialSort), 1, 10)

const meta = {
  args: {
    breadcrumbs: dashboard4Breadcrumbs,
    filter: 'all',
    filterOptions: filterOptionsFor(modules),
    metrics,
    modules: firstPage.rows,
    onAddModule: fn(),
    onFavoriteChange: fn(),
    onFilterChange: fn(),
    onInvite: fn(),
    onOpen: fn(),
    onPageChange: fn(),
    onRowAction: fn(),
    onSearchChange: fn(),
    onSortChange: fn(),
    pagination: firstPage.pagination,
    rowActions: moduleActions,
    sort: initialSort,
    team,
  },
  component: Dashboard4,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Dashboard/Dashboard4/API Reference',
} satisfies Meta<typeof Dashboard4>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
