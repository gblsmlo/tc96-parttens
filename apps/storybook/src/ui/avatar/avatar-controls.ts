import type { ArgTypes } from '@storybook/react-vite'
import {
  type AvatarElementName,
  type AvatarSizeName,
  type AvatarTopmostName,
  avatarElementNames,
  avatarSizeNames,
  avatarTopmostNames,
} from './avatar-variants.ts'

export interface AvatarControls {
  broken: boolean
  count: boolean
  element: AvatarElementName
  group: boolean
  image: boolean
  initials: string
  name: string
  size: AvatarSizeName
  topmost: AvatarTopmostName
}

export const avatarControlArgs: AvatarControls = {
  broken: false,
  count: false,
  element: 'span',
  group: false,
  image: true,
  initials: 'AS',
  name: 'Ana Souza',
  size: '32px',
  topmost: 'first',
}

export const avatarControlArgTypes: Partial<ArgTypes<AvatarControls>> = {
  broken: {
    control: 'boolean',
    description:
      'When true, the source of `AvatarImage` fails to load, so the fallback stays.',
  },
  count: {
    control: 'boolean',
    description:
      'Adds an `AvatarGroupCount` with `+3` at the end of the group; acts only with `group` on.',
  },
  element: {
    control: 'inline-radio',
    description:
      'The element the avatar renders: a `span`, or a `button` through `render`, named by `name`.',
    options: avatarElementNames,
  },
  group: {
    control: 'boolean',
    description:
      'Puts the avatar first in an `AvatarGroup` with two more avatars.',
  },
  image: {
    control: 'boolean',
    description: 'Adds an `AvatarImage`; off leaves the fallback alone.',
  },
  initials: {
    control: 'text',
    description: 'Text of `AvatarFallback`; empty removes the part.',
  },
  name: {
    control: 'text',
    description:
      'The `alt` of `AvatarImage`, and the `aria-label` of the avatar as a `button`.',
  },
  size: {
    control: 'select',
    description:
      'Sets `--avatar-size` on the avatar, or on the group with `group` on.',
    options: avatarSizeNames,
  },
  topmost: {
    control: 'inline-radio',
    description: 'The `topmost` of `AvatarGroup`; acts only with `group` on.',
    options: avatarTopmostNames,
  },
}
