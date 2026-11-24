import type { ReactNode } from 'react'
import type { CardBadgeData } from '../shared/types'

export interface Card2Integration {
  connected?: boolean
  description: string
  icon?: ReactNode
  id: string
  name: string
  tier?: CardBadgeData
}

export interface Card2Labels {
  connect: string
  connectTo: (name: string) => string
  connected: string
  title: string
}

export interface Card2Props {
  className?: string
  integrations: Card2Integration[]
  labels?: Partial<Card2Labels>
  onConnect?: (id: string) => void
}
