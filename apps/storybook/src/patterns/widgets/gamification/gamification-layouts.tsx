import {
  AchievementsWidget,
  LevelWidget,
  ProgressFooter,
  ProgressHud,
  QuestsWidget,
  StreakWidget,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { ClockIcon, LayersIcon } from 'lucide-react'
import type { ReactElement } from 'react'
import type { GamificationControls } from './gamification-controls.ts'
import {
  achievements,
  firstDayXp,
  quests,
  week,
  xp,
} from './gamification-data.tsx'

interface FirstDayOptions {
  firstDay?: boolean | undefined
}

interface ActionOptions extends FirstDayOptions {
  action?: boolean | undefined
  title?: string | undefined
}

const seeAll = (
  <Button size="sm" variant="ghost">
    Ver tudo
  </Button>
)

export function LearnerLevel({
  action = false,
  firstDay = false,
  title = 'Seu progresso',
}: Readonly<ActionOptions>): ReactElement {
  return (
    <LevelWidget
      action={action ? seeAll : undefined}
      level={firstDay ? 1 : 4}
      title={title}
      xp={firstDay ? firstDayXp : xp}
    />
  )
}

export function LearnerStreak({
  action = false,
  firstDay = false,
  title = 'Sequência',
}: Readonly<ActionOptions>): ReactElement {
  return (
    <StreakWidget
      action={action ? seeAll : undefined}
      days={firstDay ? 0 : 2}
      title={title}
      week={firstDay ? week.map((day) => ({ ...day, active: false })) : week}
    />
  )
}

export function LearnerAchievements({
  action = false,
  firstDay = false,
  title = 'Conquistas',
}: Readonly<ActionOptions>): ReactElement {
  return (
    <AchievementsWidget
      achievements={
        firstDay
          ? achievements.map((achievement) => ({
              ...achievement,
              unlocked: false,
            }))
          : achievements
      }
      action={action ? seeAll : undefined}
      title={title}
    />
  )
}

export function LearnerQuests({
  action = false,
  firstDay = false,
  title = 'Missões',
}: Readonly<ActionOptions>): ReactElement {
  return (
    <QuestsWidget
      action={action ? seeAll : undefined}
      description={
        firstDay ? '0 XP - sem sequência' : '930 XP - 2 dias seguidos'
      }
      quests={
        firstDay ? quests.map((quest) => ({ ...quest, done: false })) : quests
      }
      title={title}
    />
  )
}

export function LearnerHud({
  firstDay = false,
  title = 'Seu progresso',
}: Readonly<FirstDayOptions & { title?: string | undefined }>): ReactElement {
  return (
    <ProgressHud
      achievements={{ total: 3, unlocked: firstDay ? 0 : 1 }}
      aria-label={title}
      level={firstDay ? 1 : 4}
      streakDays={firstDay ? 0 : 2}
      xp={firstDay ? firstDayXp : xp}
    />
  )
}

export function DeckFooter({
  firstDay = false,
}: Readonly<FirstDayOptions>): ReactElement {
  return (
    <div className="rounded-lg border bg-card px-5 py-3">
      <ProgressFooter
        metrics={[
          { icon: <LayersIcon />, id: 'cards', value: '24 cartões' },
          { icon: <ClockIcon />, id: 'last-studied', value: 'anteontem' },
        ]}
        score={
          firstDay
            ? { display: '—', max: 100, srLabel: 'de acerto', value: null }
            : { display: '86%', max: 100, srLabel: 'de acerto', value: 86 }
        }
      />
    </div>
  )
}

export function ComposedGamification({
  action,
  firstDay,
  title,
  widget,
}: Readonly<GamificationControls>): ReactElement {
  const label = title || undefined

  if (widget === 'streak')
    return <LearnerStreak action={action} firstDay={firstDay} title={label} />
  if (widget === 'achievements')
    return (
      <LearnerAchievements action={action} firstDay={firstDay} title={label} />
    )
  if (widget === 'quests')
    return <LearnerQuests action={action} firstDay={firstDay} title={label} />
  if (widget === 'hud') return <LearnerHud firstDay={firstDay} title={label} />
  if (widget === 'footer') return <DeckFooter firstDay={firstDay} />
  return <LearnerLevel action={action} firstDay={firstDay} title={label} />
}

export function PlainHud(): ReactElement {
  return <ProgressHud aria-label="Seu progresso" level={4} xp={xp} />
}

export function LearningDashboard(): ReactElement {
  return (
    <div className="grid gap-4">
      <LearnerHud />
      <div className="grid items-start gap-4 md:grid-cols-2">
        <LearnerLevel title="Nível e XP" />
        <LearnerStreak />
        <LearnerAchievements />
        <LearnerQuests />
      </div>
    </div>
  )
}
