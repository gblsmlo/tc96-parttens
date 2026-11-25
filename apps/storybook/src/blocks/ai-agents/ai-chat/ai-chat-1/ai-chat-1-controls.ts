import type { ArgTypes } from '@storybook/react-vite'

export interface AiChat1Controls {
  conversation: boolean
  replyDelay: number
  state: 'default' | 'pending' | 'error'
  withChips: boolean
  withToggles: boolean
  withUsage: boolean
}

export const aiChat1ControlArgs: AiChat1Controls = {
  conversation: true,
  replyDelay: 40,
  state: 'default',
  withChips: true,
  withToggles: true,
  withUsage: true,
}

export const aiChat1ControlArgTypes: Partial<ArgTypes<AiChat1Controls>> = {
  conversation: {
    control: 'boolean',
    description:
      'Starts on a thread with `messages`. Off, `messages` is empty and the starter view shows the `starters`.',
  },
  replyDelay: {
    control: { max: 200, min: 0, step: 10, type: 'number' },
    description:
      'Story only: milliseconds between the chunks of the canned reply, so `responding` and Stop can be seen. 0 answers at once.',
  },
  state: {
    control: 'inline-radio',
    description: 'The `pending` and `error` props of the thread.',
    options: ['default', 'pending', 'error'],
  },
  withChips: {
    control: 'boolean',
    description: 'The `chips` prop: context attached to the next message.',
  },
  withToggles: {
    control: 'boolean',
    description:
      'Passes `onWebSearchChange`, `onExtendedThinkingChange` and `onListeningChange`; each toggle renders only with its callback.',
  },
  withUsage: {
    control: 'boolean',
    description: 'The `usage` prop: the context window meter in the header.',
  },
}
