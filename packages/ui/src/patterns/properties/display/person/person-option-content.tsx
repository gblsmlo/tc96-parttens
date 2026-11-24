'use client'

import { UserIcon } from '@phosphor-icons/react'
import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui/avatar'
import { resolveInitials } from '@tc96/ui/helpers/initials'

export type PersonAvatarSize = 'xs' | 'sm' | 'default' | 'lg' | 'xl'

const personAvatarSizeClassNames: Record<PersonAvatarSize, string | undefined> =
  {
    xs: '[--avatar-size:--spacing(4)] text-[0.625rem]',
    sm: '[--avatar-size:--spacing(6)] text-[0.625rem]',
    default: undefined,
    lg: '[--avatar-size:--spacing(10)]',
    xl: '[--avatar-size:--spacing(12)]',
  }

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
  size?: PersonAvatarSize
}>) {
  const resolved = option ? resolveInitials(option) : null
  const fallback =
    size === 'xs' && resolved !== null
      ? (Array.from(resolved)[0] ?? '')
      : resolved
  return (
    <Avatar className={personAvatarSizeClassNames[size]} data-size={size}>
      {option?.imageUrl ? <AvatarImage alt="" src={option.imageUrl} /> : null}
      <AvatarFallback className="border border-input">
        {fallback ?? <UserIcon aria-hidden className="size-4" />}
      </AvatarFallback>
    </Avatar>
  )
}

export function PersonOptionContent({
  option,
  size,
}: Readonly<{
  option: PersonPropertyOption
  size?: PersonAvatarSize
}>) {
  return (
    <span className="flex min-w-0 items-center gap-1.5">
      <PersonAvatar option={option} size={size} />
      <span className="min-w-0 truncate">{option.label}</span>
      {option.supportingLabel ? (
        <span className="hidden text-muted-foreground text-xs in-data-[slot=combobox-chip]:text-foreground/72 sm:inline">
          {option.supportingLabel}
        </span>
      ) : null}
    </span>
  )
}
