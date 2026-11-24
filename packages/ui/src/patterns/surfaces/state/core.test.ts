import { expect, test } from 'bun:test'
import { STATE_SURFACE_KINDS, type StateGuardProps } from './core'

test('covers exactly the five kinds', () => {
  expect([...STATE_SURFACE_KINDS]).toEqual([
    'empty',
    'no-result',
    'error',
    'permission',
    'not-found',
  ])
})

test('requires a surface outside the data state', () => {
  // @ts-expect-error surface is required when state is not data
  const missing: StateGuardProps = { children: null, state: 'error' }
  // @ts-expect-error surface is required when state is loading
  const missingLoading: StateGuardProps = { children: null, state: 'loading' }

  expect(missing).toBeTruthy()
  expect(missingLoading).toBeTruthy()
})
