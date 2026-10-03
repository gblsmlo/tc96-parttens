import { describe, expect, test } from 'bun:test'
import { textSizes, textVariants } from './text'

describe('elements', () => {
  test('adapts Text to the canonical size and semantic color contracts', () => {
    expect(textSizes).toEqual(['sm', 'md', 'lg'])
    expect(textVariants()).toContain('text-base')
    expect(textVariants()).toContain('text-foreground')
    expect(textVariants({ foreground: 'muted', size: 'sm' })).toContain(
      'text-muted-foreground',
    )
    expect(textVariants({ foreground: 'muted', size: 'sm' })).toContain(
      'text-sm',
    )
  })
})
