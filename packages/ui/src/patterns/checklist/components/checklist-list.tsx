import { Card } from '@tc96/ui/card'
import type { ReactElement, ReactNode } from 'react'
import { type ChecklistFrame, checklistListVariants } from '../lib/variants'

export function ChecklistList({
  children,
  variant,
}: Readonly<{
  children: ReactNode
  variant: ChecklistFrame
}>): ReactElement {
  const list = (
    <ol
      className={checklistListVariants({ variant }) || undefined}
      data-slot="checklist-items"
    >
      {children}
    </ol>
  )

  return variant === 'card' ? <Card>{list}</Card> : list
}
