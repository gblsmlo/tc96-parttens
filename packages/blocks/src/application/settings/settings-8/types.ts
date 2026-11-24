export interface Settings8Labels {
  description: string
  enable: string
  title: string
}

export interface Settings8Props {
  className?: string
  enabled?: boolean
  labels?: Partial<Settings8Labels>
  onEnabledChange?: (enabled: boolean) => void
}
