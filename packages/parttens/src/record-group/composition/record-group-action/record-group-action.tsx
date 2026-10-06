'use client'

import { Button } from '@tc96/ui/button'
import type * as React from 'react'
import type { RecordGroupActionProps } from '../../core'

export function RecordGroupAction({
  disabled,
  icon: Icon,
  label,
  onClick,
}: Readonly<RecordGroupActionProps>): React.ReactElement {
  return (
    <Button
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      size="icon-sm"
      variant="ghost"
    >
      <Icon aria-hidden="true" />
    </Button>
  )
}
