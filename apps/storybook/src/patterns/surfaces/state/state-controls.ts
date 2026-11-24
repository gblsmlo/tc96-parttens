import type { ArgTypes } from '@storybook/react-vite'
import type { StateGuardState } from '@tc96/ui/patterns'
import {
  type StateIconMode,
  stateIconModes,
  stateNames,
} from './state-variants.ts'

export interface StateControls {
  actionLabel: string
  actions: boolean
  content: string
  description: string
  icon: StateIconMode
  state: StateGuardState
  title: string
}

export const stateControlArgs: StateControls = {
  actionLabel: 'Try again',
  actions: false,
  content: 'Confidential record',
  description: 'The consumer writes this text for every state.',
  icon: 'default',
  state: 'empty',
  title: 'Nothing to show here',
}

export const stateControlArgTypes: Partial<ArgTypes<StateControls>> = {
  actionLabel: {
    control: 'text',
    description: 'Text of the button passed in `actions`.',
  },
  actions: {
    control: 'boolean',
    description:
      'Passes an outline button in `actions`, below the text; it has no effect in `loading` and `data`.',
  },
  content: {
    control: 'text',
    description:
      'Text of the paragraph passed as `children`, which mounts only in `data`.',
  },
  description: {
    control: 'text',
    description:
      'The `description` of the surface; in `loading` an empty text removes it.',
  },
  icon: {
    control: 'select',
    description:
      'The `icon` of the surface: `"default"` keeps the icon of the kind, `"custom"` passes a bell icon and `"none"` passes `null`, which removes the frame. It has no effect in `loading` and `data`.',
    options: stateIconModes,
  },
  state: {
    control: 'select',
    description:
      'The `state` of `StateGuard`: one of the five kinds, `"loading"` or `"data"`.',
    options: stateNames,
  },
  title: {
    control: 'text',
    description: 'The `title` of the surface or of the loading block.',
  },
}
