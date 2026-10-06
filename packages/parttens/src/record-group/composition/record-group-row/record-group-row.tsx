import { cn } from '@tc96/utils'
import type * as React from 'react'
import type { RecordGroupRowProps } from '../../core'
import {
  recordGroupRowLabelVariants,
  recordGroupRowValueVariants,
  recordGroupRowVariants,
} from '../../lib/variants'

export function RecordGroupRow({
  align = 'start',
  children,
  className,
  label,
  leading,
}: Readonly<RecordGroupRowProps>): React.ReactElement {
  return (
    <div
      className={cn(recordGroupRowVariants({ align }), className)}
      data-align={align}
      data-slot="record-group-row"
    >
      <div
        className={recordGroupRowLabelVariants({ align })}
        data-slot="record-group-row-label"
      >
        {leading ? (
          <span className="flex shrink-0 items-center [&_svg]:size-4">
            {leading}
          </span>
        ) : null}
        <span className="truncate">{label}</span>
      </div>
      <div
        className={recordGroupRowValueVariants({ align })}
        data-slot="record-group-row-value"
      >
        {children}
      </div>
    </div>
  )
}
