import type { RenderLink } from '@tc96/ui/render-anchor'
import type { ReactNode } from 'react'

export type Navbar9BranchKind = 'branch' | 'deploy' | 'tag'

export interface Navbar9PathItem {
  href?: string
  id: string
  label: string
}

export interface Navbar9Branch {
  default?: boolean
  id: string
  kind?: Navbar9BranchKind
  label: string
}

export interface Navbar9Labels {
  branchTrigger: (branch: string) => string
  defaultBadge: string
  kinds: Record<Navbar9BranchKind, string>
  path: string
  run: string
  running: string
  share: string
}

export interface Navbar9Props {
  branch?: string
  branches?: Navbar9Branch[]
  className?: string
  labels?: Partial<Navbar9Labels>
  logo?: ReactNode
  name: string
  onBranchChange?: (branchId: string) => void
  onRun?: () => void
  onShare?: () => void
  path: Navbar9PathItem[]
  renderLink?: RenderLink
  running?: boolean
}
