export const breadcrumbSeparatorNames = ['chevron', 'slash'] as const

export type BreadcrumbSeparatorName = (typeof breadcrumbSeparatorNames)[number]

export const breadcrumbElementNames = ['a', 'button'] as const

export type BreadcrumbElementName = (typeof breadcrumbElementNames)[number]

export interface BreadcrumbLevel {
  href: string
  label: string
}

export const breadcrumbRootLevel: BreadcrumbLevel = {
  href: '#/',
  label: 'Home',
}

export const breadcrumbHiddenLevels: readonly BreadcrumbLevel[] = [
  { href: '#/documents', label: 'Documents' },
  { href: '#/documents/finance', label: 'Finance' },
]

export const breadcrumbParentLevel: BreadcrumbLevel = {
  href: '#/documents/finance/reports',
  label: 'Reports',
}
