import { cn } from '@tc96/utils'
import { cva } from 'class-variance-authority'
import type { ChatsPanelSkeletonWidth, ChatsPanelVariant } from '../core'

export const chatsPanelClassName = (
  variant: ChatsPanelVariant,
  className?: string,
) =>
  cn(
    'flex min-h-0 flex-col [--avatar-size:--spacing(10)]',
    variant === 'inset' && 'gap-1',
    className,
  )

export const chatsPanelShellClassName =
  'min-h-0 flex-1 overflow-hidden bg-muted/72 shadow-none before:hidden'

export const chatsPanelHeaderClassName =
  'flex min-h-12 shrink-0 items-center gap-2 ps-4 pe-2'

export const chatsPanelBodyVariants = cva('', {
  defaultVariants: { variant: 'plain' },
  variants: {
    variant: { card: 'px-2 pb-2', inset: 'p-2', plain: 'px-2 pb-2' },
  },
})

export const chatsPanelRowClassName =
  'flex w-full min-w-0 items-center gap-3 rounded-lg px-2 py-2.5 text-start'

export const chatsPanelItemClassName = cn(
  chatsPanelRowClassName,
  'group/chats-panel-item outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring aria-[current=true]:bg-accent',
)

export const chatsPanelMutedTextClassName =
  'text-muted-foreground group-hover/chats-panel-item:text-accent-foreground/72 group-aria-[current=true]/chats-panel-item:text-accent-foreground/72'

export const chatsPanelAvatarSlotClassName = 'relative flex shrink-0'

export const chatsPanelUnreadBadgeClassName =
  'absolute -end-1 -top-1 rounded-full outline-2 outline-background outline-solid'

export const chatsPanelChannelClassName =
  'absolute -end-1 -bottom-1 flex size-4 items-center justify-center rounded-full bg-background outline-2 outline-background outline-solid [&_svg]:size-full'

export const chatsPanelTextClassName = 'flex min-w-0 flex-1 flex-col gap-0.5'

export const chatsPanelLineClassName = 'flex h-5 min-w-0 items-center gap-2'

export const chatsPanelPreviewVariants = cva('min-w-0 truncate text-sm', {
  defaultVariants: { unread: false },
  variants: {
    unread: { false: chatsPanelMutedTextClassName, true: 'text-foreground' },
  },
})

export const chatsPanelSkeletonWidthVariants = cva('', {
  defaultVariants: { width: 'md' },
  variants: {
    width: {
      xs: 'w-8',
      sm: 'w-16',
      md: 'w-24',
      lg: 'w-32',
      xl: 'w-44',
    },
  },
})

export const chatsPanelSkeletonRows: readonly {
  name: ChatsPanelSkeletonWidth
  preview: ChatsPanelSkeletonWidth
}[] = [
  { name: 'md', preview: 'xl' },
  { name: 'lg', preview: 'lg' },
  { name: 'sm', preview: 'xl' },
  { name: 'md', preview: 'md' },
]
