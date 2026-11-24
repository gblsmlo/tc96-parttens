export interface EmptyState4Labels {
  copied: string
  copyLink: string
  description: string
  invite: string
  title: string
}

export interface EmptyState4Props {
  className?: string
  copied?: boolean
  labels?: Partial<EmptyState4Labels>
  onCopyLink?: () => void
  onInvite?: () => void
}
