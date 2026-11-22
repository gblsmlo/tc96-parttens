import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AchievementsWidget,
  LevelWidget,
  ProgressFooter,
  ProgressHud,
  QuestsWidget,
  StreakWidget,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { expect, within } from 'storybook/test'
import { GamificationCanvas } from './gamification-canvas.tsx'
import { week, xp } from './gamification-data.tsx'

const metrics = [{ icon: null, id: 'cards', value: '24 cartões' }]

const meta = {
  decorators: [GamificationCanvas],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Widgets/Gamification/Behavior',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const LevelReportsXpOnANamedMeter: Story = {
  render: () => <LevelWidget level={4} title="Seu progresso" xp={xp} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const meter = canvas.getByRole('meter', {
      name: 'Progresso para o nível 5',
    })
    await expect(meter).toHaveAttribute('aria-valuenow', '180')
    await expect(meter).toHaveAttribute('aria-valuemax', '250')
    const region = canvas.getByRole('region', { name: 'Seu progresso' })
    await expect(region.textContent).toContain('930 XP no total')
    await expect(region.textContent).toContain('Faltam 70 XP para o nível 5.')
  },
}

export const LevelClampsXpBeyondTarget: Story = {
  render: () => (
    <LevelWidget
      level={4}
      title="Seu progresso"
      xp={{ current: 300, target: 250, total: 1050 }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('meter', { name: 'Progresso para o nível 5' }),
    ).toHaveAttribute('aria-valuenow', '250')
    await expect(canvas.getByText(/Faltam/).textContent).toContain(
      'Faltam 0 XP',
    )
  },
}

