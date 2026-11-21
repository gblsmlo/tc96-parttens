export interface RadioOption {
  description?: string
  label: string
  value: string
}

export const frameworks = [
  {
    description: 'React with server rendering and file-based routes.',
    label: 'Next.js',
    value: 'next',
  },
  {
    description: 'A dev server and bundler for single-page apps.',
    label: 'Vite',
    value: 'vite',
  },
  {
    description: 'Content sites that ship little JavaScript.',
    label: 'Astro',
    value: 'astro',
  },
] as const

export type FrameworkValue = (typeof frameworks)[number]['value']

export type SelectionValue = FrameworkValue | 'none'

export const selectionValues: SelectionValue[] = [
  'next',
  'vite',
  'astro',
  'none',
]

export const selectionLabels: Record<SelectionValue, string> = {
  astro: 'Astro',
  next: 'Next.js',
  none: 'None',
  vite: 'Vite',
}

export const disabledFramework: FrameworkValue = 'vite'
