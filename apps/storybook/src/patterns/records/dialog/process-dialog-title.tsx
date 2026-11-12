import { ChevronRightIcon } from 'lucide-react'

export function ProcessDialogTitle({ number }: Readonly<{ number?: string }>) {
  if (!number) return 'Novo processo'

  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span className="text-muted-foreground">Novo processo</span>
      <ChevronRightIcon
        aria-hidden
        className="size-4 shrink-0 text-muted-foreground"
      />{' '}
      <span className="tabular-nums">{number}</span>
    </span>
  )
}
