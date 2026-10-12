import { CardSurface } from '@tc96/elements/card-surface'
import { cn } from '@tc96/utils'
import type { ComponentProps, ReactElement } from 'react'

export interface WidgetShellProps extends ComponentProps<typeof CardSurface> {}

export function WidgetShell({
  className,
  render = <section />,
  ...props
}: Readonly<WidgetShellProps>): ReactElement {
  return (
    <CardSurface
      className={cn('min-w-0 border-transparent', className)}
      render={render}
      {...props}
    />
  )
}
