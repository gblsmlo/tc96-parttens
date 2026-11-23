'use client'

import { Button } from '@tc96/ui/button'
import { PlusIcon } from 'lucide-react'
import type { ReactElement, Ref } from 'react'

export function ChecklistTrigger({
  addLabel,
  disabled,
  onClick,
  triggerRef,
}: Readonly<{
  addLabel: string
  disabled: boolean
  onClick: () => void
  triggerRef?: Ref<HTMLButtonElement>
}>): ReactElement {
  return (
    <Button
      data-slot="checklist-trigger"
      disabled={disabled}
      onClick={onClick}
      ref={triggerRef}
      size="sm"
      type="button"
      variant="ghost"
    >
      <PlusIcon aria-hidden="true" />
      {addLabel}
    </Button>
  )
}
