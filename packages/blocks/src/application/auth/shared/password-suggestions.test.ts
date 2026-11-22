import { describe, expect, test } from 'bun:test'
import {
  defaultPasswordSuggestions,
  getPasswordSuggestions,
} from './password-suggestions'

describe('getPasswordSuggestions', () => {
  test('returns nothing for an empty password', () => {
    expect(getPasswordSuggestions('', defaultPasswordSuggestions)).toEqual([])
  })

  test('detects a lowercase letter alone', () => {
    expect(getPasswordSuggestions('abc', defaultPasswordSuggestions)).toEqual([
      'lowercase',
    ])
  })

  test('detects an uppercase letter alone', () => {
    expect(getPasswordSuggestions('ABC', defaultPasswordSuggestions)).toEqual([
      'uppercase',
    ])
  })

  test('detects a number alone', () => {
    expect(getPasswordSuggestions('123', defaultPasswordSuggestions)).toEqual([
      'number',
    ])
  })

  test('detects a symbol alone', () => {
    expect(getPasswordSuggestions('!@#', defaultPasswordSuggestions)).toEqual([
      'symbol',
    ])
  })

  test('does not count whitespace as a symbol', () => {
    expect(getPasswordSuggestions('   ', defaultPasswordSuggestions)).toEqual(
      [],
    )
  })

  test('returns nothing for an empty suggestions list', () => {
    expect(getPasswordSuggestions('Abc123!', [])).toEqual([])
  })

  test('only reports the requested suggestions, in their order', () => {
    expect(getPasswordSuggestions('Abc123!', ['number', 'lowercase'])).toEqual([
      'number',
      'lowercase',
    ])
  })

  test('returns every suggestion for a password that meets all four', () => {
    expect(
      getPasswordSuggestions('Abc123!', defaultPasswordSuggestions),
    ).toEqual(['lowercase', 'uppercase', 'number', 'symbol'])
  })
})
