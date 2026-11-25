import type { RenderLink } from '@tc96/ui/render-anchor'
import type { ReactNode } from 'react'

export interface Navbar8Category {
  id: string
  label: string
}

export interface Navbar8Notification {
  description?: string
  id: string
  read?: boolean
  time: string
  title: string
}

export interface Navbar8User {
  email?: string
  image?: string
  name: string
}

export interface Navbar8Labels {
  account: string
  categories: string
  deploy: string
  notifications: string
  notificationsEmpty: string
  notificationsTrigger: (unread: number) => string
  unread: string
}

export interface Navbar8Props {
  categories?: Navbar8Category[]
  category?: string
  className?: string
  homeHref?: string
  labels?: Partial<Navbar8Labels>
  logo?: ReactNode
  menu?: ReactNode
  name: string
  notifications?: Navbar8Notification[]
  onCategoryChange?: (id: string) => void
  onDeploy?: () => void
  onNotificationSelect?: (id: string) => void
  pending?: boolean
  renderLink?: RenderLink
  user?: Navbar8User
}
