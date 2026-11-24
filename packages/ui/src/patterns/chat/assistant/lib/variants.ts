import { cn } from '@tc96/utils'
import { cva } from 'class-variance-authority'

export const assistantPanelVariants = cva('flex min-h-0 flex-col', {
  compoundVariants: [
    {
      class: 'h-[min(32rem,calc(100%-2rem))] w-[min(24rem,calc(100%-2rem))]',
      expanded: false,
      placement: 'floating',
    },
    {
      class: 'h-[min(44rem,calc(100%-2rem))] w-[min(36rem,calc(100%-2rem))]',
      expanded: true,
      placement: 'floating',
    },
  ],
  defaultVariants: { expanded: false, placement: 'docked' },
  variants: {
    expanded: { false: '', true: '' },
    placement: {
      docked: 'size-full',
      floating: 'absolute end-4 bottom-4 z-20 rounded-2xl shadow-lg/10',
    },
  },
})

export const assistantPanelClassName = (
  placement: 'docked' | 'floating',
  expanded: boolean,
  className?: string,
) => cn(assistantPanelVariants({ expanded, placement }), className)

export const assistantCardClassName = 'min-h-0 flex-1 overflow-hidden'

export const assistantHeaderClassName =
  'flex min-h-12 shrink-0 items-center gap-2 border-b ps-4 pe-2'

export const assistantActionsClassName =
  'ms-auto flex shrink-0 items-center gap-0.5'

export const assistantEmptyClassName =
  'flex min-h-0 flex-1 flex-col items-start gap-5 overflow-y-auto p-4'

export const assistantFooterClassName =
  'flex shrink-0 flex-col gap-2 px-3 pt-2 pb-3'

export const assistantDisclaimerClassName =
  'text-center text-muted-foreground text-xs'

export const assistantSuggestionsClassName = 'flex w-full flex-col gap-1.5'

export const assistantSuggestionClassName =
  'h-auto w-full justify-start whitespace-normal py-1.5 text-start'

export const assistantPlaceholderClassName = 'placeholder:text-muted-foreground'
