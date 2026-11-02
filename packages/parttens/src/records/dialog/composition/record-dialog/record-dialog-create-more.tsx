'use client'

import { Switch } from '@tc96/ui/switch'
import { useId } from 'react'
import type { RecordDialogCreateMoreProps } from '../../core'

export function RecordDialogCreateMore({
  checked,
  disabled,
  label,
  onCheckedChange,
}: RecordDialogCreateMoreProps) {
  const id = useId()

  return (
    <div
      className="flex items-center gap-2"
      data-slot="record-dialog-create-more"
    >
      <Switch
        checked={checked}
        disabled={disabled}
        id={id}
        onCheckedChange={onCheckedChange}
      />
      <label className="text-sm" htmlFor={id}>
        {label}
      </label>
    </div>
  )
}
