export const fallbackStacks: Record<
  'sans-serif' | 'serif' | 'monospace',
  string[]
> = {
  'sans-serif': [
    'ui-sans-serif',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'sans-serif',
  ],
  serif: [
    'ui-serif',
    'Georgia',
    'Cambria',
    'Times New Roman',
    'Times',
    'serif',
  ],
  monospace: [
    'ui-monospace',
    'SFMono-Regular',
    'Menlo',
    'Monaco',
    'Consolas',
    'Liberation Mono',
    'monospace',
  ],
}

const localFamilies = new Set([
  ...Object.values(fallbackStacks).flat(),
  'Arial',
  'Courier New',
  'Helvetica Neue',
])

const unquotedFamily = /^-?[A-Za-z][\w-]*$/

/** The family names of a CSS font stack, without quotes. */
export function familiesOf(value: string): string[] {
  return value
    .split(',')
    .map((family) => family.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean)
}

/**
 * Normalizes a font stack: quotes multi-word names (`Source Serif 4` is not
 * valid CSS unquoted) and puts the default stack before the generic family,
 * so a font that did not load falls back to the same system font as the
 * default theme.
 */
export function fontStack(value: string): string {
  const families = familiesOf(value)
  const index = families.findIndex((family) => family in fallbackStacks)
  const generic = (
    index === -1 ? 'sans-serif' : families[index]
  ) as keyof typeof fallbackStacks
  const head = index === -1 ? families : families.slice(0, index)
  const tail = index === -1 ? [] : families.slice(index + 1)
  const stack = [...new Set([...head, ...fallbackStacks[generic], ...tail])]
  return stack
    .map((family) => (unquotedFamily.test(family) ? family : `"${family}"`))
    .join(', ')
}

/** The web fonts named first in the given sans, serif and mono stacks. */
export function webFonts(stacks: (string | undefined)[]): string[] {
  const fonts = stacks
    .map((stack) => familiesOf(stack ?? '')[0])
    .filter((family): family is string => Boolean(family))
    .filter((family) => !localFamilies.has(family))
  return [...new Set(fonts)]
}
