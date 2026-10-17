import { describe, expect, test } from 'bun:test'
import { z } from 'zod'
import { createEntryParser } from './entry-parser'

describe('createEntryParser', () => {
  const parse = createEntryParser(
    z.string().min(3, 'Curto demais.'),
    'Inválido.',
  )

  test('returns the parsed value on success', () => {
    expect(parse('abc')).toEqual({ success: true, value: 'abc' })
  })

  test('returns the first schema issue as the message', () => {
    expect(parse('ab')).toEqual({ message: 'Curto demais.', success: false })
  })

  test('uses the schema output, not the raw input', () => {
    expect(createEntryParser(z.string().trim(), 'Inválido.')('  a ')).toEqual({
      success: true,
      value: 'a',
    })
  })
})
