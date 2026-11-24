import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { timeline3ControlArgs } from './timeline-3-controls.ts'
import {
  ComposedTimeline3,
  type ComposedTimeline3Props,
} from './timeline-3-layouts.tsx'

const meta = {
  args: { ...timeline3ControlArgs, onRetry: fn() },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTimeline3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Timeline/Timeline3/States',
} satisfies Meta<ComposedTimeline3Props>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Financeiro')).toBeVisible()
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando etapas'),
    ).toBeVisible()
  },
}

export const ErrorState: Story = {
  name: 'Error',
  args: { error: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Tentar novamente' }),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  args: { empty: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhuma etapa de aprovação'),
    ).toBeVisible()
  },
}
