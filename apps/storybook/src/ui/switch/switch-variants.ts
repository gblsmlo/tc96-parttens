export const switchSizeNames = ['default', 'small'] as const

export type SwitchSizeName = (typeof switchSizeNames)[number]

export const switchSizeClasses: Record<SwitchSizeName, string | undefined> = {
  default: undefined,
  small: '[--thumb-size:--spacing(4)] sm:[--thumb-size:--spacing(3)]',
}
