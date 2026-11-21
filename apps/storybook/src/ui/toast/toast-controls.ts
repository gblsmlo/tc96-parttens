import type { ArgTypes } from '@storybook/react-vite'
import type { ToastPosition } from '@tc96/ui/toast'
import {
  type ToastTypeName,
  toastPositions,
  toastTypeNames,
} from './toast-variants.ts'

export interface ToastControls {
  action: boolean
  description: string
  position: ToastPosition
  title: string
  type: ToastTypeName
}

export const toastControlArgs: ToastControls = {
  action: false,
  description: 'Describe what happened here.',
  position: 'bottom-right',
  title: 'Heads up!',
  type: 'default',
}

export const toastControlArgTypes: Partial<ArgTypes<ToastControls>> = {
  action: {
    control: 'boolean',
    description: 'Adds `actionProps`, an `Undo` button that closes the toast.',
  },
  description: {
    control: 'text',
    description: 'The `description` of the toast; empty removes the part.',
  },
  position: {
    control: 'select',
    description: 'The `position` of `ToastProvider`.',
    options: toastPositions,
  },
  title: {
    control: 'text',
    description:
      'The `title` of the toast, which names it; empty removes the part and the name.',
  },
  type: {
    control: 'select',
    description: 'The `type` of the toast; `default` passes none.',
    options: toastTypeNames,
  },
}
