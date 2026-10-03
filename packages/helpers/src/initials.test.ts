import { describe, expect, test } from 'bun:test'
import { getInitials } from './initials'

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