export const StreakAnnouncesDayState: Story = {
  render: () => (
    <StreakWidget
      days={3}
      title="Sequência"
      week={[
        { active: true, id: 'd1', label: 'seg' },
        { active: false, id: 'd2', label: 'ter', today: true },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const list = canvas.getByRole('list', { name: 'Dias de estudo' })
    await expect(list.textContent).toContain('seg: estudou')
    await expect(list.textContent).toContain('ter, hoje: sem estudo')
    await expect(list.querySelectorAll('[data-today="true"]')).toHaveLength(1)
    await expect(
      canvas.getByRole('region', { name: 'Sequência' }).textContent,
    ).toContain('3dias seguidos')
  },
}

export const StreakKeepsTheWeekOnOneRow: Story = {
  render: () => <StreakWidget days={2} title="Sequência" week={week} />,
  play: async ({ canvasElement }) => {
    const days = within(canvasElement).getByRole('list', {
      name: 'Dias de estudo',
    })
    const tops = new Set(
      [...days.querySelectorAll('li')].map((day) =>
        Math.round(day.getBoundingClientRect().top),
      ),
    )
    await expect(days.querySelectorAll('li')).toHaveLength(7)
    await expect(tops.size).toBe(1)
  },
}

export const AchievementsCountAndNameState: Story = {
  render: () => (
    <AchievementsWidget
      achievements={[
        {
          detail: 'Conclua uma sessão',
          icon: null,
          id: 'first',
          label: 'Primeiro passo',
          unlocked: true,
        },
        {
          detail: 'Estude 5 dias seguidos',
          icon: null,
          id: 'streak',
          label: 'Fogo aceso',
          progress: { current: 3, target: 5 },
          unlocked: false,
        },
      ]}
      title="Conquistas"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvas.getByRole('region', { name: 'Conquistas' })
    await expect(region.textContent).toContain('1 de 2')
    await expect(
      canvas.getByText('Primeiro passo').closest('li')?.textContent,
    ).toContain('conquistada')
    const locked = canvas.getByText('Fogo aceso').closest('li')
    await expect(locked?.textContent).toContain('bloqueada')
    await expect(locked?.textContent).toContain('3/5')
  },
}

export const AchievementsActionReplacesTheCount: Story = {
  render: () => (
    <AchievementsWidget
      achievements={[
        {
          detail: 'Conclua uma sessão',
          icon: null,
          id: 'first',
          label: 'Primeiro passo',
          unlocked: true,
        },
      ]}
      action={
        <Button size="sm" variant="ghost">
          Ver tudo
        </Button>
      }
      title="Conquistas"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Ver tudo' })).toBeVisible()
    await expect(
      canvas.getByRole('region', { name: 'Conquistas' }).textContent,
    ).not.toContain('1 de 1')
  },
}

export const QuestsListOpenBeforeFinished: Story = {
  render: () => (
    <QuestsWidget
      description="930 XP - 2 dias seguidos"
      quests={[
        {
          done: true,
          icon: null,
          id: 'first',
          label: 'Primeiro passo',
        },
        {
          detail: 'Faltam 70 XP',
          done: false,
          icon: null,
          id: 'level',
          label: 'Chegar ao nível 5',
          progress: { current: 180, target: 250 },
        },
      ]}
      title="Missões"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const items = within(
      canvas.getByRole('region', { name: 'Missões' }),
    ).getAllByRole('listitem')
    await expect(
      items.map((item) => [
        item.querySelector('p')?.textContent,
        item.hasAttribute('data-done'),
      ]),
    ).toEqual([
      ['Chegar ao nível 5', false],
      ['Primeiro passo', true],
    ])
    await expect(
      canvas.getByRole('meter', { name: 'Chegar ao nível 5' }),
    ).toHaveAttribute('aria-valuenow', '180')
    await expect(canvas.getByText('Concluída')).toBeInTheDocument()
    await expect(canvas.getByText('930 XP - 2 dias seguidos')).toBeVisible()
  },
}

export const ProgressHudNamesStreakAndAchievements: Story = {
  render: () => (
    <ProgressHud
      achievements={{ total: 3, unlocked: 1 }}
      aria-label="Seu progresso"
      level={4}
      streakDays={3}
      xp={xp}
    />
  ),
  play: async ({ canvasElement }) => {
    const hud = within(canvasElement).getByRole('region', {
      name: 'Seu progresso',
    })
    await expect(hud.textContent).toContain('3 dias seguidos')
    await expect(hud.textContent).toContain('1/3 conquistas')
    await expect(hud.textContent).toContain('180/250 XP')
  },
}

export const ProgressHudStaysOnOneLine: Story = {
  render: () => (
    <ProgressHud
      achievements={{ total: 3, unlocked: 1 }}
      aria-label="Seu progresso"
      level={4}
      streakDays={2}
      xp={xp}
    />
  ),
  play: async ({ canvasElement }) => {
    const hud = within(canvasElement).getByRole('region', {
      name: 'Seu progresso',
    })
    const ring = hud.querySelector<HTMLElement>('[data-slot="progress-ring"]')
    if (!ring) throw new Error('Level ring not rendered')
    await expect(hud.getBoundingClientRect().height).toBeLessThanOrEqual(
      ring.getBoundingClientRect().height + 16,
    )
  },
}

export const ProgressFooterReadsScoreWithLabel: Story = {
  render: () => (
    <ProgressFooter
      metrics={metrics}
      score={{ display: '86%', max: 100, srLabel: 'de acerto', value: 86 }}
    />
  ),
  play: async ({ canvasElement }) => {
    const footer = canvasElement.querySelector(
      '[data-widget="progress-footer"]',
    )
    await expect(footer?.textContent).toBe('24 cartões86% de acerto')
    await expect(
      canvasElement.querySelector('[data-slot="progress-ring"]'),
    ).not.toHaveAttribute('data-empty', 'true')
  },
}

export const ProgressFooterWithoutScoreHasNoLabel: Story = {
  render: () => (
    <ProgressFooter
      metrics={metrics}
      score={{ display: '—', max: 100, srLabel: 'de acerto', value: null }}
    />
  ),
  play: async ({ canvasElement }) => {
    const footer = canvasElement.querySelector(
      '[data-widget="progress-footer"]',
    )
    await expect(footer?.textContent).toBe('24 cartões—')
    await expect(
      canvasElement.querySelector('[data-slot="progress-ring"]'),
    ).toHaveAttribute('data-empty', 'true')
  },
}
