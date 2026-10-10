import { cva, type VariantProps } from 'class-variance-authority'
import type { EditableTextSize } from '../../properties/display/editable-text/editable-text'

export const checklistRowVariants = cva('flex min-w-0 items-center gap-2', {
  compoundVariants: [
    { class: 'h-10 px-3', density: 'md', variant: 'card' },
    { class: 'h-9 px-2', density: 'md', variant: 'plain' },
  ],
  defaultVariants: {
    density: 'md',
    variant: 'card',
  },
  variants: {
    density: {
      md: null,
      sm: 'h-8 px-2',
    },
    variant: {
      card: null,
      plain: null,
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

export const checklistVariants = cva('min-w-0 space-y-2', {
  defaultVariants: {
    variant: 'card',
  },
  variants: {
    variant: {
      card: 'pt-2 pb-4',
      plain: null,
    },
  },
})

export type ChecklistVariant = NonNullable<
  VariantProps<typeof checklistVariants>['variant']
>

export const checklistListVariants = cva('', {
  defaultVariants: {
    variant: 'card',
  },
  variants: {
    variant: {
      card: 'rounded-xl border border-border/60',
      plain: 'flex flex-col gap-0.5',
    },
  },
})

export const checklistItemVariants = cva(
  'group relative min-w-0 transition-colors hover:bg-muted/60 data-dragging:opacity-40',
  {
    defaultVariants: {
      variant: 'card',
    },
    variants: {
      variant: {
        card: 'first:rounded-t-xl last:rounded-b-xl',
        plain: 'rounded-md',
      },
    },
  },
)

export const checklistDragHandleVariants = cva(
  'cursor-grab touch-none opacity-0 transition-opacity focus-visible:opacity-100 active:cursor-grabbing group-hover:opacity-100',
  {
    defaultVariants: {
      variant: 'card',
    },
    variants: {
      variant: {
        card: '-left-8 -translate-y-1/2 invisible absolute top-1/2 z-10 focus-visible:visible group-hover:visible',
        plain: 'shrink-0',
      },
    },
  },
)

export const CHECKLIST_DELETE_BUTTON_CLASSNAME =
  'opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100'

export const CHECKLIST_TITLE_CLASSNAME =
  'min-w-0 flex-1 group-data-completed:text-muted-foreground group-data-completed:line-through'

export const CHECKLIST_TITLE_TEXT_CLASSNAME = `${CHECKLIST_TITLE_CLASSNAME} truncate`

export const CHECKLIST_TITLE_BUTTON_CLASSNAME = `${CHECKLIST_TITLE_TEXT_CLASSNAME} h-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-ring`
