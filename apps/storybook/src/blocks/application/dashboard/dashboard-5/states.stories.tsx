import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dashboard5 } from '@tc96/ui/blocks/application/dashboard/dashboard-5'
import { expect, fn, within } from 'storybook/test'
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

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('list', { name: 'Meus prazos' }),
    ).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando pendências'),
    ).toHaveAttribute('aria-busy', 'true')
  },
}

export const Failed: Story = {
  args: { error: true },
  name: 'Error',
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Não foi possível carregar.'),
    ).toBeVisible()
  },
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
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma pendência'),
    ).toBeVisible()
  },
}
