import type { AssistantMessage } from '@tc96/ui/patterns'
import { failedMessages, messages } from './fixtures/assistant'

export const assistantPlacementNames = ['docked', 'floating'] as const

export const assistantMessageSetNames = [
  'empty',
  'conversation',
  'failed',
] as const

export type AssistantMessageSetName = (typeof assistantMessageSetNames)[number]

export const assistantMessageSets: Record<
  AssistantMessageSetName,
  readonly AssistantMessage[]
> = {
  conversation: messages,
  empty: [],
  failed: failedMessages,
}
