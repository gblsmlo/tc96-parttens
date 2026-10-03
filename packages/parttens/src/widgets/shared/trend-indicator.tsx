import { type AmountFormatOptions, formatAmount } from '@tc96/helpers/format'
import { Badge } from '@tc96/ui/badge'
import { cn } from '@tc96/utils'
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from 'lucide-react'
import type { ReactElement } from 'react'
import type { TrendDirection } from '../types'

export interface TrendIndicatorLabels {
  down: string
  flat: string
  up: string
}

export interface TrendIndicatorProps {
  className?: string
  /** Padrão: percentual com duas casas; o valor é uma razão (`0.0044`). */
  format?: AmountFormatOptions
  /** Prefixo lido por leitores de tela, já que a direção é só visual. */
  labels?: TrendIndicatorLabels
  /** `badge` usa o Badge do COSS; `plain` é texto colorido, para gráficos. */
  variant?: 'badge' | 'plain'
  value: number
}

const defaultLabels: TrendIndicatorLabels = {
  down: 'Queda de',
  flat: 'Sem variação',
  up: 'Alta de',
}

export function trendDirection(value: number): TrendDirection {
  if (value > 0) return 'up'
  if (value < 0) return 'down'
  return 'flat'
}

const icons = {
  down: ArrowDownIcon,
  flat: MinusIcon,
  up: ArrowUpIcon,
} as const

const badgeVariants = {
  down: 'error',
  flat: 'secondary',
  up: 'success',
} as const

const plainTones = {
  down: 'text-destructive-foreground',
  flat: 'text-muted-foreground',
  up: 'text-success-foreground',
} as const

export function TrendIndicator({
  className,
  format = { style: 'percent' },
  labels = defaultLabels,
  variant = 'badge',
  value,
}: Readonly<TrendIndicatorProps>): ReactElement {
  const direction = trendDirection(value)
  const Icon = icons[direction]
  const content = (
    <>
      <Icon aria-hidden="true" />
      <span className="sr-only">{labels[direction]} </span>
      {formatAmount(Math.abs(value), format)}
    </>
  )

  if (variant === 'plain') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 font-medium text-sm tabular-nums [&_svg]:size-3.5 [&_svg]:shrink-0',
          plainTones[direction],
          className,
        )}
        data-direction={direction}
        data-slot="trend-indicator"
      >
        {content}
      </span>
    )
  }

  return (
    <Badge
      className={cn('tabular-nums', className)}
      data-direction={direction}
      data-slot="trend-indicator"
      size="lg"
      variant={badgeVariants[direction]}
    >
      {content}
    </Badge>
  )
}
