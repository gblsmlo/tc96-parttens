import type { ReactNode } from 'react'

export interface XpProgress {
  current: number
  target: number
  total: number
}

export interface StreakDay {
  active: boolean
  id: string
  label: string
  today?: boolean
}

export interface Achievement {
  detail: string
  icon: ReactNode
  id: string
  label: string
  progress?: { current: number; target: number }
  unlocked: boolean
}

export interface Quest {
  detail?: ReactNode
  done: boolean
  icon: ReactNode
  id: string
  label: string
  progress?: { current: number; target: number }
}
