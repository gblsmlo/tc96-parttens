export const inputGroupSizeNames = ['sm', 'default', 'lg'] as const

export type InputGroupSizeName = (typeof inputGroupSizeNames)[number]

export const inputGroupAlignNames = [
  'inline-start',
  'inline-end',
  'block-start',
  'block-end',
] as const

export type InputGroupAlignName = (typeof inputGroupAlignNames)[number]
