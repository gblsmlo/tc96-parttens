export interface Stats3Item {
  id: string
  label: string
  total: number
  value: number
}

export interface Stats3Labels {
  ratio: (value: string, total: string) => string
  title: string
}

export interface Stats3Props {
  className?: string
  items: Stats3Item[]
  labels?: Partial<Stats3Labels>
  locale?: string
  segments?: number
}
