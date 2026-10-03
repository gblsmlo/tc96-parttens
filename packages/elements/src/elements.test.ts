import { describe, expect, test } from 'bun:test'
import { textSizes, textVariants } from './text'

describe('elements', () => {
  test('adapts Text to the Tailwind size scale and semantic color contracts', () => {
    expect(textSizes).toEqual([
      'xs',
      'sm',
      'base',
      'lg',
      'xl',
      '2xl',
      '3xl',
      '4xl',
      '5xl',
      '6xl',
      '7xl',
      '8xl',
    ])
    expect(textVariants()).toContain('text-base')
    expect(textVariants()).toContain('text-foreground')
    expect(textVariants({ foreground: 'muted', size: 'sm' })).toContain(
      'text-muted-foreground',
    )
    expect(textVariants({ foreground: 'muted', size: 'sm' })).toContain(
      'text-sm',
    )
    for (const size of textSizes) {
      expect(textVariants({ size })).toContain(`text-${size}`)
    }
  })

  test('renders headings through Text with the heading family and weight', () => {
    const heading = textVariants({
      family: 'heading',
      size: '2xl',
      weight: 'semibold',
    })
    expect(heading).toContain('font-heading')
    expect(heading).toContain('text-2xl')
    expect(heading).toContain('font-semibold')
  })
})
