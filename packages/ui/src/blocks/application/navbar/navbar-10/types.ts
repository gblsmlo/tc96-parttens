import type { ReactNode } from 'react'

export type Navbar10Method = 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT'

export interface Navbar10Service {
  id: string
  label: string
}

export interface Navbar10User {
  email?: string
  image?: string
  name: string
}

export interface Navbar10Request {
  method: Navbar10Method
  path: string
}

export interface Navbar10Labels {
  account: string
  method: string
  path: string
  pathPlaceholder: string
  request: string
  send: string
  service: string
  serviceTrigger: (name: string) => string
}

export interface Navbar10Props {
  className?: string
  labels?: Partial<Navbar10Labels>
  logo?: ReactNode
  menu?: ReactNode
  method?: Navbar10Method
  name: string
  onMethodChange?: (method: Navbar10Method) => void
  onPathChange?: (path: string) => void
  onSend?: (request: Navbar10Request) => void
  onServiceChange?: (id: string) => void
  path?: string
  sending?: boolean
  service?: string
  services?: Navbar10Service[]
  user?: Navbar10User
}
