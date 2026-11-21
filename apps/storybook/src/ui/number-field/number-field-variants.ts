export const numberFieldSizeNames = ['sm', 'default', 'lg'] as const

export type NumberFieldSizeName = (typeof numberFieldSizeNames)[number]

export const numberFieldFormatNames = ['none', 'currency', 'unit'] as const

export type NumberFieldFormatName = (typeof numberFieldFormatNames)[number]

export const numberFieldFormats: Record<
  NumberFieldFormatName,
  Intl.NumberFormatOptions | undefined
> = {
  currency: { currency: 'USD', style: 'currency' },
  none: undefined,
  unit: { style: 'unit', unit: 'kilogram' },
}
