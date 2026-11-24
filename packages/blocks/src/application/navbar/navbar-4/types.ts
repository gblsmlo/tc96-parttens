export interface Navbar4Labels {
  active: string
  close: string
  history: string
  submit: string
  test: string
}

export interface Navbar4Props {
  active?: boolean
  className?: string
  labels?: Partial<Navbar4Labels>
  onActiveChange?: (active: boolean) => void
  onClose?: () => void
  onHistory?: () => void
  onSubmit?: () => void
  onTest?: () => void
  pending?: boolean
  savedText?: string
  title: string
}
