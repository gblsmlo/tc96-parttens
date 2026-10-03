import { getInitials } from '@tc96/helpers/initials'
import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui/avatar'
import { cn } from '@tc96/utils'
import type { ComponentProps, ReactElement } from 'react'

export interface AvatarStackPerson {
  fallback?: string
  id: string
  imageUrl?: string
  label: string
}

export interface AvatarStackProps
  extends Omit<ComponentProps<'ul'>, 'children'> {
  'aria-label'?: string
  max?: number
  people: readonly AvatarStackPerson[]
  size?: 'default' | 'sm'
}

const sizes = {
  default: 'size-7 text-xs',
  sm: 'size-6 text-[0.625rem]',
} as const

export function AvatarStack({
  'aria-label': ariaLabel = 'Pessoas',
  className,
  max = 3,
  people,
  size = 'default',
  ...props
}: Readonly<AvatarStackProps>): ReactElement {
  const shown = people.slice(0, max)
  const hidden = people.slice(max)

  return (
    <ul
      aria-label={ariaLabel}
      className={cn('flex items-center -space-x-2', className)}
      data-slot="avatar-stack"
      {...props}
    >
      {shown.map((person) => (
        <li
          className="flex rounded-full border border-input bg-card"
          key={person.id}
        >
          <Avatar className={sizes[size]}>
            {person.imageUrl ? (
              <AvatarImage alt="" src={person.imageUrl} />
            ) : null}
            <AvatarFallback>
              {person.fallback ?? getInitials(person.label)}
            </AvatarFallback>
          </Avatar>
          <span className="sr-only">{person.label}</span>
        </li>
      ))}
      {hidden.length ? (
        <li className="flex rounded-full border border-input bg-card">
          <span
            className={cn(
              'inline-flex shrink-0 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground tabular-nums',
              sizes[size],
            )}
            data-slot="avatar-stack-overflow"
          >
            <span aria-hidden="true">+{hidden.length}</span>
            <span className="sr-only">
              {hidden.map((person) => person.label).join(', ')}
            </span>
          </span>
        </li>
      ) : null}
    </ul>
  )
}
