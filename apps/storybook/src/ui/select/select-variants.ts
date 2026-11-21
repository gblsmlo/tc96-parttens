export const selectSizeNames = ['sm', 'default', 'lg'] as const

export type SelectSizeName = (typeof selectSizeNames)[number]

export const selectSideNames = ['bottom', 'top', 'left', 'right'] as const

export type SelectSideName = (typeof selectSideNames)[number]

export const selectAlignNames = ['start', 'center', 'end'] as const

export type SelectAlignName = (typeof selectAlignNames)[number]

export interface SelectOption {
  label: string
  value: string
}

export interface SelectOptionGroup {
  items: SelectOption[]
  label: string
}

export const selectOptionGroups: SelectOptionGroup[] = [
  {
    items: [
      { label: 'Next.js', value: 'next' },
      { label: 'Vite', value: 'vite' },
      { label: 'Astro', value: 'astro' },
    ],
    label: 'Frontend',
  },
  {
    items: [
      { label: 'Express', value: 'express' },
      { label: 'NestJS', value: 'nestjs' },
      { label: 'Fastify', value: 'fastify' },
    ],
    label: 'Backend',
  },
]

export const selectOptions: SelectOption[] = selectOptionGroups.flatMap(
  (group) => group.items,
)

export const selectValueNames: string[] = [
  'none',
  ...selectOptions.map((option) => option.value),
]
