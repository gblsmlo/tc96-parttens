import type { Meta, StoryObj } from '@storybook/react-vite'
import { GamificationCanvas } from './gamification-canvas.tsx'
import {
  type GamificationControls,
  gamificationControlArgs,
  gamificationControlArgTypes,
} from './gamification-controls.ts'
import { ComposedGamification } from './gamification-layouts.tsx'

const meta = {
  args: gamificationControlArgs,
  argTypes: gamificationControlArgTypes,
  decorators: [GamificationCanvas],
  parameters: {
    controls: { exclude: ['firstDay', 'widget'] },
    layout: 'padded',
  },
  render: (args) => <ComposedGamification {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/Gamification/Stories',
} satisfies Meta<GamificationControls>

export default meta

type Story = StoryObj<GamificationControls>

export const Default: Story = {}

export const Streak: Story = {
  args: { widget: 'streak' },
}

export const Achievements: Story = {
  args: { widget: 'achievements' },
}

export const Quests: Story = {
  args: { widget: 'quests' },
}

export const Hud: Story = {
  args: { widget: 'hud' },
  name: 'HUD',
}

export const Footer: Story = {
  args: { widget: 'footer' },
}

export const FirstDay: Story = {
  args: { firstDay: true },
  name: 'First day',
}

export const StreakFirstDay: Story = {
  args: { firstDay: true, widget: 'streak' },
  name: 'Streak first day',
}

export const AchievementsFirstDay: Story = {
  args: { firstDay: true, widget: 'achievements' },
  name: 'Achievements first day',
}

export const FooterWithoutScore: Story = {
  args: { firstDay: true, widget: 'footer' },
  name: 'Footer without score',
}
