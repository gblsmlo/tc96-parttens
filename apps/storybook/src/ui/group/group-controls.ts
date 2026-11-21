import type { ArgTypes } from '@storybook/react-vite'
import {
  type GroupOrientationName,
  groupOrientationNames,
} from './group-variants.ts'

export interface GroupControls {
  label: string
  orientation: GroupOrientationName
  text: string
}

export const groupControlArgs: GroupControls = {
  label: 'Insert',
  orientation: 'horizontal',
  text: '',
}

export const groupControlArgTypes: Partial<ArgTypes<GroupControls>> = {
  label: {
    control: 'text',
    description: 'The `aria-label` that names the group.',
  },
  orientation: {
    control: 'select',
    description:
      'The `orientation` of `Group`; `vertical` also turns the separators horizontal.',
    options: groupOrientationNames,
  },
  text: {
    control: 'text',
    description:
      'Text of a `GroupText` before the buttons; empty removes the part.',
  },
}
