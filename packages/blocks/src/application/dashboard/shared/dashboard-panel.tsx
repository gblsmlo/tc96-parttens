import { WidgetShell } from '@tc96/parttens/widgets/shared/widget-shell'
import { CardAction, CardHeader, CardPanel, CardTitle } from '@tc96/ui/card'
import { cn } from '@tc96/utils'
import type { ReactNode } from 'react'
import { useId } from 'react'

export interface DashboardPanelProps {
  action?: ReactNode
  children: ReactNode
  className?: string
  title: string
}

export function DashboardPanel({
  action,
  children,
  className,
  title,
}: Readonly<DashboardPanelProps>) {
  const titleId = useId()

  return (
    <WidgetShell aria-labelledby={titleId} className={className}>
      <CardHeader className="grid-rows-1 items-center p-5">
        <CardTitle className="font-semibold text-base" id={titleId}>
          {title}
        </CardTitle>
        {action ? (
          <CardAction className="row-span-1 self-center">{action}</CardAction>
        ) : null}
      </CardHeader>
      <CardPanel className={cn('grid gap-4 px-5 pb-5')}>{children}</CardPanel>
    </WidgetShell>
  )
}
