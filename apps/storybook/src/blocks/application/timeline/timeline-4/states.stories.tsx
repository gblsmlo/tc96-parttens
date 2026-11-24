import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, within } from 'storybook/test'
import { timeline4ControlArgs } from './timeline-4-controls.ts'
import {
  ComposedTimeline4,
  type ComposedTimeline4Props,
} from './timeline-4-layouts.tsx'

const meta = {
  args: { ...timeline4ControlArgs, onRetry: fn(), open: true },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedTimeline4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Timeline/Timeline4/States',
} satisfies Meta<ComposedTimeline4Props>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: 'Atividades' })
    await expect(within(dialog).getAllByRole('listitem')).toHaveLength(4)
  },
}

export const Loading: Story = {
  args: { pending: true },
  play: async () => {
    await expect(
      await screen.findByLabelText('Carregando atividades'),
    ).toBeVisible()
  },
}

export const ErrorState: Story = {
  name: 'Error',
  args: { error: true },
  play: async () => {
    await expect(
      await screen.findByRole('button', { name: 'Tentar novamente' }),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  args: { empty: true },
  play: async () => {
    await expect(await screen.findByText('Nenhuma atividade')).toBeVisible()
  },
}
