import type { ArgTypes } from '@storybook/react-vite'

export interface KbdControls {
  icon: boolean
  keys: string
}

export const kbdControlArgs: KbdControls = {
  icon: false,
  keys: '⌘',
}

export const kbdControlArgTypes: Partial<ArgTypes<KbdControls>> = {
  icon: {
    control: 'boolean',
    description:
      'Adds an Enter key drawn by an icon after the typed keys; with empty `keys` it is the only key.',
  },
  keys: {
    control: 'text',
    description:
      'Keys separated by spaces: one key renders a `Kbd`, several render one `Kbd` each inside a `KbdGroup`.',
  },
}
