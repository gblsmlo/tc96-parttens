import type { ButtonProps } from '@tc96/ui/button'

export type ButtonVariantName = NonNullable<ButtonProps['variant']>

export type ButtonSizeName = NonNullable<ButtonProps['size']>

export const buttonVariantNames = [
  'default',
  'secondary',
  'outline',
  'destructive',
  'destructive-outline',
  'ghost',
  'link',
] as const satisfies readonly ButtonVariantName[]

export const buttonTextSizeNames = [
  'xs',
  'sm',
  'default',
  'lg',
  'xl',
] as const satisfies readonly ButtonSizeName[]

export const buttonIconSizeNames = [
  'icon-xs',
  'icon-sm',
  'icon',
  'icon-lg',
  'icon-xl',
] as const satisfies readonly ButtonSizeName[]

export const buttonSizeNames = [
  ...buttonTextSizeNames,
  ...buttonIconSizeNames,
] as const

export const isIconSize = (size: ButtonSizeName) => size.startsWith('icon')
