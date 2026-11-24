import type { RenderLink } from '@tc96/ui/render-anchor'

export type NavbarRenderLink = RenderLink

export type NavbarTone =
  | 'error'
  | 'info'
  | 'outline'
  | 'secondary'
  | 'success'
  | 'warning'

export interface NavbarBreadcrumbItem {
  href?: string
  label: string
}

export interface NavbarPerson {
  avatarUrl?: string
  id: string
  name: string
}
