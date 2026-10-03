import { cn } from '@tc96/utils'
import type { ComponentProps, ReactElement } from 'react'

export type MetricPillTone = 'muted' | 'primary' | 'success' | 'warning'

export interface MetricPillProps extends Omit<ComponentProps<'span'>, 'ref'> {
  as?: 'li' | 'span'
  tone?: MetricPillTone
}

const tones: Record<MetricPillTone, string> = {
  muted: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/10 [&>svg]:text-primary',
  success: 'bg-success/15 [&>svg]:text-success-foreground',
  warning: 'bg-warning/15 [&>svg]:text-warning-foreground',
}

export function MetricPill({
  as: Tag = 'span',
  className,
  tone = 'muted',
  ...props
}: Readonly<MetricPillProps>): ReactElement {
  return (
    <Tag
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 font-medium text-sm tabular-nums [&>svg]:size-4 [&>svg]:shrink-0',
        tones[tone],
        className,
      )}
      data-slot="metric-pill"
      data-tone={tone}
      {...props}
    />
  )
}
