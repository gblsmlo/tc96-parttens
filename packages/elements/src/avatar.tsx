'use client'

import { Avatar as UiAvatar } from '@tc96/ui/avatar'
import { cn } from '@tc96/utils'
import { cva } from 'class-variance-authority'
import type * as React from 'react'

export { AvatarFallback, AvatarImage } from '@tc96/ui/avatar'

export const avatarVariants = cva('', {
  defaultVariants: {
    size: 'default',
  },
  variants: {
    size: {
      sm: 'size-6 text-[0.625rem]',
      default: 'size-8 text-xs',
      lg: 'size-10 text-sm',
      xl: 'size-12 text-base',
    },
  },
})

export const avatarSizes = ['sm', 'default', 'lg', 'xl'] as const
export type AvatarSize = (typeof avatarSizes)[number]

export interface AvatarProps extends React.ComponentProps<typeof UiAvatar> {
  size?: AvatarSize
}

export function Avatar({
  className,
  size = 'default',
  ...props
}: AvatarProps): React.ReactElement {
  return (
    <UiAvatar
      className={cn(avatarVariants({ size }), className)}
      data-size={size}
      {...props}
    />
  )
}
