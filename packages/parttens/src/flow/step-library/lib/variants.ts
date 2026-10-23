import { cva } from 'class-variance-authority'

export const flowStepLibraryClassName =
  'flex h-full min-h-0 min-w-0 flex-col gap-3 data-[collapsed]:w-14 data-[collapsed]:items-center'

export const flowStepLibraryHeaderClassName = 'flex min-w-0 flex-col gap-1'

export const flowStepLibraryGroupsClassName = 'flex flex-col gap-4 px-1 pb-1'

export const flowStepLibraryFooterClassName = 'flex flex-col gap-3'

export const flowStepGroupClassName =
  'm-0 flex min-w-0 flex-col gap-1 border-0 p-0'

export const flowStepGroupLabelClassName =
  'float-left w-full px-2 font-medium text-muted-foreground text-xs'

export const flowStepLibraryItemVariants = cva(
  'flex w-full min-w-0 cursor-grab items-center gap-3 rounded-lg p-2 text-start text-sm outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing',
  {
    defaultVariants: { collapsed: false },
    variants: {
      collapsed: {
        false: '',
        true: 'w-auto justify-center',
      },
    },
  },
)

export const flowStepLibraryItemTextClassName = 'flex min-w-0 flex-col'

export const flowStepLibraryItemDescriptionClassName =
  'truncate text-muted-foreground text-xs'

export const flowRunCardBodyClassName = 'flex flex-col gap-3 p-3'

export const flowRunCardTextClassName = 'flex min-w-0 flex-1 flex-col gap-0.5'

export const flowRunCardDescriptionClassName =
  'truncate text-muted-foreground text-xs'
