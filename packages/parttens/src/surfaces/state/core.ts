import type { ReactNode } from 'react'

export const STATE_SURFACE_KINDS = [
  'empty',
  'no-result',
  'error',
  'permission',
  'not-found',
] as const

export type StateSurfaceKind = (typeof STATE_SURFACE_KINDS)[number]

export type StateGuardState = 'data' | 'loading' | StateSurfaceKind

export type StateSurfaceRole = 'alert' | 'status'

export const STATE_SURFACE_ROLES = {
  empty: 'status',
  error: 'alert',
  'no-result': 'status',
  'not-found': 'status',
  permission: 'alert',
} as const satisfies Record<StateSurfaceKind, StateSurfaceRole>

export const STATE_SURFACE_ICON_COLORS: Partial<
  Record<StateSurfaceKind, string>
> = {
  error: 'var(--destructive)',
  permission: 'var(--destructive)',
}

export interface StateSurfaceProps {
  actions?: ReactNode
  className?: string
  description: ReactNode
  icon?: ReactNode
  kind: StateSurfaceKind
  title: ReactNode
}

export type StateGuardProps = {
  children: ReactNode
} & (
  | { state: 'data'; surface?: Omit<StateSurfaceProps, 'kind'> }
  | {
      state: 'loading'
      surface: Pick<StateSurfaceProps, 'className' | 'title'> & {
        description?: ReactNode
      }
    }
  | { state: StateSurfaceKind; surface: Omit<StateSurfaceProps, 'kind'> }
)
