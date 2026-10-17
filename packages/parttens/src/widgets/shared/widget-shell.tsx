import { Card } from '@tc96/ui/card'
import { cn } from '@tc96/utils'
import type { ComponentProps, ReactElement } from 'react'

export interface WidgetShellProps extends ComponentProps<typeof Card> {}

export function WidgetShell({
  className,
  render = <section />,
  ...props
}: Readonly<WidgetShellProps>): ReactElement {
  return (
    <Card
      className={cn('min-w-0 border-transparent', className)}
      render={render}
      {...props}
    />
  )
}
