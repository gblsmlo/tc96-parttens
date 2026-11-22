import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import {
  GamificationCanvas,
  GamificationDashboardCanvas,
} from './gamification-canvas.tsx'
import { DeckFooter, LearningDashboard } from './gamification-layouts.tsx'

const meta = {
  decorators: [GamificationDashboardCanvas],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/Gamification/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => <LearningDashboard />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      within(canvas.getByRole('region', { name: 'Nível e XP' })).getByRole(
        'meter',
        { name: 'Progresso para o nível 5' },
      ),
    ).toHaveAttribute('aria-valuenow', '180')
    await expect(
      canvas.getByRole('region', { name: 'Conquistas' }),
    ).toHaveTextContent('1 de 3')
    await expect(
      canvas.getByRole('region', { name: 'Missões' }),
    ).toHaveTextContent('930 XP - 2 dias seguidos')
  },
}

export const DeckFooters: Story = {
  decorators: [GamificationCanvas],
  render: () => (
    <div className="grid gap-4">
      <DeckFooter />
      <DeckFooter firstDay />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelectorAll('[data-slot="progress-ring"]'),
    ).toHaveLength(2)
  },
}
