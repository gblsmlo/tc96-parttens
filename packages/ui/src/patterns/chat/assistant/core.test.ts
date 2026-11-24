import { expect, test } from 'bun:test'
import {
  assistantDefaultLabels,
  assistantDraftText,
  assistantItemCount,
  mergeAssistantLabels,
} from './core'

test('mergeAssistantLabels keeps the defaults and applies overrides', () => {
  expect(mergeAssistantLabels()).toEqual(assistantDefaultLabels)
  expect(mergeAssistantLabels({ title: 'Copiloto' })).toEqual({
    ...assistantDefaultLabels,
    title: 'Copiloto',
  })
  expect(assistantDefaultLabels.title).toBe('Assistente')
})

test('assistantDraftText trims and rejects blank drafts', () => {
  expect(assistantDraftText('  oi  ')).toBe('oi')
  expect(assistantDraftText('   \n ')).toBeNull()
  expect(assistantDraftText('')).toBeNull()
})

test('assistantItemCount counts the typing indicator as one item', () => {
  const messages = [
    { id: '1', role: 'user' as const, text: 'a' },
    { id: '2', role: 'assistant' as const, text: 'b' },
  ]

  expect(assistantItemCount(messages, false)).toBe(2)
  expect(assistantItemCount(messages, true)).toBe(3)
  expect(assistantItemCount([], true)).toBe(1)
})
