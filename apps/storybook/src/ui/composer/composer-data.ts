import type { ComposerTrigger, ComposerValue } from '@tc96/ui/composer'

export const people: ComposerTrigger = {
  character: '@',
  items: [
    { id: 'sam', kind: 'person', label: 'Sam Rivera' },
    { id: 'jordan', kind: 'person', label: 'Jordan Lee' },
    { id: 'design', kind: 'team', label: 'Design team' },
  ],
}

export const actions: ComposerTrigger = {
  character: '/',
  items: [
    { id: 'summarize', label: 'Summarize', type: 'action' },
    { id: 'translate', label: 'Translate', type: 'action' },
  ],
}

export const loadingPeople: ComposerTrigger = {
  character: '@',
  filter: null,
  items: [],
  status: 'loading',
}

export const sampleTriggers: readonly ComposerTrigger[] = [people, actions]

export const textDraft = (text: string): ComposerValue => [
  { text, type: 'text' },
]
