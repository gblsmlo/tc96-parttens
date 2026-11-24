export interface Settings22Key {
  active: boolean
  createdAt: string
  id: string
  lastUsed?: string
  maskedToken: string
  name: string
}

export interface Settings22Labels {
  actions: (name: string) => string
  columnActions: string
  columnCreated: string
  columnLastUsed: string
  columnName: string
  columnStatus: string
  columnToken: string
  copy: (name: string) => string
  description: string
  emptyDescription: string
  emptyTitle: string
  neverUsed: string
  newKey: string
  revoke: string
  rotate: string
  status: (name: string) => string
  title: string
}

export type Settings22Action = 'rotate' | 'revoke'

export interface Settings22Props {
  className?: string
  keys: Settings22Key[]
  labels?: Partial<Settings22Labels>
  onActiveChange?: (keyId: string, active: boolean) => void
  onCopy?: (keyId: string) => void
  onCreate?: () => void
  onKeyAction?: (keyId: string, action: Settings22Action) => void
}
