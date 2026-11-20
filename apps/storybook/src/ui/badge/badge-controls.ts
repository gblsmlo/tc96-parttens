import type { ArgTypes } from '@storybook/react-vite'
import {
  type BadgeElementName,
  type BadgeSizeName,
  type BadgeVariantName,
  badgeElementNames,
  badgeSizeNames,
  badgeVariantNames,
} from './badge-variants.ts'

export interface BadgeControls {
  element: BadgeElementName
  icon: boolean
  label: string
  size: BadgeSizeName
  variant: BadgeVariantName
}

export const badgeControlArgs: BadgeControls = {
  element: 'span',
  icon: false,
  label: 'Badge',
  size: 'default',
  variant: 'primary',
}

export const badgeControlArgTypes: Partial<ArgTypes<BadgeControls>> = {
  element: {
    control: 'inline-radio',
    description:
      'The element the badge renders: a `span`, or an `a` or a `button` through `render`.',
    options: badgeElementNames,
  },
  icon: {
    control: 'boolean',
    description: 'Adds a decorative icon before the text.',
  },
  label: {
    control: 'text',
    description: 'Text of the badge.',
  },
  size: {
    control: 'inline-radio',
    description: 'The `size` of `Badge`.',
    options: badgeSizeNames,
  },
  variant: {
    control: 'select',
    description: 'The `variant` of `Badge`.',
    options: badgeVariantNames,
  },
}
