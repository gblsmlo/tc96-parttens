'use client'

import { resolveInitials } from '@tc96/helpers/initials'
import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui/avatar'
import { cn } from '@tc96/utils'
import { UserIcon } from 'lucide-react'

export interface PersonPropertyOption<TValue extends string = string> {
  value: TValue
  label: string
  fallback?: string
  imageUrl?: string
  supportingLabel?: string
}

export function PersonAvatar({
  className,
  option,
}: Readonly<{
  className?: string
  option: PersonPropertyOption | null
}>) {
  return (
    <Avatar className={cn('size-4 text-sm', className)}>
      {option?.imageUrl ? <AvatarImage alt="" src={option.imageUrl} /> : null}
      <AvatarFallback className="bg-muted/40 text-[0.625rem]">
        {option ? (
          resolveInitials(option)
        ) : (
          <UserIcon aria-hidden className="size-3" />
        )}
      </AvatarFallback>
    </Avatar>
  )
}

export function PersonOptionContent({
  avatarClassName,
  option,
}: Readonly<{
  avatarClassName?: string
  option: PersonPropertyOption
}>) {
  return (
    <span className="flex min-w-0 items-center gap-1.5">
      <PersonAvatar className={avatarClassName} option={option} />
      <span className="min-w-0 truncate">{option.label}</span>
      {option.supportingLabel ? (
        <span className="hidden text-muted-foreground text-xs sm:inline">
          {option.supportingLabel}
        </span>
      ) : null}
    </span>
  )
}
