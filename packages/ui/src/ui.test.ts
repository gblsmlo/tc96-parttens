import { describe, expect, test } from 'bun:test'
import { buttonSizes, buttonVariants } from './button'
import { inputSizes, inputVariants } from './input'
import { textSizes, textVariants } from './text'

describe('canonical ui', () => {
  test('keeps the preferred compact button contract', () => {
    const className = buttonVariants({ size: 'sm', variant: 'outline' })

    expect(className).toContain('h-8')
    expect(className).toContain('border-input')
  })

  test('limits button sizes to sm, md, and lg with md as default', () => {
    expect(buttonSizes).toEqual(['sm', 'md', 'lg'])
    expect(buttonVariants()).toContain('h-9')
    expect(buttonVariants()).toContain('px-[calc(--spacing(3)-1px)]')
  })

  test('names the default button appearance primary', () => {
    const implicit = buttonVariants()
    const primary = buttonVariants({ variant: 'primary' })

    expect(implicit).toBe(primary)
    expect(primary).toContain('border-primary')
    expect(primary).toContain('bg-primary')
  })

  test('exposes primary, ghost, and outline destructive buttons', () => {
    const primary = buttonVariants({ variant: 'destructive' })
    const ghost = buttonVariants({ variant: 'destructive-ghost' })
    const outline = buttonVariants({ variant: 'destructive-outline' })

    expect(primary).toContain('bg-destructive')
    expect(primary).toContain('text-white')
    expect(ghost).toContain('border-transparent')
    expect(ghost).toContain('text-destructive-foreground')
    expect(ghost).toContain('hover:bg-destructive/8')
    expect(outline).toContain('border-input')
    expect(outline).toContain('text-destructive-foreground')
  })

  test('keeps input sizes limited to sm, md, and lg and aligned with buttons', () => {
    expect(inputSizes).toEqual(['sm', 'md', 'lg'])

    for (const size of ['sm', 'md', 'lg'] as const) {
      const inputClasses = new Set(inputVariants({ size }).split(' '))
      const buttonClasses = new Set(buttonVariants({ size }).split(' '))

      for (const prefix of ['h-', 'px-']) {
        expect([...inputClasses].filter((token) => token.startsWith(prefix))).toEqual(
          [...buttonClasses].filter((token) => token.startsWith(prefix)),
        )
      }
    }

    expect(inputVariants()).toContain('h-9')
  })

  test('uses the shared input border token for inputs and outlined buttons', async () => {
    const inputSource = await Bun.file(`${import.meta.dir}/input.tsx`).text()

    expect(inputSource).toContain('border border-input')
    expect(buttonVariants({ variant: 'outline' })).toContain('border-input')
  })

  test('adapts Text to the canonical size and semantic color contracts', () => {
    expect(textSizes).toEqual(['sm', 'md', 'lg'])
    expect(textVariants()).toContain('text-base')
    expect(textVariants()).toContain('text-foreground')
    expect(textVariants({ foreground: 'muted', size: 'sm' })).toContain('text-muted-foreground')
    expect(textVariants({ foreground: 'muted', size: 'sm' })).toContain('text-sm')
  })
})
