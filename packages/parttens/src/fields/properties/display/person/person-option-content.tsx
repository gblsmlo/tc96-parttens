'use client'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  type AvatarSize,
} from '@tc96/elements/avatar'
import { resolveInitials } from '@tc96/helpers/initials'
import { UserIcon } from 'lucide-react'

export interface PersonPropertyOption<TValue extends string = string> {
  value: TValue
  label: string
  fallback?: string
  imageUrl?: string
  supportingLabel?: string
}

export function PersonAvatar({
  option,
  size = 'sm',
}: Readonly<{
  option: PersonPropertyOption | null
  size?: AvatarSize
}>) {
  return (
    <Avatar size={size}>
      {option?.imageUrl ? <AvatarImage alt="" src={option.imageUrl} /> : null}
      <AvatarFallback className="border border-input">
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
  option,
}: Readonly<{
  option: PersonPropertyOption
}>) {
  return (
    <span className="flex min-w-0 items-center gap-1.5">
      <PersonAvatar option={option} />
      <span className="min-w-0 truncate">{option.label}</span>
      {option.supportingLabel ? (
        <span className="hidden text-muted-foreground text-xs sm:inline">
          {option.supportingLabel}
        </span>
      ) : null}
    </span>
  )
}
