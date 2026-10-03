import { Card } from '@tc96/ui/card'
import { cn } from '@tc96/utils'
import type { ComponentProps, ReactElement } from 'react'

export interface CardWidgetShellProps extends ComponentProps<typeof Card> {}

export function CardWidgetShell({
  className,
  render = <section />,
  ...props
}: Readonly<CardWidgetShellProps>): ReactElement {
  return (
    <Card
      className={cn(
        'min-w-0 border-border/40 shadow-none before:hidden',
        className,
      )}
      render={render}
      {...props}
    />
  )
}
