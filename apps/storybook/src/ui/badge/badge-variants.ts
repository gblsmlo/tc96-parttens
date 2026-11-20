export const badgeVariantNames = [
  'primary',
  'secondary',
  'outline',
  'destructive',
  'error',
  'info',
  'success',
  'warning',
] as const

export type BadgeVariantName = (typeof badgeVariantNames)[number]

export const badgeSizeNames = ['default', 'large'] as const

export type BadgeSizeName = (typeof badgeSizeNames)[number]

export const badgeElementNames = ['span', 'link', 'button'] as const

export type BadgeElementName = (typeof badgeElementNames)[number]
