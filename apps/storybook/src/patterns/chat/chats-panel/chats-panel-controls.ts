import type { ArgTypes } from '@storybook/react-vite'
import type { ChatsPanelVariant } from '@tc96/ui/patterns'
import {
  type ChatsPanelContentName,
  type ChatsPanelItemElementName,
  chatsPanelContentNames,
  chatsPanelItemElementNames,
  chatsPanelVariantNames,
} from './chats-panel-variants.ts'

export interface ChatsPanelControls {
  actions: boolean
  channel: boolean
  content: ChatsPanelContentName
  itemElement: ChatsPanelItemElementName
  preview: boolean
  selected: boolean
  time: boolean
  title: string
  variant: ChatsPanelVariant
}

export const chatsPanelControlArgs: ChatsPanelControls = {
  actions: true,
  channel: true,
  content: 'list',
  itemElement: 'button',
  preview: true,
  selected: false,
  time: true,
  title: 'Chat',
  variant: 'plain',
}

export const chatsPanelControlArgTypes: Partial<ArgTypes<ChatsPanelControls>> =
  {
    actions: {
      control: 'boolean',
      description:
        'Adds a `ViewSettingsMenu` in a `CollectionToolbar` to `actions`.',
    },
    channel: {
      control: 'boolean',
      description: 'Passes the `channel` mark of each conversation.',
    },
    content: {
      control: 'inline-radio',
      description:
        'The children of `ChatsPanel`: the `ChatsPanelList`, a `ChatsPanelSkeleton`, or an empty state.',
      options: chatsPanelContentNames,
    },
    itemElement: {
      control: 'inline-radio',
      description:
        'The element of each `ChatsPanelItem`: the default `button`, or an `a` through `render`.',
      options: chatsPanelItemElementNames,
    },
    preview: {
      control: 'boolean',
      description: 'Passes the `preview` line of each conversation.',
    },
    selected: {
      control: 'boolean',
      description: 'Sets `selected` on the first conversation.',
    },
    time: {
      control: 'boolean',
      description: 'Passes the `time` of each conversation.',
    },
    title: {
      control: 'text',
      description:
        'The `title` of `ChatsPanel`, which names the panel and the list.',
    },
    variant: {
      control: 'inline-radio',
      description: 'The `variant` of `ChatsPanel`.',
      options: chatsPanelVariantNames,
    },
  }
