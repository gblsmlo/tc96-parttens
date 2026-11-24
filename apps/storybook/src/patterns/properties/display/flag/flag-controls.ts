import type { ArgTypes } from '@storybook/react-vite'
import type { PropertyVariant } from '@tc96/ui/patterns'

export const flagVariants = ['badge', 'plain'] as const

export interface FlagControls {
  active: boolean
  ariaLabel: string
  icon: boolean
  inactiveLabel: string
  label: string
  showInactive: boolean
  variant: PropertyVariant
}

export const flagControlArgs: FlagControls = {
  active: true,
  ariaLabel: 'Run mode',
  icon: true,
  inactiveLabel: 'Manual',
  label: 'Automatic',
  showInactive: true,
  variant: 'badge',
}

export const flagControlArgTypes: Partial<ArgTypes<FlagControls>> = {
  active: {
    control: 'boolean',
    description: 'The `active` of `FlagProperty`.',
  },
  ariaLabel: {
    control: 'text',
    description:
      'The `ariaLabel` of `FlagProperty`, prefixed to the label in the accessible name; empty leaves the flag unnamed.',
  },
  icon: {
    control: 'boolean',
    description: 'Passes `activeIcon` and `inactiveIcon`.',
  },
  inactiveLabel: {
    control: 'text',
    description:
      'The `inactiveLabel` of `FlagProperty`; empty falls back to `label`.',
  },
  label: {
    control: 'text',
    description: 'The `label` of `FlagProperty`, shown while active.',
  },
  showInactive: {
    control: 'boolean',
    description:
      'The `showInactive` of `FlagProperty` (`false` by default; on here so turning `active` off shows the inactive flag). Acts only while `active` is off.',
  },
  variant: {
    control: 'inline-radio',
    description: 'The `variant` of `FlagProperty`.',
    options: flagVariants,
  },
}
