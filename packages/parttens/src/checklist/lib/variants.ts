import { cva, type VariantProps } from 'class-variance-authority'
import type { EditableTextSize } from '../../properties/display/editable-text/editable-text'

export const checklistRowVariants = cva('flex min-w-0 items-center gap-2', {
  defaultVariants: {
    density: 'md',
  },
  variants: {
    density: {
      md: 'h-10 px-3',
      sm: 'h-8 px-2',
    },
  },
})

export type ChecklistDensity = NonNullable<
  VariantProps<typeof checklistRowVariants>['density']
>

export const checklistCheckboxVariants = cva(
  "after:absolute after:content-['']",
  {
    defaultVariants: {
      density: 'md',
    },
    variants: {
      density: {
        md: 'after:size-11',
        sm: 'after:size-8',
      },
    },
  },
)

export const checklistDraftInputVariants = cva(
  'min-w-0 flex-1 rounded-sm bg-transparent outline-none placeholder:text-foreground/40 focus-visible:outline-2 focus-visible:outline-ring',
  {
    defaultVariants: {
      density: 'md',
    },
    variants: {
      density: {
        md: 'text-base',
        sm: 'text-sm',
      },
    },
  },
)

export const checklistDueDateVariants = cva('', {
  defaultVariants: {
    status: 'upcoming',
  },
  variants: {
    status: {
      overdue: 'text-destructive-foreground',
      today: 'text-warning-foreground',
      upcoming: 'text-muted-foreground',
    },
  },
})

export type ChecklistDueStatus = NonNullable<
  VariantProps<typeof checklistDueDateVariants>['status']
>

export const CHECKLIST_TITLE_SIZE = {
  md: 'base',
  sm: 'sm',
} as const satisfies Record<ChecklistDensity, EditableTextSize>

export const CHECKLIST_LIST_CLASSNAME = 'rounded-xl border border-border/60'

export const CHECKLIST_ITEM_CLASSNAME =
  'group relative min-w-0 transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-muted/60 data-dragging:opacity-40'

export const CHECKLIST_DRAG_HANDLE_CLASSNAME =
  '-left-8 -translate-y-1/2 invisible absolute top-1/2 z-10 cursor-grab touch-none opacity-0 transition-opacity focus-visible:visible focus-visible:opacity-100 active:cursor-grabbing group-hover:visible group-hover:opacity-100'

export const CHECKLIST_DELETE_BUTTON_CLASSNAME =
  'opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100'

export const CHECKLIST_TITLE_CLASSNAME =
  'min-w-0 flex-1 group-data-completed:text-muted-foreground group-data-completed:line-through'

export const CHECKLIST_TITLE_TEXT_CLASSNAME = `${CHECKLIST_TITLE_CLASSNAME} truncate`

export const CHECKLIST_TITLE_BUTTON_CLASSNAME = `${CHECKLIST_TITLE_TEXT_CLASSNAME} h-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-ring`
