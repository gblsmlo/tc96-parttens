import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dashboard5 } from '@tc96/ui/blocks/application/dashboard/dashboard-5'
import { fn } from 'storybook/test'
import {
  appointments,
  dashboard5TimeZone,
  deadlines,
  dueDays,
  links,
  metrics,
  publications,
  queues,
} from '../fixtures/dashboard-5.ts'
import { breadcrumbsFor } from '../fixtures/shared.ts'

const meta = {
  args: {
    appointments,
    breadcrumbs: breadcrumbsFor('Pendências'),
    deadlines,
    dueDays,
    links,
    metrics,
    onRetry: fn(),
    publications,
    queues,
    timeZone: dashboard5TimeZone,
  },
  component: Dashboard5,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Dashboard/Dashboard5/States',
} satisfies Meta<typeof Dashboard5>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
  args: { pending: true },
}

export const Failed: Story = {
  args: { error: true },
  name: 'Error',
}

export const Empty: Story = {
  args: {
    appointments: [],
    deadlines: [],
    dueDays: [],
    metrics: {},
    publications: [],
    queues: [],
  },
}
