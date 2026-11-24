import type { ReactNode } from 'react'

export const recordStatuses = [
  'pending',
  'running',
  'done',
  'skipped',
  'failed',
] as const

export type RecordStatus = (typeof recordStatuses)[number]

export interface RecordStatusListProps {
  children?: ReactNode
  className?: string
  label: string
}

export interface RecordStatusItemProps {
  action?: ReactNode
  announcement?: string
  className?: string
  detail?: ReactNode
  status: RecordStatus
  title: ReactNode
}
