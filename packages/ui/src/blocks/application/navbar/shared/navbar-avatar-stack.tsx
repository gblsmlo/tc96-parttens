import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@tc96/ui/avatar'
import { getInitials } from '@tc96/ui/helpers/initials'
import type { ReactElement } from 'react'
import type { NavbarPerson } from './types'

export interface NavbarAvatarStackProps {
  label: string
  max?: number
  people: NavbarPerson[]
}

export function NavbarAvatarStack({
  label,
  max = 4,
  people,
}: Readonly<NavbarAvatarStackProps>): ReactElement {
  const visible = people.slice(0, max)
  const hidden = people.length - visible.length

  return (
    <AvatarGroup aria-label={label} role="group">
      {visible.map((person) => (
        <Avatar key={person.id} title={person.name}>
          {person.avatarUrl ? (
            <AvatarImage alt={person.name} src={person.avatarUrl} />
          ) : null}
          <AvatarFallback>{getInitials(person.name)}</AvatarFallback>
        </Avatar>
      ))}
      {hidden > 0 ? <AvatarGroupCount>+{hidden}</AvatarGroupCount> : null}
    </AvatarGroup>
  )
}
