import type { ArgTypes } from '@storybook/react-vite'
import type { PropertyVariant } from '@tc96/ui/patterns'

export const personValues = ['gabriel', 'ana', 'marina', 'none'] as const

export type PersonValueControl = (typeof personValues)[number]

export const personDisplays = ['full', 'avatar'] as const

export type PersonDisplay = (typeof personDisplays)[number]

export const personAvatarSizes = ['xs', 'sm'] as const

export type PersonAvatarSize = (typeof personAvatarSizes)[number]

export const personVariants = ['badge', 'plain'] as const

export interface PersonControls {
  ariaLabel: string
  avatarSize: PersonAvatarSize
  disabled: boolean
  display: PersonDisplay
  placeholder: string
  readOnly: boolean
  value: PersonValueControl
  variant: PropertyVariant
}

export const personControlArgs: PersonControls = {
  ariaLabel: 'Responsável',
  avatarSize: 'xs',
  disabled: false,
  display: 'full',
  placeholder: 'Sem responsável',
  readOnly: false,
  value: 'gabriel',
  variant: 'badge',
}

export const personControlArgTypes: Partial<ArgTypes<PersonControls>> = {
  ariaLabel: {
    control: 'text',
    description:
      'The `ariaLabel` of `PersonProperty`, prefixed to the name of the person in the accessible name.',
  },
  avatarSize: {
    control: 'inline-radio',
    description:
      'The `avatarSize` of `PersonProperty`; the larger sizes it accepts do not fit the 24px surface.',
    options: personAvatarSizes,
  },
  disabled: {
    control: 'boolean',
    description: 'The `disabled` of `PersonProperty`.',
  },
  display: {
    control: 'inline-radio',
    description: 'The `display` of `PersonProperty`.',
    options: personDisplays,
  },
  placeholder: {
    control: 'text',
    description:
      'The `placeholder` of `PersonProperty`, shown and named while no one is set.',
  },
  readOnly: {
    control: 'boolean',
    description:
      'The `readOnly` of `PersonProperty`: the same look, with no list to open.',
  },
  value: {
    control: 'select',
    description: 'The person of `value`; `none` passes `null`.',
    options: personValues,
  },
  variant: {
    control: 'inline-radio',
    description: 'The `variant` of `PersonProperty`.',
    options: personVariants,
  },
}
