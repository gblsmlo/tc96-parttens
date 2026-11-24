export interface Stats2Labels {
  billed: string
  quota: string
  renewsOn: (date: string) => string
  title: string
  upgrade: string
  usage: (used: string, limit: string) => string
}

export interface Stats2Props {
  className?: string
  cost: number
  currency?: string
  labels?: Partial<Stats2Labels>
  limit: number
  locale?: string
  onUpgrade?: () => void
  renewsAt: Date
  timeZone?: string
  used: number
}
