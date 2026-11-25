import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar6 } from '@tc96/ui/blocks/application/navbar/navbar-6'
import { fn } from 'storybook/test'
import {
  breadcrumb,
  filterOptions,
  people,
  sortOptions,
} from '../fixtures/navbar-6.ts'
import { boardMenu } from './navbar-6-layouts.tsx'

const meta = {
  args: {
    breadcrumb,
    filterOptions,
    filters: ['open'],
    menu: boardMenu,
    onFiltersChange: fn(),
    onInvite: fn(),
    onSortChange: fn(),
    people,
    sort: 'recent',
    sortOptions,
  },
  component: Navbar6,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Navbar/Navbar6/API Reference',
} satisfies Meta<typeof Navbar6>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
