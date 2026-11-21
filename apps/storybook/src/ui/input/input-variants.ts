export const inputSizeNames = ['sm', 'default', 'lg'] as const

export type InputSizeName = (typeof inputSizeNames)[number]

export const inputTypeNames = [
  'text',
  'email',
  'password',
  'search',
  'file',
] as const

export type InputTypeName = (typeof inputTypeNames)[number]
