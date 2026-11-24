import type { ArgTypes } from '@storybook/react-vite'
import type { PropertyVariant } from '@tc96/ui/patterns'

export const iconLabelElements = ['span', 'button', 'link'] as const

export type IconLabelElement = (typeof iconLabelElements)[number]

export const iconLabelTrailingVisibilities = ['always', 'hover'] as const

export type IconLabelTrailingVisibility =
  (typeof iconLabelTrailingVisibilities)[number]

export const propertyVariants = ['badge', 'plain'] as const

export interface IconLabelControls {
  ariaLabel: string
  element: IconLabelElement
  icon: boolean
  label: string
  leading: boolean
  muted: boolean
  trailing: boolean
  trailingVisibility: IconLabelTrailingVisibility
  variant: PropertyVariant
}

export const iconLabelControlArgs: IconLabelControls = {
  ariaLabel: 'Origem',
  element: 'span',
  icon: true,
  label: 'Manual',
  leading: false,
  muted: false,
  trailing: false,
  trailingVisibility: 'always',
  variant: 'badge',
}

export const iconLabelControlArgTypes: Partial<ArgTypes<IconLabelControls>> = {
  ariaLabel: {
    control: 'text',
    description:
      'The `ariaLabel` of `IconLabelProperty`, prefixed to the label in the accessible name; empty leaves the surface unnamed.',
  },
  element: {
    control: 'inline-radio',
    description:
      'The element of the surface through `render`: a `span`, a `button` or a link. `trailing` shows only with `span`.',
    options: iconLabelElements,
  },
  icon: {
    control: 'boolean',
    description: 'Passes an `icon` before the label.',
  },
  label: {
    control: 'text',
    description: 'The `label` of `IconLabelProperty`.',
  },
  leading: {
    control: 'boolean',
    description: 'Passes a colored dot as `leading`, before the icon.',
  },
  muted: {
    control: 'boolean',
    description: 'The `muted` of `IconLabelProperty`: the empty look.',
  },
  trailing: {
    control: 'boolean',
    description:
      'Passes a remove button as `trailing`, after the label. Shows only with the `span` element.',
  },
  trailingVisibility: {
    control: 'inline-radio',
    description:
      'The `trailingVisibility` of `IconLabelProperty`; acts only with `trailing`.',
    options: iconLabelTrailingVisibilities,
  },
  variant: {
    control: 'inline-radio',
    description: 'The `variant` of `IconLabelProperty`.',
    options: propertyVariants,
  },
}
