import { describe, expect, test } from 'bun:test'
import { getInitials, resolveInitials } from './initials'

describe('@helpers getInitials', () => {
  test('takes the first letter of the first two words, upper-cased', () => {
    expect(getInitials('Gabriel Melo')).toBe('GM')
    expect(getInitials('ana lúcia prado')).toBe('AL')
  })

  test('ignores extra whitespace', () => {
    expect(getInitials('  Maria   da  Silva ')).toBe('MD')
    expect(getInitials('Joana\tFerreira')).toBe('JF')
  })

  test('respects the requested size', () => {
    expect(getInitials('Pedro Álvares Cabral', 3)).toBe('PÁC')
    expect(getInitials('Pedro Álvares Cabral', 1)).toBe('P')
  })

  test('handles a single word and an empty label', () => {
    expect(getInitials('Madonna')).toBe('M')
    expect(getInitials('')).toBe('')
    expect(getInitials('   ')).toBe('')
  })
})

describe('@helpers resolveInitials', () => {
  test('falls back to the initials of the label', () => {
    expect(resolveInitials({ label: 'Gabriel Melo' })).toBe('GM')
    expect(resolveInitials({ fallback: undefined, label: 'Ana Souza' })).toBe(
      'AS',
    )
  })

  test('prefers the explicit fallback', () => {
    expect(resolveInitials({ fallback: 'G!', label: 'Gabriel Melo' })).toBe(
      'G!',
    )
  })

  test('keeps an explicit empty fallback, since only undefined falls through', () => {
    expect(resolveInitials({ fallback: '', label: 'Gabriel Melo' })).toBe('')
  })

  test('forwards the size to the label initials', () => {
    expect(resolveInitials({ label: 'Pedro Álvares Cabral' }, 3)).toBe('PÁC')
    expect(
      resolveInitials({ fallback: 'X', label: 'Pedro Álvares Cabral' }, 3),
    ).toBe('X')
  })
})
