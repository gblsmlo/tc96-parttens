import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar7 } from '@tc96/ui/blocks/application/navbar/navbar-7'
import { fn } from 'storybook/test'
import {
  breadcrumb,
  novemberRange,
  refreshOptions,
  searchItems,
} from '../fixtures/navbar-7.ts'

const meta = {
  args: {
    breadcrumb,
    compare: false,
    onCompareChange: fn(),
    onRangeChange: fn(),
    onRefresh: fn(),
    onRefreshIntervalChange: fn(),
    onSearchSelect: fn(),
    onShare: fn(),
    range: novemberRange,
    refreshInterval: '5m',
    refreshOptions,
    searchItems,
  },
  component: Navbar7,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs', '!dev'],
  title: 'Blocks/Application/Navbar/Navbar7/API Reference',
} satisfies Meta<typeof Navbar7>

export default meta

type Story = StoryObj<typeof meta>

export const Anatomy: Story = {}
