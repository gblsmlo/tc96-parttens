import { cn } from '@tc96/utils'

export function SettingsSwatch({ className }: Readonly<{ className: string }>) {
  return (
    <span aria-hidden="true" className={cn('size-3 rounded-full', className)} />
  )
}
