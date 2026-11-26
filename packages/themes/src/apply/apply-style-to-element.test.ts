import { expect, test } from 'bun:test'
import { runtimeValue } from './apply-style-to-element'

test('compiles Tailwind alpha into color-mix and keeps other values', () => {
  expect(runtimeValue('--alpha(var(--color-black) / 4%)')).toBe(
    'color-mix(in oklab, var(--color-black) 4%, transparent)',
  )
  expect(runtimeValue('oklch(0.5 0 0)')).toBe('oklch(0.5 0 0)')
})
