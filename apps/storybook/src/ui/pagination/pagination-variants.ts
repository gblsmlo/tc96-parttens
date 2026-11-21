import type { ButtonProps } from '@tc96/ui/button'

type ButtonSizeName = NonNullable<ButtonProps['size']>

export const paginationSizeNames = [
  'xs',
  'sm',
  'default',
  'lg',
  'xl',
] as const satisfies readonly ButtonSizeName[]

export type PaginationSizeName = (typeof paginationSizeNames)[number]

export const pageLinkSizes: Record<PaginationSizeName, ButtonSizeName> = {
  default: 'icon',
  lg: 'icon-lg',
  sm: 'icon-sm',
  xl: 'icon-xl',
  xs: 'icon-xs',
}

export const paginationPages = [1, 2, 3] as const

export const paginationElementNames = ['a', 'button'] as const

export type PaginationElementName = (typeof paginationElementNames)[number]
