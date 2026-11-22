import type { ArgTypes } from '@storybook/react-vite'
import {
  type AssistantPlacement,
  assistantDefaultDisclaimer,
  assistantDefaultPlaceholder,
} from '@tc96/parttens'
import {
  type AssistantMessageSetName,
  assistantMessageSetNames,
  assistantPlacementNames,
} from './assistant-variants.ts'

export interface AssistantControls {
  attach: boolean
  badge: boolean
  description: string
  disclaimer: string
  end: boolean
  expandToggle: boolean
  expanded: boolean
  greeting: string
  history: boolean
  messages: AssistantMessageSetName
  newChat: boolean
  placeholder: string
  placement: AssistantPlacement
  retry: boolean
  suggestions: boolean
  title: string
  typing: boolean
}

export const assistantControlArgs: AssistantControls = {
  attach: true,
  badge: true,
  description: 'Li o fluxo, a última execução e o que você anexar.',
  disclaimer: assistantDefaultDisclaimer,
  end: true,
  expandToggle: true,
  expanded: false,
  greeting: 'Oi, Gabriel',
  history: true,
  messages: 'empty',
  newChat: true,
  placeholder: assistantDefaultPlaceholder,
  placement: 'floating',
  retry: true,
  suggestions: true,
  title: 'Assistente',
  typing: false,
}

export const assistantControlArgTypes: Partial<ArgTypes<AssistantControls>> = {
  attach: {
    control: 'boolean',
    description: 'Passes `onAttach`, which adds the attach button.',
  },
  badge: {
    control: 'boolean',
    description: 'The `badge` of `AssistantPanel`: the `Beta` badge.',
  },
  description: {
    control: 'text',
    description:
      'The `description` of the empty state; empty removes the part.',
  },
  disclaimer: {
    control: 'text',
    description:
      'The `disclaimer` under the composer; the line always renders.',
  },
  end: {
    control: 'boolean',
    description: 'Passes `onEnd`, which adds the `Encerrar` button.',
  },
  expandToggle: {
    control: 'boolean',
    description:
      'Passes `onExpandedChange`, which adds the `Expandir` or `Minimizar` button.',
  },
  expanded: {
    control: 'boolean',
    description:
      'The `expanded` of `AssistantPanel`; it only changes the size of a floating panel.',
  },
  greeting: {
    control: 'text',
    description: 'The `greeting` of the empty state; empty removes the part.',
  },
  history: {
    control: 'boolean',
    description: 'Passes `onHistory`, which adds the `Histórico` button.',
  },
  messages: {
    control: 'inline-radio',
    description:
      'The `messages`: none (the empty state), a conversation, or a question whose answer failed.',
    options: assistantMessageSetNames,
  },
  newChat: {
    control: 'boolean',
    description: 'Passes `onNewChat`, which adds the `Nova conversa` button.',
  },
  placeholder: {
    control: 'text',
    description: 'The `placeholder` of the composer.',
  },
  placement: {
    control: 'inline-radio',
    description:
      'The `placement` of `AssistantPanel`: over the corner of the frame, or filling it.',
    options: assistantPlacementNames,
  },
  retry: {
    control: 'boolean',
    description:
      'Passes `onRetry`; the retry button shows only on a failed answer.',
  },
  suggestions: {
    control: 'boolean',
    description:
      'Passes the `suggestions` the empty state lists; off removes the list.',
  },
  title: {
    control: 'text',
    description:
      'The `title` of `labels`, which names the panel; empty falls back to `Assistente`.',
  },
  typing: {
    control: 'boolean',
    description: 'The `typing` of `AssistantPanel`: the typing indicator.',
  },
}
