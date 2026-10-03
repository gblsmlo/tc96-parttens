import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Achievement,
  AchievementsWidget,
  LevelWidget,
  ProgressFooter,
  ProgressHud,
  type Quest,
  QuestsWidget,
  type StreakDay,
  StreakWidget,
} from '@tc96/parttens'
import {
  ClockIcon,
  FlameIcon,
  LayersIcon,
  SparklesIcon,
  TargetIcon,
} from 'lucide-react'
import { expect, within } from 'storybook/test'

const xp = { current: 180, target: 250, total: 930 }

const week: StreakDay[] = [
  { active: true, id: '2026-09-27', label: 'dom' },
  { active: false, id: '2026-09-28', label: 'seg' },
  { active: true, id: '2026-09-29', label: 'ter' },
  { active: true, id: '2026-09-30', label: 'qua' },
  { active: false, id: '2026-10-01', label: 'qui' },
  { active: true, id: '2026-10-02', label: 'sex' },
  { active: true, id: '2026-10-03', label: 'sáb', today: true },
]

const achievements: Achievement[] = [
  {
    detail: 'Conclua sua primeira sessão',
    icon: <SparklesIcon />,
    id: 'first_session',
    label: 'Primeiro passo',
    unlocked: true,
  },
  {
    detail: 'Estude em 5 dias seguidos',
    icon: <FlameIcon />,
    id: 'streak_5',
    label: 'Fogo aceso',
    progress: { current: 2, target: 5 },
    unlocked: false,
  },
  {
    detail: '90% em 10 cartões ou mais',
    icon: <TargetIcon />,
    id: 'accuracy_90',
    label: 'Precisão alta',
    unlocked: false,
  },
]

const quests: Quest[] = [
  {
    detail: 'Faltam 70 XP',
    done: false,
    icon: <SparklesIcon />,
    id: 'goal:level',
    label: 'Chegar ao nível 5',
    progress: { current: 180, target: 250 },
  },
  {
    detail: '2 dias de 5',
    done: false,
    icon: <FlameIcon />,
    id: 'goal:streak',
    label: 'Sequência de 5 dias',
    progress: { current: 2, target: 5 },
  },
  ...achievements.map<Quest>((achievement) => ({
    detail: achievement.detail,
    done: achievement.unlocked,
    icon: achievement.icon,
    id: `achievement:${achievement.id}`,
    label: achievement.label,
    ...(achievement.progress ? { progress: achievement.progress } : {}),
  })),
]

const meta = {
  parameters: {
    layout: 'centered',
  },
  title: 'Patterns/Widgets/Gamification',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Level: Story = {
  render: () => (
    <div className="w-[26rem] max-w-full">
      <LevelWidget level={4} title="Seu progresso" xp={xp} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const meter = within(canvasElement).getByRole('meter', {
      name: 'Progresso para o nível 5',
    })
    await expect(meter).toHaveAttribute('aria-valuenow', '180')
    await expect(canvasElement).toHaveTextContent(
      'Faltam 70 XP para o nível 5.',
    )
  },
}

export const Streak: Story = {
  render: () => (
    <div className="w-[22rem] max-w-full">
      <StreakWidget days={2} title="Sequência" week={week} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const days = within(canvasElement).getByRole('list', {
      name: 'Dias de estudo',
    })
    const tops = new Set(
      [...days.querySelectorAll('li')].map((day) =>
        Math.round(day.getBoundingClientRect().top),
      ),
    )
    await expect(tops.size).toBe(1)
  },
}

export const Achievements: Story = {
  render: () => (
    <div className="w-[22rem] max-w-full">
      <AchievementsWidget achievements={achievements} title="Conquistas" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toHaveTextContent('1 de 3')
    await expect(
      canvasElement.querySelectorAll('[data-slot="achievement"]'),
    ).toHaveLength(3)
  },
}

export const Quests: Story = {
  render: () => (
    <div className="w-[26rem] max-w-full">
      <QuestsWidget
        description="930 XP - 2 dias seguidos"
        quests={quests}
        title="Missões"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const items = canvasElement.querySelectorAll('[data-slot="quest"]')
    await expect(items).toHaveLength(5)
    await expect(items[items.length - 1]).toHaveAttribute('data-done', 'true')
    await expect(canvasElement).toHaveTextContent('930 XP - 2 dias seguidos')
  },
}

export const Hud: Story = {
  render: () => (
    <div className="w-[26rem] max-w-full">
      <ProgressHud
        achievements={{ total: 3, unlocked: 1 }}
        aria-label="Seu progresso"
        level={4}
        streakDays={2}
        xp={xp}
      />
    </div>
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

export const Footer: Story = {
  render: () => (
    <div className="grid w-[22rem] max-w-full gap-4">
      {[
        { display: '86%', value: 86 },
        { display: '—', value: null },
      ].map((score) => (
        <div
          className="rounded-lg border border-border/80 bg-card px-5 py-3"
          key={score.display}
        >
          <ProgressFooter
            metrics={[
              { icon: <LayersIcon />, id: 'cards', value: '24 cartões' },
              { icon: <ClockIcon />, id: 'last-studied', value: 'anteontem' },
            ]}
            score={{ ...score, max: 100, srLabel: 'de acerto' }}
          />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const rings = canvasElement.querySelectorAll('[data-slot="progress-ring"]')
    await expect(rings).toHaveLength(2)
    await expect(rings[1]).toHaveAttribute('data-empty', 'true')
  },
}

export const FirstDay: Story = {
  render: () => (
    <div className="grid w-[22rem] max-w-full gap-4">
      <LevelWidget
        level={1}
        title="Seu progresso"
        xp={{ current: 0, target: 250, total: 0 }}
      />
      <StreakWidget
        days={0}
        title="Sequência"
        week={week.map((day) => ({ ...day, active: false }))}
      />
      <AchievementsWidget
        achievements={achievements.map((achievement) => ({
          ...achievement,
          unlocked: false,
        }))}
        title="Conquistas"
      />
    </div>
  ),
}

export const Overview: Story = {
  render: () => (
    <div className="grid w-[56rem] max-w-full gap-4">
      <ProgressHud
        achievements={{ total: 3, unlocked: 1 }}
        aria-label="Seu progresso"
        level={4}
        streakDays={2}
        xp={xp}
      />
      <div className="grid items-start gap-4 md:grid-cols-2">
        <LevelWidget level={4} title="Nível e XP" xp={xp} />
        <StreakWidget days={2} title="Sequência" week={week} />
        <AchievementsWidget achievements={achievements} title="Conquistas" />
        <QuestsWidget
          description="930 XP - 2 dias seguidos"
          quests={quests}
          title="Missões"
        />
      </div>
    </div>
  ),
}
