import type { ReactElement, ReactNode } from 'react'

export type ShellRenderLink = (href: string) => ReactElement

export interface ShellAction {
  icon?: ReactNode
  label: string
  onSelect: () => void
  variant?: 'default' | 'destructive'
}

export interface ShellNavSubItem {
  active?: boolean
  href: string
  title: string
}

export interface ShellNavItem {
  actions?: ShellAction[]
  active?: boolean
  badge?: ReactNode
  href?: string
  icon?: ReactNode
  items?: ShellNavSubItem[]
  title: string
}

export interface ShellNavGroup {
  items: ShellNavItem[]
  label: string
}

export interface ShellWorkspace {
  description?: string
  id: string
  logo?: ReactNode
  name: string
}

export interface ShellUser {
  avatarUrl?: string
  email: string
  name: string
}

export interface ShellBreadcrumbItem {
  href?: string
  label: string
}

export type ShellTheme = 'light' | 'dark' | 'system'

export interface ShellNotification {
  description?: string
  id: string
  time: string
  title: string
  unread?: boolean
}

export interface ShellLabels {
  account: string
  breadcrumb: string
  itemActions: (title: string) => string
  markAllRead: string
  navigation: string
  notifications: string
  notificationsEmpty: string
  notificationsTrigger: (unread: number) => string
  projects: string
  search: string
  searchClose: string
  searchEmpty: string
  searchNavigate: string
  searchOpen: string
  searchPlaceholder: string
  sections: string
  signOut: string
  switchWorkspace: string
  theme: string
  themeDark: string
  themeLight: string
  themeSystem: string
  toggleSidebar: string
  unread: string
  workspaces: string
}

export interface AppShellBaseProps {
  actions?: ReactNode
  breadcrumbs?: ShellBreadcrumbItem[]
  children?: ReactNode
  defaultOpen?: boolean
  labels?: Partial<ShellLabels>
  navigation: ShellNavGroup[]
  onOpenChange?: (open: boolean) => void
  onSignOut?: () => void
  onThemeChange?: (theme: ShellTheme) => void
  onWorkspaceChange?: (workspaceId: string) => void
  open?: boolean
  padded?: boolean
  renderLink?: ShellRenderLink
  theme?: ShellTheme
  user: ShellUser
  userActions?: ShellAction[]
  workspaceId: string
  workspaces: ShellWorkspace[]
}
