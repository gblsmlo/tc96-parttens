import type { Achievement, Quest, StreakDay } from '@tc96/parttens'
import { FlameIcon, SparklesIcon, TargetIcon } from 'lucide-react'

export const xp = { current: 180, target: 250, total: 930 }

export const firstDayXp = { current: 0, target: 250, total: 0 }

export const week: StreakDay[] = [
  { active: true, id: '2026-09-27', label: 'dom' },
  { active: false, id: '2026-09-28', label: 'seg' },
  { active: true, id: '2026-09-29', label: 'ter' },
  { active: true, id: '2026-09-30', label: 'qua' },
  { active: false, id: '2026-10-01', label: 'qui' },
  { active: true, id: '2026-10-02', label: 'sex' },
  { active: true, id: '2026-10-03', label: 'sáb', today: true },
]

export const achievements: Achievement[] = [
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

export const quests: Quest[] = [
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
