import type { Meta, StoryObj } from '@storybook/react-vite'
import { GamificationCanvas } from './gamification-canvas.tsx'
import { gamificationControlArgs } from './gamification-controls.ts'
import { ComposedGamification, PlainHud } from './gamification-layouts.tsx'

const meta = {
  decorators: [GamificationCanvas],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/Gamification/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const LevelWithAction: Story = {
  render: () => (
    <ComposedGamification {...gamificationControlArgs} action widget="level" />
  ),
}

export const AchievementsWithAction: Story = {
  render: () => (
    <ComposedGamification
      {...gamificationControlArgs}
      action
      widget="achievements"
    />
  ),
}

export const QuestsWithAction: Story = {
  render: () => (
    <ComposedGamification {...gamificationControlArgs} action widget="quests" />
  ),
}

export const HudWithoutPills: Story = {
  render: () => <PlainHud />,
}
