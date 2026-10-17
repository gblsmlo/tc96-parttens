import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { PersonPropertyOption } from '../../properties/display/person/person-property'
import type { ChecklistDensity, ChecklistVariant } from '../lib/variants'

export type { ChecklistDensity, ChecklistVariant } from '../lib/variants'

export interface ChecklistItem {
  authorId?: string | null
  completed: boolean
  dueDate?: string | null
  id: string
  title: string
}

export interface ChecklistProps
  extends Omit<ComponentPropsWithoutRef<'section'>, 'title'> {
  ariaLabel: string
  authorOptions?: readonly PersonPropertyOption[]
  creating?: boolean
  density?: ChecklistDensity
  feedback?: ReactNode
  items: readonly ChecklistItem[]
  locale?: string
  newItemTitle: string
  onCreate: (title: string, completed: boolean) => void
  onItemClick?: (item: ChecklistItem) => void
  onItemAuthorChange?: (id: string, authorId: string) => void
  onItemCompletionChange: (id: string, completed: boolean) => void
  onItemDelete?: (id: string) => void
  onItemDueDateChange?: (id: string, dueDate: string | null) => void
  onItemMove: (id: string, targetIndex: number) => void
  onItemRename: (id: string, title: string) => void
  onNewItemTitleChange: (title: string) => void
  progress?: boolean
  readOnly?: boolean
  title?: ReactNode
  timeZone?: string
  variant?: ChecklistVariant
}
