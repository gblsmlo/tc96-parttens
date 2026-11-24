import type { ReactNode } from 'react'

export interface Navbar3Route {
  href: string
  label: string
}

export interface Navbar3RouteGroup {
  label: string
  routes: Navbar3Route[]
}

export interface Navbar3Notification {
  description?: string
  id: string
  time: string
  title: string
  unread?: boolean
}

export interface Navbar3User {
  avatarUrl?: string
  email: string
  name: string
}

export interface Navbar3UserAction {
  icon?: ReactNode
  id: string
  label: string
  variant?: 'default' | 'destructive'
}

export interface Navbar3Labels {
  account: string
  notifications: string
  notificationsEmpty: string
  notificationsTrigger: (unread: number) => string
  search: string
  searchClose: string
  searchEmpty: string
  searchNavigate: string
  searchOpen: string
  searchPlaceholder: string
  unread: string
}

export interface Navbar3Props {
  className?: string
  labels?: Partial<Navbar3Labels>
  logo?: ReactNode
  notifications: Navbar3Notification[]
  onNavigate?: (href: string) => void
  onNotificationSelect?: (notificationId: string) => void
  onNotificationsOpenChange?: (open: boolean) => void
  onUserAction?: (actionId: string) => void
  routes: Navbar3RouteGroup[]
  user: Navbar3User
  userActions?: Navbar3UserAction[]
}
