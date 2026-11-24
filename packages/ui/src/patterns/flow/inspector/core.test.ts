import { expect, test } from 'bun:test'
import { flowStepAbandonment, formatFlowDuration } from './core'

test('computes the abandonment as a rounded percentage of the entries', () => {
  expect(flowStepAbandonment({ entered: 8, completed: 6 })).toBe(25)
  expect(flowStepAbandonment({ entered: 3, completed: 2 })).toBe(33)
  expect(flowStepAbandonment({ entered: 5, completed: 5 })).toBe(0)
})

test('has no abandonment without entries and never goes below zero', () => {
  expect(flowStepAbandonment({ entered: 0, completed: 0 })).toBeNull()
  expect(flowStepAbandonment({ entered: 2, completed: 4 })).toBe(0)
})

test('formats durations in milliseconds, seconds and minutes', () => {
  expect(formatFlowDuration(240)).toBe('240 ms')
  expect(formatFlowDuration(1500)).toBe('1,5 s')
  expect(formatFlowDuration(12000)).toBe('12 s')
  expect(formatFlowDuration(125000)).toBe('2 min 5 s')
})

test('has no duration when it is missing or negative', () => {
  expect(formatFlowDuration(undefined)).toBeNull()
  expect(formatFlowDuration(-1)).toBeNull()
})
