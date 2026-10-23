import { expect, test } from 'bun:test'
import type { FlowStepType } from '../canvas/core'
import { groupStepTypes } from './core'

const types: FlowStepType[] = [
  { group: 'Mensagens', id: 'send-email', label: 'Enviar e-mail' },
  { group: 'Dados', id: 'read-record', label: 'Ler registro' },
  { group: 'Mensagens', id: 'send-sms', label: 'Enviar SMS' },
]

test('groups step types by group in order of first appearance', () => {
  expect(groupStepTypes(types)).toEqual([
    {
      label: 'Mensagens',
      types: [types[0], types[2]],
    },
    { label: 'Dados', types: [types[1]] },
  ])
})

test('returns no groups for no step types', () => {
  expect(groupStepTypes([])).toEqual([])
})

test('keeps the order of step types inside a group', () => {
  const [group] = groupStepTypes([types[2], types[0]])

  expect(group?.types.map((type) => type.id)).toEqual([
    'send-sms',
    'send-email',
  ])
})
