export const frameworks = [
  { label: 'Next.js', value: 'next' },
  { label: 'Vite', value: 'vite' },
  { label: 'Astro', value: 'astro' },
] as const

export type FrameworkValue = (typeof frameworks)[number]['value']

export const frameworkValues: FrameworkValue[] = frameworks.map(
  ({ value }) => value,
)

export const frameworkLabels: Record<FrameworkValue, string> = {
  astro: 'Astro',
  next: 'Next.js',
  vite: 'Vite',
}

export const disabledFramework: FrameworkValue = 'astro'
