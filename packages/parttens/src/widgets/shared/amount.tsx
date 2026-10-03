import {
  type AmountFormatOptions,
  splitAmountAtDecimal,
} from '@tc96/helpers/format'
import { cn } from '@tc96/utils'
import type { ComponentProps, ReactElement } from 'react'

export interface AmountProps extends Omit<ComponentProps<'span'>, 'children'> {
  /** Atenua o separador decimal, as casas e os sufixos. */
  dimFraction?: boolean
  format?: AmountFormatOptions
  value: number
}

export function Amount({
  className,
  dimFraction = false,
  format,
  value,
  ...props
}: Readonly<AmountProps>): ReactElement {
  const { fraction, integer } = splitAmountAtDecimal(value, format)

  return (
    <span
      className={cn('tabular-nums', className)}
      data-slot="amount"
      {...props}
    >
      {integer}
      {fraction ? (
        <span className={dimFraction ? 'text-muted-foreground' : undefined}>
          {fraction}
        </span>
      ) : null}
    </span>
  )
}
