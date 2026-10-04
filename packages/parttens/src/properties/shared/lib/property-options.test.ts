import { describe, expect, test } from 'bun:test'
import {
  diffOptions,
  diffValues,
  resolveOption,
  resolveOptions,
} from './property-options'

const options = [
  { label: 'Ana', value: 'ana' },
  { label: 'Bruno', value: 'bruno' },
]

describe('resolveOption', () => {
  test('returns the catalog option', () => {
    expect(resolveOption(options, 'bruno')).toBe(options[1])
  })

  test('falls back to the value as label when missing', () => {
    expect(resolveOption(options, 'carla')).toEqual({
      label: 'carla',
      value: 'carla',
    })
  })
})

describe('resolveOptions', () => {
  test('keeps the order of the values', () => {
    expect(resolveOptions(options, ['bruno', 'ana', 'carla'])).toEqual([
      options[1],
      options[0],
      { label: 'carla', value: 'carla' },
    ])
  })
})

describe('diffValues', () => {
  test('reports the first added and the first removed', () => {
    expect(diffValues(['a', 'b'], ['b', 'c', 'd'])).toEqual({
      added: 'c',
      removed: 'a',
    })
  })

  test('reports null when nothing changed', () => {
    expect(diffValues(['a'], ['a'])).toEqual({ added: null, removed: null })
  })

  test('reports a removal without an addition', () => {
    expect(diffValues(['a', 'b'], ['a'])).toEqual({
      added: null,
      removed: 'b',
    })
  })
})

describe('diffOptions', () => {
  test('maps the diff back to options, keeping the fallback for unknown values', () => {
    expect(diffOptions(options, ['carla'], ['ana'])).toEqual({
      added: options[0],
      removed: { label: 'carla', value: 'carla' },
    })
  })

  test('reports null when nothing changed', () => {
    expect(diffOptions(options, ['ana'], ['ana'])).toEqual({
      added: null,
      removed: null,
    })
  })
})
