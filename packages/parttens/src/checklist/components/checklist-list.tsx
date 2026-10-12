import { CardSurface } from '@tc96/elements/card-surface'
import type { ReactElement, ReactNode } from 'react'
import { checklistListVariants } from '../lib/variants'
import type { ChecklistVariant } from '../types/index'

export function ChecklistList({
  children,
  variant,
}: Readonly<{
  children: ReactNode
  variant: ChecklistVariant
}>): ReactElement {
  const list = (
    <ol
      className={checklistListVariants({ variant }) || undefined}
      data-slot="checklist-items"
    >
      {children}
    </ol>
  )

  return variant === 'card' ? <CardSurface>{list}</CardSurface> : list
}
