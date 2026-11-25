import { CaretRightIcon } from '@phosphor-icons/react'
import { CardPanel } from '@tc96/ui/card'
import { WidgetShell } from '@tc96/ui/patterns/widgets/shared/widget-shell'
import type { RenderLink } from '@tc96/ui/render-anchor'
import { cn } from '@tc96/utils'
import { DashboardLink } from './dashboard-link'

export type DashboardMetricTone =
  | 'negative'
  | 'neutral'
  | 'positive'
  | 'warning'

const toneClassNames: Record<DashboardMetricTone, string> = {
  negative: 'text-destructive-foreground',
  neutral: 'text-foreground',
  positive: 'text-success-foreground',
  warning: 'text-warning-foreground',
}

export interface DashboardMetricCardProps {
  description?: string
  detail?: string
  href?: string
  id: string
  label: string
  renderLink?: RenderLink
  tone?: DashboardMetricTone
  value: string
}

export function DashboardMetricCard({
  description,
  detail,
  href,
  id,
  label,
  renderLink,
  tone = 'neutral',
  value,
}: Readonly<DashboardMetricCardProps>) {
  return (
    <WidgetShell className="h-full" data-metric={id}>
      <CardPanel className="grid content-start gap-2 p-5">
        {href && renderLink ? (
          <DashboardLink
            className="flex items-center justify-between gap-2 text-muted-foreground text-sm hover:text-foreground"
            href={href}
            renderLink={renderLink}
          >
            {label}
            <CaretRightIcon aria-hidden="true" className="size-3.5 shrink-0" />
          </DashboardLink>
        ) : (
          <p className="text-muted-foreground text-sm">{label}</p>
        )}
        <p
          className={cn(
            'font-semibold text-2xl tabular-nums',
            toneClassNames[tone],
          )}
          data-slot="dashboard-metric-value"
        >
          {value}
        </p>
        {detail ? (
          <p className="text-muted-foreground text-xs tabular-nums">{detail}</p>
        ) : null}
        {description ? (
          <p
            className="text-muted-foreground text-xs"
            data-slot="dashboard-metric-description"
          >
            {description}
          </p>
        ) : null}
      </CardPanel>
    </WidgetShell>
  )
}
